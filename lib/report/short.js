'use strict'

module.exports = shortReport

const {
  COLORS,
  line
} = require('../ncm-style')
const {
  SEVERITY_RMAP,
  severityMeter,
  severityText,
  shortVulnerabilityList
} = require('./util')
const L = console.log
const chalk = require('chalk')

function shortReport (report, dir) {
  // const SC = [0, 0, 0, 0, 0]
  const severityCounters = []
  let netCompliance = 0

  for (const pkg of report) {
    let pkgMaxSeverity = 0
    for (const score of pkg.scores) {
      if (score.group === 'quality') continue
      if (score.group === 'compliance' && !score.pass) netCompliance++
      const scoreIndex = SEVERITY_RMAP.indexOf(score.severity)
      pkgMaxSeverity = scoreIndex > pkgMaxSeverity ? scoreIndex : pkgMaxSeverity
    }
    // SC[pkgMaxSeverity]++
    severityCounters.push(pkgMaxSeverity)
  }

  /* Module Risk */
  const avgRiskIndex = severityCounters // Array#reduce() throws on []
    ? severityCounters.reduce((acc, x) => acc + x) / severityCounters.length
    : 0

  // const SCM = {}
  // for (let i = 0; i < 5; i++) {
  //   SCM[SEVERITY_RMAP[i]] = SC[i]
  // }
  // console.log(avgRiskIndex, SC, SCM)

  const averageRisk = SEVERITY_RMAP[Math.round(avgRiskIndex)]

  /* Divider */
  L()
  L(chalk`${report.length} {${COLORS.light1} packages checked}`)
  L()

  /* Risk */
  L(chalk` ${severityMeter(averageRisk)} ${severityText(averageRisk)} Average module risk`)
  L()

  /* Security */
  shortVulnerabilityList(report)
  L()

  /* Compliance */
  {
    const badge = netCompliance > 0 ? '!' : '✓'
    const color = netCompliance > 0 ? COLORS.red : COLORS.green
    L(line(badge, `${netCompliance} noncompliant modules found`, color))
    L()
  }
}
