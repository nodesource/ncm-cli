'use strict'

module.exports = shortReport

const {
  COLORS,
  reportHeader,
  severityMeter,
  severityText,
  shortVulnerabilityList
} = require('./util')
const L = console.log
const chalk = require('chalk')
const fs = require('fs')
const path = require('path')

function shortReport (report, dir) {
  if (!dir) dir = process.cwd()

  let netRisk = {
    'LOW': 0,
    'MEDIUM': 0,
    'HIGH': 0,
    'CRITICAL': 0
  }
  let netCompliance = 0

  for (const pkg of report) {
    for (const failure of pkg.failures) {
      if (failure.group === 'risk') netRisk[failure.severity]++
      if (failure.group === 'compliance') netCompliance++
    }
  }

  const averageRisk = Object.keys(netRisk).reduce((a, b) => netRisk[a] > netRisk[b] ? a : b)

  let pkgjson
  try {
    pkgjson = fs.readFileSync(path.join(dir, 'package.json'))
    pkgjson = JSON.parse(pkgjson)
  } catch (e) {
    console.error(e)
  }

  /* NCM-Cli Header */
  L()
  if (pkgjson) {
    reportHeader(`${pkgjson.name} Report`)
  } else {
    // Use a general `NCM-Cli Report` instead of cwd?
    reportHeader(`${process.cwd()} Report`)
  }

  /* Divider */
  L()
  L(chalk`{white ${report.length}} {${COLORS.light1} packages checked}`)
  L()

  /* Risk */
  L(severityMeter(averageRisk)[0] + severityMeter(averageRisk)[1] + severityText(averageRisk) + chalk` {white Average module risk}`)
  L()

  /* Security */
  shortVulnerabilityList(report)
  L()

  /* Compliance */
  const complianceBadge = netCompliance > 0 ? `${COLORS.red} !` : `${COLORS.green} ✓`
  L(chalk`  {${complianceBadge}} {white ${netCompliance} noncompliant modules found}`)
  L()
}
