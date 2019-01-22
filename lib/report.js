'use strict'

const fs = require('fs')
const path = require('path')
const util = require('util')
const chalk = require('chalk')

const fsPromises = {
  writeFile: util.promisify(fs.writeFile)
}

const logger = require('./logger')
const { handleError } = require('./util')
const L = console.log

const SEVERITY_RMAP = [
  'None',
  'Low',
  'Medium',
  'High',
  'Critical'
]
const SEVERITY_STYLE = [
  [], // None
  ['bold'], // Low
  ['yellow', 'bold'], // Medium
  ['red', 'bold'], // High
  ['redBright', 'underline', 'bold'] // Critical
]
const W = [
  40, // Module Name
  12, // Risk Score
  23, // License
  15 // Security
]

module.exports = {
  scoreReport,
  jsonReport,
  outputReport,
  shortReport,
  longReport,
  moduleReport,
  reportSuccessMsg,
  reportWarningMsg,
  reportFailMsg,
  reportHeader
}

function scoreReport (report) {
  let width = 70

  const loggerBar = () => logger([{ text: `╟${'—'.repeat(width * 0.55)}┼${'—'.repeat(width * 0.25 - 1)}┼${'—'.repeat(width * 0.20 - 1)}╢`, style: 'table' }])
  const loggerTableHeader = () => logger([{ text: `╔${'═'.repeat(width * 0.55)}╤${'═'.repeat(width * 0.25 - 1)}╤${'═'.repeat(width * 0.20 - 1)}╗`, style: 'table' }])
  const loggerTableFooter = () => logger([{ text: `╚${'═'.repeat(width * 0.55)}╧${'═'.repeat(width * 0.25 - 1)}╧${'═'.repeat(width * 0.20 - 1)}╝`, style: 'table' }])
  const loggerTableTitle = () => logger([
    { text: `║`, style: 'table' },
    { text: `${' '.repeat(width * 0.05)}Package`, style: 'title' },
    { text: `${' '.repeat(Math.floor(width * 0.50 - 7))}|`, style: 'table' },
    { text: `${' '.repeat(width * 0.05)}Version`, style: 'title' },
    { text: `${' '.repeat(Math.floor(width * 0.20 - 8))}|`, style: 'table' },
    { text: `${' '.repeat(width * 0.05)}Score`, style: 'title' },
    { text: `${' '.repeat(Math.floor(width * 0.10 - 2))}║`, style: 'table' }
  ])
  const loggerPackageDetails = (pkg) => logger([
    { text: `║`, style: 'table' },
    { text: `${' '.repeat(width * 0.05)}${pkg.name}`, style: [] },
    { text: `${' '.repeat(Math.floor(width * 0.50 - (pkg.name.length)))}|`, style: 'table' },
    { text: `${' '.repeat(width * 0.05)}${pkg.version}`, style: [] },
    { text: `${' '.repeat(Math.floor(width * 0.20 - (pkg.version.length) - 1))}|`, style: 'table' },
    { text: `${' '.repeat(width * 0.05)}`, style: [] },
    { text: `${SEVERITY_RMAP[pkg.maxSeverity]}`, style: SEVERITY_STYLE[pkg.maxSeverity] },
    { text: `${' '.repeat(width * 0.10 + 3 - SEVERITY_RMAP[pkg.maxSeverity].length)}║`, style: 'table' }
  ])

  logger([{ text: 'NCM-CLI', style: 'ncm' }])
  loggerTableHeader()
  loggerTableTitle()
  for (const pkg of report) {
    if (pkg.name.length > width * 0.40) pkg.name = `${pkg.name.slice(0, width * 0.40)}..`
    if (pkg.version === null) continue // Probably a private package
    loggerBar()
    loggerPackageDetails(pkg)
  }
  loggerTableFooter()
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
  if (typeof (dir) === 'boolean') dir = process.cwd()

  try {
    let json = JSON.stringify(report)
    let timestamp = new Date().valueOf()
    let reportFile = path.join(dir, `ncm-score-report-${timestamp}.json`)
    await fsPromises.writeFile(reportFile, json, 'utf8')

    logger([{ text: 'Score report written to: ', style: [] }])
    logger([{ text: reportFile, style: [] }])
  } catch (err) {
    handleError('Tools::UnableToFormatOutput')
  }
}

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
  L(chalk`{white ${report.length}} {rgb(137,161,157) packages checked}`)
  L()

  /* Risk */
  L(severityMeter(averageRisk)[0] + severityMeter(averageRisk)[1] + severityText(averageRisk) + chalk` {white Average module risk}`)
  L()

  /* Security */
  shortVulnerabilityList(report)
  L()

  /* Compliance */
  const complianceBadge = netCompliance > 0 ? `rgb(255,96,64) !` : `rgb(90,200,120) ✓`
  L(chalk`  {${complianceBadge}} {white ${netCompliance} noncompliant modules found}`)
  L()
}

function longReport (report, dir) {
  shortReport(report, dir)

  /* Divider */
  L(chalk`{rgb(137,161,157) ${'-'.repeat(W[0] + W[1] + W[2] + W[3] + 7)}}`)
  L()

  moduleList(report)
}

function moduleReport (report) {
  /* minor rework may be required depending on ncm2-api response format */

  const { name, version, scores, failures, license } = report

  const SEVERITY_COLORMAP = {
    NONE: 'rgb(137,161,157)',
    LOW: 'rgb(137,161,157)',
    MEDIUM: 'rgb(255,183,38)',
    HIGH: 'rgb(255,139,64)',
    CRITICAL: 'rgb(255,96,64)'
  }

  let maxLength = 0
  const moduleRisks = []
  const codeQuality = []
  for (const score of scores) {
    if ((score.group === 'quality' || score.group === 'risk') &&
        score.pass === false &&
        score.title.length > maxLength) {
      maxLength = score.title.length
    }
    if (score.group === 'risk' &&
        score.pass === false) {
      moduleRisks.push(score)
    }
    if (score.group === 'quality' &&
        score.pass === false) {
      codeQuality.push(score)
    }
  }

  /* NCM-Cli Header */
  L()
  reportHeader(`${name} @ ${version}`)

  /* Module Risk */
  const moduleRisk = Object.values(failures).reduce((a, b) => SEVERITY_RMAP[a.severity] > SEVERITY_RMAP[b.severity] ? a.severity : b.severity)
  const riskColor = SEVERITY_COLORMAP[moduleRisk]

  L()
  L(chalk`{${riskColor} ┌──────┬─${'─'.repeat(moduleRisk.length + 5)}─┐}`)
  L(chalk`{${riskColor} │} ` + severityMeter(moduleRisk)[0] + severityMeter(moduleRisk)[1] +
  chalk`{${riskColor} │ }{white ${moduleRisk[0].toUpperCase() + moduleRisk.slice(1).toLowerCase()} Risk} {${riskColor} │ }`)
  L(chalk`{${riskColor} └──────┴─${'─'.repeat(moduleRisk.length + 5)}─┘}`)
  L()

  /* Security Overview */
  L(chalk`{white Security:}`)
  L()
  shortVulnerabilityList([report])
  L()

  /* Security Detail */

  /* License */
  L(chalk`{white License:}`)
  L()
  if (license.pass === true) {
    reportSuccessMsg(license.title.split(':')[1].trim().replace(/['"]+/g, '') || '')
  } else {
    reportFailMsg(`Noncompliant: ${license.title.includes(':') ? license.title.split(':')[1].trim().replace(/['"]+/g, '') : 'NO LICENSE'}`)
  }
  L()

  /* Module Risk */
  L(chalk`{white Module Risk:}`)
  L()
  if (moduleRisks.length > 0) {
    moduleRisks.forEach(({ title }, ind) => {
      if (ind === 0) {
        L(chalk`{rgb(137,161,157) ┌───┬─${'─'.repeat(maxLength)}─┐}`)
      }

      L(chalk`{rgb(137,161,157) │} {rgb(255,96,64) X} {rgb(137,161,157) │}` +
      chalk`{white  ${title}} ${' '.repeat(maxLength - title.length)}{rgb(137,161,157) │}`)

      if (ind === moduleRisks.length - 1) {
        L(chalk`{rgb(137,161,157) └───┴─${'─'.repeat(maxLength)}─┘}`)
      } else {
        L(chalk`{rgb(137,161,157) ├───┼─${'─'.repeat(maxLength)}─┤}`)
      }
    })
  } else {
    reportSuccessMsg('No Module Risk')
  }
  L()

  /* Code Quality */
  L(chalk`{white Code Quality:}`)
  L()
  if (codeQuality.length > 0) {
    codeQuality.forEach(({ title }, ind) => {
      if (ind === 0) {
        L(chalk`{rgb(137,161,157) ┌───┬─${'─'.repeat(maxLength)}─┐}`)
      }

      L(chalk`{rgb(137,161,157) │} {rgb(255,96,64) X} {rgb(137,161,157) │}` +
      chalk`{white  ${title}} ${' '.repeat(maxLength - title.length)}{rgb(137,161,157) │}`)

      if (ind === codeQuality.length - 1) {
        L(chalk`{rgb(137,161,157) └───┴─${'─'.repeat(maxLength)}─┘}`)
      } else {
        L(chalk`{rgb(137,161,157) ├───┼─${'─'.repeat(maxLength)}─┤}`)
      }
    })
  } else {
    reportSuccessMsg('Passes all criteria')
  }
  L()
}

function moduleList (report) {
  /* Module List */
  L(chalk`{rgb(137,161,157)   Module Name${' '.repeat(W[0] - 9)}Risk${' '.repeat(W[1] - 3)}License${' '.repeat(W[2] - 6)}Security}`)
  L(chalk`{rgb(137,161,157) ┌──${'─'.repeat(W[0])}┬${'─'.repeat(W[1])}┬${'─'.repeat(W[2])}┬${'─'.repeat(W[3])}┐}`)
  report.forEach((pkg, ind) => {
    /* Module Name */
    let mod = pkg.name + ' @ ' + pkg.version
    if (mod.length > W[0]) mod = `${pkg.name.slice(0, W[0] - 14)}... @ ${pkg.version}`

    /* Risk */
    let maxRisk = 0

    /* License */
    const license = pkg.license.title.includes(':') ? pkg.license.title.split(':')[1].trim().replace(/['"]+/g, '') : 'NO LICENSE'
    const licenseBadge = pkg.license.pass ? chalk`{rgb(90,200,120) ✓}` : chalk`{rgb(255,96,64) X}`

    /* Security */
    let vulns = [0, 0, 0, 0]
    for (const failure of pkg.failures) {
      if (failure.group === 'security') {
        switch (failure.severity) {
          case 'CRITICAL':
            vulns[3]++
            break
          case 'HIGH':
            vulns[2]++
            break
          case 'MEDIUM':
            vulns[1]++
            break
          case 'LOW':
            vulns[0]++
        }
      }
      if (failure.group === 'risk' && SEVERITY_RMAP.indexOf(failure.severity[0].toUpperCase() + failure.severity.slice(1).toLowerCase()) > maxRisk) {
        maxRisk = SEVERITY_RMAP.indexOf(failure.severity[0].toUpperCase() + failure.severity.slice(1).toLowerCase())
      }
    }
    const securityBadges = [
      vulns.reduce((a, b) => a + b, 0) === 0 ? chalk`{rgb(90,200,120) ✓} ` + chalk`{white 0}` : chalk`{rgb(255,96,64) X} `,
      vulns[3] > 0 ? chalk`{rgb(255,96,64) ${vulns[3]}C} ` : '',
      vulns[2] > 0 ? chalk`{rgb(255,139,64) ${vulns[2]}H} ` : '',
      vulns[1] > 0 ? chalk`{rgb(255,183,38) ${vulns[1]}M} ` : '',
      vulns[0] > 0 ? chalk`{rgb(137,161,157) ${vulns[0]}L} ` : ''
    ]

    /* Logging */
    L(chalk`{rgb(137,161,157) │} ` +
    chalk`{white ${mod} }` +
    chalk`${' '.repeat(W[0] - mod.length)}{rgb(137,161,157) │} ` +
    severityMeter(SEVERITY_RMAP[maxRisk].toUpperCase())[0] + severityMeter(SEVERITY_RMAP[maxRisk].toUpperCase())[1] + severityTextLabel(SEVERITY_RMAP[maxRisk].toUpperCase()) +
    chalk`${' '.repeat(W[1] - 10)}{rgb(137,161,157) │} ` +
    licenseBadge + chalk` {white ${license}}` +
    chalk`${' '.repeat(W[2] - license.length - 3)}{rgb(137,161,157) │} ` +
    securityBadges.join('') +
    chalk`${' '.repeat(W[3] - securityBadges.join('').length / 9)}{rgb(137,161,157) │}`)

    /* Cell Divider */
    if (ind !== report.length - 1) {
      L(chalk`{rgb(137,161,157) ├──${'─'.repeat(W[0])}┼${'─'.repeat(W[1])}┼${'─'.repeat(W[2])}┼${'─'.repeat(W[3])}┤}`)
    } else {
      L(chalk`{rgb(137,161,157) └──${'─'.repeat(W[0])}┴${'─'.repeat(W[1])}┴${'─'.repeat(W[2])}┴${'─'.repeat(W[3])}┘}`)
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
  const securityBadge = vulnerabilityCount > 0 ? `rgb(255,96,64) !` : `rgb(90,200,120) ✓`
  if (netSecurity.AFFECTED.size > 0) {
    L(chalk`  {${securityBadge}} {white ${vulnerabilityCount} security vulnerabilities found across ${netSecurity.AFFECTED.size} modules}`)
  } else {
    L(chalk`  {${securityBadge}} {white ${vulnerabilityCount} security vulnerabilities found}`)
  }
  L(chalk`    {rgb(255,96,64) C} {white ${netSecurity.CRITICAL} critical severity}`)
  L(chalk`    {rgb(255,139,64) H} {white ${netSecurity.HIGH} high severity}`)
  L(chalk`    {rgb(255,183,38) M} {white ${netSecurity.MEDIUM} medium severity}`)
  L(chalk`    {rgb(137,161,157) L} {white ${netSecurity.LOW} low severity}`)
}

function longVulnerabilityList (report) {

}

function reportHeader (text) {
  L(chalk`{rgb(137,161,157) ╳╳╳╳${'╳'.repeat(text.length)}}`)
  L(chalk`{rgb(137,161,157) ╔══${'═'.repeat(text.length)}╗}`)
  L(chalk`{rgb(137,161,157) ║} {white ${text}} {rgb(137,161,157) ║}`)
  L(chalk`{rgb(137,161,157) ╚══${'═'.repeat(text.length)}╝}`)
  L(chalk`{rgb(137,161,157) ╳╳╳╳${'╳'.repeat(text.length)}}`)
}

function reportSuccessMsg (text) {
  L(chalk`{rgb(90,200,120) ┌─${'─'.repeat(text.length + 2)}─┐ }`)
  L(chalk`{rgb(90,200,120) │ ✓} {white ${text}} {rgb(90,200,120) │ }`)
  L(chalk`{rgb(90,200,120) └─${'─'.repeat(text.length + 2)}─┘}`)
}

function reportWarningMsg (text) {
  L(chalk`{rgb(255,183,38) ┌─${'─'.repeat(text.length + 2)}─┐}`)
  L(chalk`{rgb(255,183,38) │ !} {white ${text}} {rgb(255,183,38) │}`)
  L(chalk`{rgb(255,183,38) └─${'─'.repeat(text.length + 2)}─┘}`)
}

function reportFailMsg (text) {
  L(chalk`{rgb(255,96,64) ┌───┬─${'─'.repeat(text.length)}─┐}`)
  L(chalk`{rgb(255,96,64) │ X │} {white ${text}} {rgb(255,96,64) │}`)
  L(chalk`{rgb(255,96,64) └───┴─${'─'.repeat(text.length)}─┘}`)
}

function severityMeter (severity) {
  switch (severity.toUpperCase()) {
    case 'CRITICAL':
      return [chalk`{rgb(255,96,64) ||||}`, chalk`{rgb(76,88,89) } `]
    case 'HIGH':
      return [chalk`{rgb(255,139,64) |||}`, chalk`{rgb(76,88,89) |} `]
    case 'MEDIUM':
      return [chalk`{rgb(255,183,38) ||}`, chalk`{rgb(76,88,89) ||} `]
    case 'LOW':
      return [chalk`{rgb(137,161,157) |}`, chalk`{rgb(76,88,89) |||} `]
    case 'NONE':
      return [chalk`{rgb(137,161,157) }`, chalk`{rgb(76,88,89) ||||} `]
  }
}

function severityText (severity) {
  switch (severity.toUpperCase()) {
    case 'CRITICAL':
      return chalk`{rgb(255,96,64) Critical}`
    case 'HIGH':
      return chalk`{rgb(255,139,64) High}`
    case 'MEDIUM':
      return chalk`{rgb(255,183,38) Medium}`
    case 'LOW':
      return chalk`{rgb(137,161,157) Low}`
    case 'NONE':
      return chalk`{rgb(76,88,89) None}`
  }
}

function severityTextLabel (severity) {
  switch (severity.toUpperCase()) {
    case 'CRITICAL':
      return chalk`{rgb(137,161,157) Crit}`
    case 'HIGH':
      return chalk`{rgb(137,161,157) High}`
    case 'MEDIUM':
      return chalk`{rgb(137,161,157) Med }`
    case 'LOW':
      return chalk`{rgb(137,161,157) Low }`
    case 'NONE':
      return chalk`{rgb(76,88,89) None}`
  }
}
