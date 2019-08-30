'use strict'

module.exports = summary

const {
  COLORS,
  tooltip
} = require('../ncm-style')
const {
  summaryInfo
} = require('./util')
const L = console.log
const chalk = require('chalk')

function summary (report, dir, filterOptions) {
  filterOptions = filterOptions || {}

  L()
  L(chalk`${report.length} {${COLORS.light1} packages checked}`)
  L()

  const { riskCount, insecureModules, complianceCount, securityCount } = summaryInfo(report)

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
}
