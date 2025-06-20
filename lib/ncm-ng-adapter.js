'use strict'

const path = require('path')
const fs = require('fs')
const debug = require('debug')('ncm:adapter')

// Create debug logger directory if it doesn't exist
const logDir = path.join(process.cwd(), '.ncm-logs')
if (!fs.existsSync(logDir)) {
  try { fs.mkdirSync(logDir) } catch (e) {}
}

// Helper function to log debug info to file
function logDebug (message, data) {
  const logFile = path.join(logDir, 'ncm-adapter-debug.log')
  const timestamp = new Date().toISOString()
  const logMessage = `[${timestamp}] ${message}\n${data ? JSON.stringify(data, null, 2) : ''}\n\n`
  try {
    fs.appendFileSync(logFile, logMessage)
  } catch (e) {}
  debug(message)
}

// Import ncm-ng
let ncmAgent
try {
  logDebug('Attempting to load ncm-ng from relative path')
  ncmAgent = require('../../ncm-ng')
  logDebug('Successfully loaded ncm-ng from relative path')
} catch (err) {
  logDebug('Failed to load from relative path', { error: err.message })
  try {
    // Try to load from node_modules
    logDebug('Attempting to load ncm-ng from node_modules')
    ncmAgent = require('@ns-private/ncm-ng')
    logDebug('Successfully loaded ncm-ng from node_modules')
  } catch (innerErr) {
    // Handle gracefully if ncm-ng is not installed
    logDebug('Failed to load ncm-ng', { error: innerErr.message })
    console.error('ncm-ng dependency not found. Make sure it is installed correctly.')
  }
}

/**
 * Adapts the ncm-ng certification process to match the format expected by ncm-cli
 * @param {Array<Object>} packages Array of package objects with name and version
 * @param {Object} options Options for certification
 * @returns {Promise<Array>} Certification results in format expected by ncm-cli
 */
async function certifyPackages (packages, options = {}) {
  if (!ncmAgent) {
    const error = 'ncm-ng dependency not found. Make sure it is installed correctly.'
    logDebug('Certification error', { error })
    throw new Error(error)
  }

  const { dir = process.cwd() } = options
  logDebug('Starting certification with ncm-ng', { numPackages: packages.length, dir })

  const agent = ncmAgent()
  logDebug('ncm-ng agent created', { agent: !!agent })

  const results = []
  const callbackMap = new Map() // To store resolve functions for each package

  // Process each package using ncm-ng
  const certifyPromises = packages.map(pkg => {
    const pkgId = `${pkg.name}@${pkg.version}`
    logDebug('Processing package', { pkg, pkgId })

    return new Promise((resolve) => {
      // Store the resolve function for this promise
      callbackMap.set(pkgId, resolve)

      const pkgPath = path.join(dir, 'node_modules', pkg.name)

      // Check if package exists in node_modules before certifying
      let packageExists = false
      try {
        fs.accessSync(pkgPath)
        packageExists = true
        logDebug('Package found in node_modules', { pkg: pkg.name, path: pkgPath })
      } catch (err) {
        logDebug('Package not found in node_modules, using package.json info only', { pkg: pkg.name, error: err.message })
        // Package not found in node_modules - use package.json info only
      }

      const certifyRequest = {
        name: pkg.name,
        version: pkg.version,
        path: packageExists ? pkgPath : dir,
        callback: (err, pkgVer, nameVersion, certData) => {
          logDebug('Certification callback received', { pkg: pkg.name, nameVersion, hasError: !!err, hasCertData: !!certData })

          if (err) {
            // Add empty result with error info if certification fails
            logDebug('Certification error for package', { pkg: pkg.name, error: err.message || 'Unknown error' })
            results.push({
              name: pkg.name,
              version: pkg.version,
              published: true,
              scores: [],
              error: err.message || 'Certification failed'
            })
          } else if (certData) {
            // Log certification data
            logDebug('Raw certification data received', {
              pkg: pkg.name,
              certDataType: typeof certData,
              certDataKeys: Object.keys(certData),
              certDataLength: Array.isArray(certData) ? certData.length : 0
            })

            // Save raw cert data to a file for debugging
            try {
              const certDataFile = path.join(logDir, `${pkg.name}-${pkg.version}-cert-data.json`)
              fs.writeFileSync(certDataFile, JSON.stringify(certData, null, 2))
              logDebug('Saved raw certification data to file', { file: certDataFile })
            } catch (e) {
              logDebug('Failed to save certification data', { error: e.message })
            }

            // Transform certData to match the format expected by ncm-cli
            const scores = transformCertDataToScores(certData)
            logDebug('Transformed certification data to scores', { pkg: pkg.name, scoresLength: scores.length })

            results.push({
              name: pkg.name,
              version: pkg.version,
              published: true,
              scores
            })
          } else {
            // Add empty result if no data is returned
            logDebug('No certification data received for package', { pkg: pkg.name })
            results.push({
              name: pkg.name,
              version: pkg.version,
              published: true,
              scores: []
            })
          }

          // Resolve the promise for this package
          const resolveFunc = callbackMap.get(nameVersion)
          if (resolveFunc) {
            resolveFunc()
            callbackMap.delete(nameVersion)
          } else {
            logDebug('Warning: Could not find resolve function for package', { nameVersion })
          }
        }
      }

      // Enqueue package for certification
      logDebug('Enqueueing package for certification', { pkg: pkg.name, path: certifyRequest.path })
      agent.enqueue(certifyRequest)
    })
  })

  // Explicitly trigger the ncm-ng agent to run after enqueueing all packages
  if (typeof agent.runOnce === 'function') {
    logDebug('Explicitly calling agent.runOnce()')
    agent.runOnce()
  } else {
    logDebug('Warning: agent.runOnce() method not found')
  }

  // Wait for all packages to be certified with a timeout
  logDebug('Waiting for all packages to be certified')
  try {
    const timeout = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Certification timed out after 30 seconds')), 30000)
    })

    await Promise.race([
      Promise.all(certifyPromises),
      timeout
    ])
  } catch (err) {
    logDebug('Certification error or timeout', { error: err.message })
    // If we timeout, add empty results for any packages without results
    for (const pkg of packages) {
      const pkgId = `${pkg.name}@${pkg.version}`
      if (!results.some(r => r.name === pkg.name && r.version === pkg.version)) {
        results.push({
          name: pkg.name,
          version: pkg.version,
          published: true,
          scores: [],
          error: 'Certification timed out'
        })
      }
    }
  }

  logDebug('Certification completed', { resultsLength: results.length })
  return results
}

/**
 * Transform ncm-ng certification data to the score format expected by ncm-cli
 * @param {Array} certData Certification data from ncm-ng
 * @returns {Array} Scores in format expected by ncm-cli
 */
function transformCertDataToScores (certData) {
  const scores = []

  // Early return if certData is not an array or is empty
  if (!Array.isArray(certData) || certData.length === 0) {
    return scores
  }

  // Process each certification type
  for (const cert of certData) {
    if (!cert || !cert.name || !cert.data) continue

    // Map different certification types to score objects
    switch (cert.name) {
      case 'license':
        scores.push({
          group: 'compliance',
          name: 'license',
          pass: cert.data.valid !== false,
          severity: cert.data.valid === false ? 'CRITICAL' : 'NONE',
          title: 'License Check',
          data: cert.data
        })
        break

      case 'vulnerability-analysis':
        // Add vulnerability scores
        if (cert.data.vulnerabilities && Array.isArray(cert.data.vulnerabilities)) {
          const vulnSeverity = getHighestVulnerabilitySeverity(cert.data.vulnerabilities)
          scores.push({
            group: 'security',
            name: 'vulnerability',
            pass: vulnSeverity === 'NONE',
            severity: vulnSeverity,
            title: 'Vulnerability Check',
            data: cert.data
          })
        }
        break

      case 'contextual-risk-assessment':
      case 'risk-assessment':
        // Add risk assessment scores
        if (cert.data.riskFactors) {
          scores.push({
            group: 'risk',
            name: 'risk-factors',
            pass: !cert.data.hasHighRisk,
            severity: cert.data.hasHighRisk ? 'HIGH' : 'NONE',
            title: 'Risk Assessment',
            data: cert.data
          })
        }
        break

      case 'outdated-modules':
        // Add outdated modules score
        if (cert.data.isOutdated) {
          scores.push({
            group: 'maintenance',
            name: 'outdated',
            pass: !cert.data.isOutdated,
            severity: cert.data.isOutdated ? 'MEDIUM' : 'NONE',
            title: 'Package Freshness',
            data: cert.data
          })
        }
        break

      // Add more mappings as needed for other certification types
    }
  }

  return scores
}

/**
 * Get the highest severity from an array of vulnerabilities
 * @param {Array} vulnerabilities Array of vulnerability objects
 * @returns {string} Highest severity (NONE, LOW, MEDIUM, HIGH, CRITICAL)
 */
function getHighestVulnerabilitySeverity (vulnerabilities) {
  if (!vulnerabilities || !vulnerabilities.length) return 'NONE'

  const severityOrder = {
    NONE: 0,
    LOW: 1,
    MEDIUM: 2,
    HIGH: 3,
    CRITICAL: 4
  }

  let highestSeverity = 'NONE'

  for (const vuln of vulnerabilities) {
    const severity = (vuln.severity || 'NONE').toUpperCase()
    if (severityOrder[severity] > severityOrder[highestSeverity]) {
      highestSeverity = severity
    }
  }

  return highestSeverity
}

module.exports = {
  certifyPackages
}
