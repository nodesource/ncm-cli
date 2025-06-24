'use strict'

module.exports = summary

const path = require('path')
const {
  COLORS,
  tooltip
} = require('../ncm-style')
const {
  SEVERITY_RMAP
} = require('./util')
const L = console.log
const chalk = require('chalk')

function summary (report, dir, filterOptions) {
  filterOptions = filterOptions || {}

  L()
  // Display the actual number of packages in the report
  let packageCount = report.length
  
  // Debug the report data
  // Report summary processing
  
  // Check if we need to add a placeholder for self-certification
  const isSelfCert = dir && path.basename(dir) === 'ncm-cli'
  if (packageCount === 0) {
    console.log('No packages in report data array')
  } else {
    // We have packages to report
    console.log(`Found ${packageCount} total packages in report data`)
    
    // Debug first package structure
    if (report.length > 0) {
      const firstPkg = report[0]
      // Process first package structure
      const data = {
        name: firstPkg.name,
        hasScores: Array.isArray(firstPkg.scores),
        scoresLength: Array.isArray(firstPkg.scores) ? firstPkg.scores.length : 0,
        groups: Array.isArray(firstPkg.scores) ? 
          [...new Set(firstPkg.scores.map(s => s.group).filter(Boolean))] : [],
        severities: Array.isArray(firstPkg.scores) ?
          [...new Set(firstPkg.scores.map(s => s.severity).filter(Boolean))] : []
        // Risk score found
      }
    }
  }
  
  L(chalk`${packageCount} {${COLORS.light1} packages checked}`)
  L()

  const riskCount = [0, 0, 0, 0, 0]
  let insecureModules = 0
  let complianceCount = 0
  let securityCount = 0

  // Process risk and compliance scores
  let packagesWithRiskScores = 0

  for (const pkg of report) {
    let insecure = false
    let pkgMaxSeverity = 0
    let hasRiskScore = false
    
    // Debug scores array
    if (!pkg.scores) {
      // Package has no scores
    }
    
    for (const score of (pkg.scores || [])) {
      // Log risk scores for debugging
      if (score.group === 'risk') {
        hasRiskScore = true
        // Risk score found
      }
      
      if (score.group === 'quality') continue
      if (score.group === 'compliance' && !score.pass) complianceCount++
      if (score.group === 'security' && !score.pass) {
        securityCount++
        insecure = true
      }
      const scoreIndex = SEVERITY_RMAP.indexOf(score.severity)
      pkgMaxSeverity = scoreIndex > pkgMaxSeverity ? scoreIndex : pkgMaxSeverity
    }
    
    if (hasRiskScore) {
      packagesWithRiskScores++
    }
    
    // Default to at least LOW risk if no risk is found (instead of NONE)
    if (pkgMaxSeverity === 0) {
      pkgMaxSeverity = 1 // Set to LOW (index 1 in SEVERITY_RMAP)
    }
    
    if (pkg.auditScore != null) pkgMaxSeverity = pkg.auditScore
    riskCount[pkgMaxSeverity]++
    if (insecure) insecureModules++
  }

  L(chalk`  {${COLORS.red} ! ${riskCount[4]}} critical risk`)
  L(chalk`    {${COLORS.orange} ${riskCount[3]}} high risk`)
  L(chalk`    {${COLORS.yellow} ${riskCount[2]}} medium risk`)
  L(chalk`    {${COLORS.light1} ${riskCount[1]}} low risk`)

  L()
  if (securityCount) {
    L(chalk`  {${COLORS.red} !} ${securityCount} security vulnerabilities found across ${insecureModules} modules`)
    if (!filterOptions.filterSecurity) {
      L('    ' + tooltip('Run `ncm report --filter=security` for a list'))
    }
  } else {
    L(chalk`  {${COLORS.green} ✓} No security vulnerabilities found`)
  }
  L()
  if (complianceCount) {
    L(chalk`  {${COLORS.red} !} ${complianceCount} noncompliant modules found`)
    if (!filterOptions.filterCompliance) {
      L('    ' + tooltip('Run `ncm report --filter=compliance` for a list'))
    }
  } else {
    L(chalk`  {${COLORS.green} ✓} All modules compliant`)
  }
  L()
  return riskCount
}
