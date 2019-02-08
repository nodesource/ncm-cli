'use strict'

const fs = require('fs')
const path = require('path')
const util = require('util')
const semver = require('semver')
const chalk = require('chalk')

const fsPromises = {
  writeFile: util.promisify(fs.writeFile)
}
const { handleError } = require('../util')
const L = console.log

const SEVERITY_RMAP = [
  'None',
  'Low',
  'Medium',
  'High',
  'Critical'
]
const W = [
  40, // Module Name
  12, // Risk Score
  23, // License
  15 // Security
]
const COLORS = {
  red: `hex('#ff6040')`,
  orange: `hex('#FF8B40')`,
  yellow: `hex('#ffb726')`,
  light1: `hex('#89a19d')`,
  gray: `hex('#4c5859')`,
  teal: `hex('#66ccbb')`,
  green: `hex('#5ac878')`
}

module.exports = {
  jsonReport,
  outputReport,
  reportSuccessMsg,
  reportWarningMsg,
  reportFailMsg,
  reportHeader,
  COLORS,
  W,
  SEVERITY_RMAP,
  severityMeter,
  severityText,
  severityTextLabel,
  shortVulnerabilityList,
  moduleList
}

function jsonReport (report) {
  try {
    let json = JSON.stringify(report, null, 2)
    L(json)
  } catch (err) {
    handleError('Tools::UnableToParseReport')
  }
}

async function outputReport (report, dir) {
  if (typeof dir !== 'string') dir = process.cwd()

  try {
    let json = JSON.stringify(report)
    let timestamp = new Date().valueOf()
    let reportFile = path.join(dir, `ncm-score-report-${timestamp}.json`)
    await fsPromises.writeFile(reportFile, json, 'utf8')

    reportSuccessMsg(`Report successfully written to: ${reportFile}`)
  } catch (err) {
    handleError('Tools::UnableToFormatOutput')
  }
}

function moduleList (report) {
  /* Module List */
  L(chalk`{${COLORS.light1}   Module Name${' '.repeat(W[0] - 9)}Risk${' '.repeat(W[1] - 3)}License${' '.repeat(W[2] - 6)}Security}`)
  L(chalk`{${COLORS.light1} ┌──${'─'.repeat(W[0])}┬${'─'.repeat(W[1])}┬${'─'.repeat(W[2])}┬${'─'.repeat(W[3])}┐}`)

  report.forEach(pkg => {
    pkg.riskWeight = 0
    let complianceFail = false
    let securityFail = false
    for (const failure of pkg.failures) {
      if (failure.group === 'compliance') complianceFail = true
      if (failure.group === 'security') securityFail = true
      if (failure.severity === 'CRITICAL') pkg.riskWeight = Math.max(pkg.riskWeight, 50)
      if (failure.severity === 'HIGH') pkg.riskWeight = Math.max(pkg.riskWeight, 25)
      if (failure.severity === 'MEDIUM') pkg.riskWeight = Math.max(pkg.riskWeight, 10)
      if (failure.severity === 'LOW') pkg.riskWeight = Math.max(pkg.riskWeight, 1)
      if (failure.group === 'compliance') complianceFail = true
    }

    if (complianceFail) pkg.riskWeight += 20
    if (securityFail) pkg.riskWeight += 15
  })

  report.sort((pkgA, pkgB) => {
    let sort = 0

    if (pkgA.riskWeight > pkgB.riskWeight) sort -= 2
    if (pkgA.riskWeight < pkgB.riskWeight) sort += 2

    if (pkgA.name < pkgB.name) sort -= 1
    if (pkgA.name > pkgB.name) sort += 1
    if (pkgA.name === pkgB.name) {
      sort += semver.compare(pkgA.version, pkgB.version)
    }

    return sort
  })

  // report = report.slice(0, 10)

  report.forEach((pkg, ind) => {
    // console.log(pkg)
    /* Module Name */
    let mod = pkg.name + ' @ ' + pkg.version
    if (mod.length > W[0]) mod = `${pkg.name.slice(0, W[0] - 14)}... @ ${pkg.version}`

    /* Risk */
    let maxRisk = 0

    /* License */
    let license = pkg.license &&
                  pkg.license.title &&
                  pkg.license.title.includes(':')
      ? pkg.license.title.split(':')[1].trim().replace(/['"]+/g, '')
      : 'INVALID LICENSE'
    if (license.length + 3 > W[2]) {
      license = license.slice(0, W[2] - 4) + '…'
    }
    const licenseBadge = pkg.license && pkg.license.pass ? chalk`{${COLORS.green} ✓}` : chalk`{${COLORS.red} X}`

    /* Security */
    let vulns = [0, 0, 0, 0]
    for (const failure of pkg.failures) {
      if (failure.group === 'security') {
        if (failure.severity === 'CRITICAL') vulns[3]++
        if (failure.severity === 'HIGH') vulns[2]++
        if (failure.severity === 'MEDIUM') vulns[1]++
        if (failure.severity === 'LOW') vulns[0]++
      }
      if (failure.group === 'risk' && SEVERITY_RMAP.indexOf(failure.severity[0].toUpperCase() + failure.severity.slice(1).toLowerCase()) > maxRisk) {
        maxRisk = SEVERITY_RMAP.indexOf(failure.severity[0].toUpperCase() + failure.severity.slice(1).toLowerCase())
      }
    }
    const securityBadges = [
      vulns.reduce((a, b) => a + b, 0) === 0 ? chalk`{${COLORS.green} ✓} ` + chalk`{white 0}` : chalk`{${COLORS.red} X} `,
      vulns[3] > 0 ? chalk`{${COLORS.red} ${vulns[3]}C} ` : '',
      vulns[2] > 0 ? chalk`{${COLORS.orange} ${vulns[2]}H} ` : '',
      vulns[1] > 0 ? chalk`{${COLORS.yellow} ${vulns[1]}M} ` : '',
      vulns[0] > 0 ? chalk`{${COLORS.light1} ${vulns[0]}L} ` : ''
    ]

    /* Logging */
    L(
      chalk`{${COLORS.light1} │} ` +
      chalk`{white ${mod} }` +
      chalk`${' '.repeat(W[0] - mod.length)}{${COLORS.light1} │} ` +
      severityMeter(SEVERITY_RMAP[maxRisk].toUpperCase())[0] + severityMeter(SEVERITY_RMAP[maxRisk].toUpperCase())[1] + severityTextLabel(SEVERITY_RMAP[maxRisk].toUpperCase()) +
      chalk`${' '.repeat(W[1] - 10)}{${COLORS.light1} │} ` +
      licenseBadge + chalk` {white ${license}}` +
      chalk`${' '.repeat(W[2] - license.length - 3)}{${COLORS.light1} │} ` +
      securityBadges.join('') +
      chalk`${' '.repeat(W[3] - securityBadges.join('').length / 9)}{${COLORS.light1} │}`
    )

    /* Cell Divider */
    if (ind !== report.length - 1) {
      L(chalk`{${COLORS.light1} ├──${'─'.repeat(W[0])}┼${'─'.repeat(W[1])}┼${'─'.repeat(W[2])}┼${'─'.repeat(W[3])}┤}`)
    } else {
      L(chalk`{${COLORS.light1} └──${'─'.repeat(W[0])}┴${'─'.repeat(W[1])}┴${'─'.repeat(W[2])}┴${'─'.repeat(W[3])}┘}`)
    }
  })
  L()
}

function shortVulnerabilityList (report) {
  let netSecurity = {
    'LOW': 0,
    'MEDIUM': 0,
    'HIGH': 0,
    'CRITICAL': 0,
    'AFFECTED': new Set()
  }

  for (const pkg of report) {
    for (const failure of pkg.failures) {
      if (failure.group === 'security') {
        netSecurity[failure.severity]++
        netSecurity.AFFECTED.add(pkg.name)
      }
    }
  }

  const vulnerabilityCount = netSecurity.CRITICAL + netSecurity.HIGH + netSecurity.MEDIUM + netSecurity.LOW
  const securityBadge = vulnerabilityCount > 0 ? `${COLORS.red} !` : `${COLORS.green} ✓`
  if (netSecurity.AFFECTED.size > 0) {
    L(chalk`  {${securityBadge}} {white ${vulnerabilityCount} security vulnerabilities found across ${netSecurity.AFFECTED.size} modules}`)
  } else {
    L(chalk`  {${securityBadge}} {white ${vulnerabilityCount} security vulnerabilities found}`)
  }
  L(chalk`    {${COLORS.red} C} {white ${netSecurity.CRITICAL} critical severity}`)
  L(chalk`    {${COLORS.orange} H} {white ${netSecurity.HIGH} high severity}`)
  L(chalk`    {${COLORS.yellow} M} {white ${netSecurity.MEDIUM} medium severity}`)
  L(chalk`    {${COLORS.light1} L} {white ${netSecurity.LOW} low severity}`)
}

function reportHeader (text) {
  L(chalk`{${COLORS.light1} ╳╳╳╳${'╳'.repeat(text.length)}}`)
  L(chalk`{${COLORS.light1} ╔══${'═'.repeat(text.length)}╗}`)
  L(chalk`{${COLORS.light1} ║} {white ${text}} {${COLORS.light1} ║}`)
  L(chalk`{${COLORS.light1} ╚══${'═'.repeat(text.length)}╝}`)
  L(chalk`{${COLORS.light1} ╳╳╳╳${'╳'.repeat(text.length)}}`)
}

function reportSuccessMsg (text) {
  L(chalk`{${COLORS.green} ┌─${'─'.repeat(text.length + 2)}─┐ }`)
  L(chalk`{${COLORS.green} │ ✓} {white ${text}} {${COLORS.green} │ }`)
  L(chalk`{${COLORS.green} └─${'─'.repeat(text.length + 2)}─┘}`)
}

function reportWarningMsg (text) {
  L(chalk`{${COLORS.yellow} ┌─${'─'.repeat(text.length + 2)}─┐}`)
  L(chalk`{${COLORS.yellow} │ !} {white ${text}} {${COLORS.yellow} │}`)
  L(chalk`{${COLORS.yellow} └─${'─'.repeat(text.length + 2)}─┘}`)
}

function reportFailMsg (text) {
  L(chalk`{${COLORS.red} ┌───┬─${'─'.repeat(text.length)}─┐}`)
  L(chalk`{${COLORS.red} │ X │} {white ${text}} {${COLORS.red} │}`)
  L(chalk`{${COLORS.red} └───┴─${'─'.repeat(text.length)}─┘}`)
}

function severityMeter (severity) {
  switch (severity.toUpperCase()) {
    case 'CRITICAL':
      return [chalk`{${COLORS.red} ||||}`, chalk`{${COLORS.gray} } `]
    case 'HIGH':
      return [chalk`{${COLORS.orange} |||}`, chalk`{${COLORS.gray} |} `]
    case 'MEDIUM':
      return [chalk`{${COLORS.yellow} ||}`, chalk`{${COLORS.gray} ||} `]
    case 'LOW':
      return [chalk`{${COLORS.light1} |}`, chalk`{${COLORS.gray} |||} `]
    case 'NONE':
      return [chalk`{${COLORS.light1} }`, chalk`{${COLORS.gray} ||||} `]
  }
}

function severityText (severity) {
  switch (severity.toUpperCase()) {
    case 'CRITICAL':
      return chalk`{${COLORS.red} Critical}`
    case 'HIGH':
      return chalk`{${COLORS.orange} High}`
    case 'MEDIUM':
      return chalk`{${COLORS.yellow} Medium}`
    case 'LOW':
      return chalk`{${COLORS.light1} Low}`
    case 'NONE':
      return chalk`{${COLORS.gray} None}`
  }
}

function severityTextLabel (severity) {
  switch (severity.toUpperCase()) {
    case 'CRITICAL':
      return chalk`{${COLORS.light1} Crit}`
    case 'HIGH':
      return chalk`{${COLORS.light1} High}`
    case 'MEDIUM':
      return chalk`{${COLORS.light1} Med }`
    case 'LOW':
      return chalk`{${COLORS.light1} Low }`
    case 'NONE':
      return chalk`{${COLORS.gray} None}`
  }
}
