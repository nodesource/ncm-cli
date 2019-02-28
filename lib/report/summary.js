'use strict'

module.exports = summary

const {
  COLORS,
  tooltip
} = require('../ncm-style')
const {
  SEVERITY_RMAP
} = require('./util')
const L = console.log
const chalk = require('chalk')

function summary (report, dir) {
  L()
  L(chalk`${report.length} {${COLORS.light1} packages checked}`)
  L()

  const riskCount = [0, 0, 0, 0, 0]
  let insecureModules = 0
  let complianceCount = 0
  let securityCount = 0

  for (const pkg of report) {
    let insecure = false
    let pkgMaxSeverity = 0
    for (const score of pkg.scores) {
      if (score.group === 'quality') continue
      if (score.group === 'compliance' && !score.pass) complianceCount++
      if (score.group === 'security' && !score.pass) {
        securityCount++
        insecure = true
      }
      const scoreIndex = SEVERITY_RMAP.indexOf(score.severity)
      pkgMaxSeverity = scoreIndex > pkgMaxSeverity ? scoreIndex : pkgMaxSeverity
    }
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
    L('    ' + tooltip('Run `ncm-cli report --filter=security` for a list'))
  } else {
    L(chalk`  {${COLORS.green} ✓} No security vulnerabilities found`)
  }
  L()
  if (complianceCount) {
    L(chalk`  {${COLORS.red} !} ${complianceCount} noncompliant modules found`)
    L('    ' + tooltip('Run `ncm-cli report --filter=compliance` for a list'))
  } else {
    L(chalk`  {${COLORS.green} ✓} All modules compliant`)
  }
  L()
}
