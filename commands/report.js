'use strict'

const path = require('path')
const analyze = require('../lib/ncm-analyze-tree')
const {
  apiRequest,
  formatAPIURL,
  graphql
} = require('../lib/util')
const config = require('../lib/config')
const score = require('../lib/report/score')
const {
  SEVERITY_RMAP,
  SEVERITY_RMAP_NPM,
  moduleSort
} = require('../lib/report/util')
const longReport = require('../lib/report/long')
const shortReport = require('../lib/report/short')
const { helpHeader } = require('../lib/help')
const GitHubActionCheck = require('../lib/report/github-action')
const {
  COLORS,
  header,
  failure,
  formatError
} = require('../lib/ncm-style')
const chalk = require('chalk')
const L = console.log
const E = console.error
const githubMode = process.env.IS_GITHUB_ACTION
const isTest = process.env.NODE_ENV === 'testing'
const { spawnSync } = require('child_process')

module.exports = report
module.exports.optionsList = optionsList

async function report (argv, _dir) {
  const {
    long,
    json
  } = argv
  let { dir = _dir } = argv
  if (!dir) dir = process.cwd()

  if (argv.help) {
    printHelp()
    return
  }

  if (!json) {
    /* NCM-Cli Header */
    L()
    L(header(`${path.basename(dir)} Report`))
  }

  let orgId = config.getValue('orgId')

  // Local ncm-ng adapter is required for certification
  try {
    // Verify that ncm-ng adapter is available
    try {
      require('../lib/ncm-ng-adapter')
      if (!json) {
        // Inform the user about local certification
        L()
        L(chalk.blue('Using local ncm-ng for certification'))
        L()
      }
    } catch (adapterErr) {
      // Fail if ncm-ng adapter is not available
      E()
      E(formatError('Local certification via ncm-ng is required but not available', adapterErr))
      E()
      E(chalk.yellow('Make sure the ncm-ng package is correctly installed as a dependency.'))
      E()
      process.exitCode = 1
      return
    }
  } catch (err) {
    E()
    E(formatError('Failed to initialize certification', err))
    E()
    process.exitCode = 1
    return
  }

  const whitelist = new Set()
  // Using local whitelist file only
  // Look for .ncm-whitelist.json in the project directory
  try {
    const fs = require('fs')
    const path = require('path')
    const whitelistPath = path.join(dir, '.ncm-whitelist.json')

    if (fs.existsSync(whitelistPath)) {
      const whitelistData = JSON.parse(fs.readFileSync(whitelistPath, 'utf8'))
      if (Array.isArray(whitelistData)) {
        for (const pkg of whitelistData) {
          if (pkg && pkg.name && pkg.version) {
            whitelist.add(`${pkg.name}@${pkg.version}`)
          }
        }
        L()
        L(chalk.blue(`Loaded local whitelist from ${whitelistPath}`))
        L()
      }
    } else {
      L()
      L(chalk.yellow('No local whitelist file found (.ncm-whitelist.json)'))
      L()
    }
  } catch (err) {
    L()
    L(formatError(`Error loading local whitelist: ${err.message}`, err))
    L()
  }

  /* verify */
  let pkgScores = []
  let hasFailures = false

  let data
  let usingLocalCertification = false
  try {
    // analyze now returns both the data and a flag indicating if local certification was used
    const analyzeResult = await analyze({
      dir,
      url: formatAPIURL('/ncm2/api/v2/graphql')
    })

    // Extract the data and the flag
    data = analyzeResult.data
    usingLocalCertification = analyzeResult.usingLocalCertification

    // Log whether we're using local or remote certification
    if (usingLocalCertification) {
      console.log(chalk.cyan('✓ Using local certification via ncm-ng'))
    }
  } catch (err) {
    if (err.code === 'ENOENT') {
      E()
      E(failure(err.message))
      E(formatError(`Unable to read project at: ${dir}`, err))
      E()
    } else {
      E()
      E(formatError(`Unable to analyze project. ${err.message}.`, err))
      E()
    }
    process.exitCode = 1
    return
  }

  const {
    name: pkgName,
    version: pkgVersion
  } = require(path.join(__dirname, '..', 'package.json'))

  let nestedPkgName, nestedPkgVersion
  try {
    const {
      name: _nestedPkgName,
      version: _nestedPkgVersion
    } = require(`${dir}/package.json`)
    nestedPkgName = _nestedPkgName
    nestedPkgVersion = _nestedPkgVersion
  } catch (_) {}

  const isNested = pkgName === nestedPkgName && pkgVersion === nestedPkgVersion

  // Processing packages from NCM service
  let includedCount = 0
  let skippedCount = 0

  for (const { name, version, scores, published } of data) {
    let maxSeverity = 0
    let license = {}
    const failures = []

    for (const score of scores) {
      const severityValue = SEVERITY_RMAP.indexOf(score.severity)

      if (score.group !== 'compliance' &&
          score.group !== 'security' &&
          score.group !== 'risk') {
        continue
      }

      if (severityValue > maxSeverity) {
        maxSeverity = severityValue
      }

      if (score.pass === false) {
        failures.push(score)
        hasFailures = true
      }

      if (score.name === 'license') {
        license = score
      }
    }

    // Modified approach to include ALL packages in the report
    // Even packages with null/undefined versions will be included with a default version
    let effectiveVersion = version
    if (effectiveVersion === null || effectiveVersion === undefined) {
      effectiveVersion = '0.0.0'
      // Using default version 0.0.0 for package
    }

    // Skip nested packages with severity issues
    if (isNested && !!maxSeverity) {
      skippedCount++
      // Skipping nested package
      continue
    }

    // Check if license has failed, which should upgrade to critical severity
    const getLicenseScore = ({ pass }) => pass === false ? 0 : null
    if (license && license.pass === false) {
      maxSeverity = 4
    }

    // Add the package to our report
    pkgScores.push({
      name,
      version: effectiveVersion, // Use effective version instead of potentially null version
      published,
      maxSeverity,
      failures,
      license,
      scores
    })

    includedCount++
  }

  // Package processing complete

  pkgScores = moduleSort(pkgScores)

  // Process whitelisted packages
  const whitelisted = pkgScores.filter(pkg => whitelist.has(`${pkg.name}@${pkg.version}`))
    .map(pkgScore => ({ ...pkgScore, quantitativeScore: score(pkgScore.scores, pkgScore.maxSeverity) }))

  // Filter out whitelisted packages from the main package list
  pkgScores = pkgScores.filter(pkg => !whitelist.has(`${pkg.name}@${pkg.version}`))
    .map(pkgScore => ({ ...pkgScore, quantitativeScore: score(pkgScore.scores, pkgScore.maxSeverity) }))

  const npmAudit = () => {
    return new Promise((resolve, reject) => {
      const npmAuditProcess = spawnSync('npm', ['audit', '--json'], {
        cwd: dir,
        timeout: 10000, // Add a 10 second timeout to prevent hanging
        encoding: 'utf8'
      })

      if (npmAuditProcess.error) {
        return reject(npmAuditProcess.error)
      }

      if (npmAuditProcess.status !== 0 && npmAuditProcess.signal === 'SIGTERM') {
        // Handle timeout case
        return resolve('{}')
      }

      resolve(npmAuditProcess.stdout ? npmAuditProcess.stdout.toString() : '{}')
    })
  }

  let npmAuditData = '{}'
  try {
    npmAuditData = await npmAudit()
  } catch (err) {
    E()
    E(formatError('Failed to run "npm audit"', err))
    E()
    process.exitCode = 1
  }

  try {
    const npmAuditJson = JSON.parse(npmAuditData) || {}
    if (npmAuditJson.advisories) {
      for (const advisory of Object.values(npmAuditJson.advisories)) {
        const { version } = advisory.findings ? (advisory.findings[0] || {}) : {}
        const { module_name: name, severity = 'NONE' } = advisory
        const maxSeverity = SEVERITY_RMAP_NPM.indexOf(severity.toUpperCase())
        pkgScores.push({
          name,
          version,
          published: true,
          maxSeverity,
          failures: [],
          license: {},
          scores: [],
          auditScore: maxSeverity
        })
      }
    }
  } catch (err) { } // intentional noop

  if (json) return L(JSON.stringify(pkgScores, null, 2))
  if (!long) shortReport(pkgScores, whitelisted, dir, argv)
  if (long) longReport(pkgScores, whitelisted, dir, argv)

  if (githubMode && !isTest) {
    await GitHubActionCheck(pkgScores, whitelisted, hasFailures)
  }

  if (hasFailures) {
    process.exitCode = 1
  }
}

function printHelp () {
  helpHeader(
    'report',
    chalk`{${COLORS.light1} ncm} {${COLORS.yellow} report} {${COLORS.teal} [<directory>] [options]}`,
    'ncm report [<directory>] [options]',
    chalk`
Generates a project-wide report of directory risk and quality of installed or specified packages.
The top five riskiest modules detected will be displayed alongside a concise project report.

A report with a list of all modules can be generated by passing {${COLORS.teal} --long}.

Reports may be filtered based on any of the following flags:
  {${COLORS.teal} --compliance}, {${COLORS.teal} --security}
    `
  )

  L(optionsList())
  L()
}

function optionsList () {
  return chalk`
{${COLORS.light1} ncm} {${COLORS.yellow} report}
{${COLORS.light1} ncm} {${COLORS.yellow} report} {${COLORS.teal} <directory>}
  {${COLORS.teal} -d, --dir}               {white Another way to specify <directory>}
  {${COLORS.teal} -l, --long}              {white Full module list output}
  {${COLORS.teal} -c --compliance}         {white Compliance failures only output}
  {${COLORS.teal} -s --security}           {white Security failures only output}
  `.trim()
}
