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
const COLORS = {
  red: `hex('#ff6040')`,
  orange: `hex('#FF8B40')`,
  yellow: `hex('#ffb726')`,
  light1: `hex('#89a19d')`,
  gray: `hex('#4c5859')`,
  teal: `hex('#66ccbb')`
}

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

function longReport (report, dir) {
  shortReport(report, dir)

  /* Divider */
  L(chalk`{${COLORS.light1} ${'-'.repeat(W[0] + W[1] + W[2] + W[3] + 7)}}`)
  L()

  moduleList(report)
}

function moduleReport (report) {
  /* minor rework may be required depending on ncm2-api response format */

  const { name, version, scores, failures, license } = report

  const SEVERITY_COLORMAP = {
    NONE: COLORS.light1,
    LOW: COLORS.light1,
    MEDIUM: COLORS.yellow,
    HIGH: COLORS.orange,
    CRITICAL: COLORS.red
  }

  const moduleRisks = []
  const securityVulnerabilities = []
  const codeQuality = []

  for (const score of scores) {
    if (score.group === 'risk' &&
        score.pass === false) {
      moduleRisks.push(score)
    }
    if (score.group === 'quality' &&
        score.pass === false) {
      codeQuality.push(score)
    }
    if (score.group === 'security' &&
    score.pass === false) {
      securityVulnerabilities.push(score)
    }
  }

  const maxLength = W.reduce((a, b) => a + b)

  /* NCM-Cli Header */
  L()
  reportHeader(`${name} @ ${version}`)

  /* Module Risk */
  let moduleRisk
  switch (failures.length) {
    case 0:
      moduleRisk = 'NONE'
      break
    case 1:
      moduleRisk = failures[0].severity
      break
    default:
      moduleRisk = Object.values(failures).reduce((a, b) => SEVERITY_RMAP[a.severity] > SEVERITY_RMAP[b.severity] ? a.severity : b.severity)
  }
  const riskColor = SEVERITY_COLORMAP[moduleRisk]

  L()
  L(chalk`{${riskColor} ┌──────┬─${'─'.repeat(moduleRisk.length + 5)}─┐}`)
  L(chalk`{${riskColor} │} ` + severityMeter(moduleRisk)[0] + severityMeter(moduleRisk)[1] +
  chalk`{${riskColor} │ }{white ${moduleRisk[0].toUpperCase() + moduleRisk.slice(1).toLowerCase()} Risk} {${riskColor} │ }`)
  L(chalk`{${riskColor} └──────┴─${'─'.repeat(moduleRisk.length + 5)}─┘}`)
  L()

  /* Security Overview */
  L()
  L(chalk`{white Security:}`)
  L()
  shortVulnerabilityList([report])
  L()

  /* Security Detail */
  if (securityVulnerabilities.length > 0) {
    for (const { severity, title, data } of securityVulnerabilities) {
      L(chalk`{${SEVERITY_COLORMAP[severity]} ┌───┬─${'─'.repeat(title.length)}─┐}`)
      L(chalk`{${SEVERITY_COLORMAP[severity]} │ ${severity[0].toUpperCase()} │} {white ${title}} {${SEVERITY_COLORMAP[severity]} │}`)
      L(chalk`{${SEVERITY_COLORMAP[severity]} └───┴─${'─'.repeat(title.length)}─┘}`)

      L(chalk`{${COLORS.light1} Versions ${data.vulnerable.join(' ')} (Source: Synk)}`)

      L(chalk`{rgb(76,181,255) |→ https://snyk.io/vuln/${data.id}}`)
      L()
    }
  } else {
    reportSuccessMsg('No Security Vulnerabilities')
    L()
  }

  /* License */
  L()
  L(chalk`{white License:}`)
  L()
  if (license.pass === true) {
    reportSuccessMsg(license.title.split(':')[1].trim().replace(/['"]+/g, '') || '')
  } else {
    reportFailMsg(`Noncompliant: ${license.title.includes(':') ? license.title.split(':')[1].trim().replace(/['"]+/g, '') : 'NO LICENSE'}`)
  }
  L()

  /* Module Risk */
  L()
  L(chalk`{white Module Risk:}`)
  L()
  if (moduleRisks.length > 0) {
    moduleRisks.forEach(({ title }, ind) => {
      if (ind === 0) {
        L(chalk`{${COLORS.light1} ┌───┬─${'─'.repeat(maxLength)}─┐}`)
      }

      if (title.length > maxLength) {
        let words = title.split(' ')
        let lines = ['', '']
        for (const word of words) {
          if ((lines[0] + word).length > maxLength - 10) lines[1] += ` ${word}`
          else lines[0] += `${word} `
        }
        L(chalk`{${COLORS.light1} │} {${COLORS.red} X} {${COLORS.light1} │}` +
        chalk`{white  ${lines[0]}} ${' '.repeat(maxLength - lines[0].length)}{${COLORS.light1} │}`)
        L(chalk`{${COLORS.light1} │} {${COLORS.red}  } {${COLORS.light1} │}` +
        chalk`{white  ${lines[1]}} ${' '.repeat(maxLength - lines[1].length)}{${COLORS.light1} │}`)
      } else {
        L(chalk`{${COLORS.light1} │} {${COLORS.red} X} {${COLORS.light1} │}` +
        chalk`{white  ${title}} ${' '.repeat(maxLength - title.length)}{${COLORS.light1} │}`)
      }

      if (ind === moduleRisks.length - 1) {
        L(chalk`{${COLORS.light1} └───┴─${'─'.repeat(maxLength)}─┘}`)
      } else {
        L(chalk`{${COLORS.light1} ├───┼─${'─'.repeat(maxLength)}─┤}`)
      }
    })
  } else {
    reportSuccessMsg('No Module Risk')
  }
  L()

  /* Code Quality */
  L()
  L(chalk`{white Code Quality:}`)
  L()
  if (codeQuality.length > 0) {
    codeQuality.forEach(({ title }, ind) => {
      if (ind === 0) {
        L(chalk`{${COLORS.light1} ┌───┬─${'─'.repeat(maxLength)}─┐}`)
      }

      if (title.length > maxLength) {
        let words = title.split(' ')
        let lines = ['', '']
        for (const word of words) {
          if ((lines[0] + word).length > maxLength - 10) lines[1] += ` ${word}`
          else lines[0] += `${word} `
        }
        L(chalk`{${COLORS.light1} │} {${COLORS.red} X} {${COLORS.light1} │}` +
        chalk`{white  ${lines[0]}} ${' '.repeat(maxLength - lines[0].length)}{${COLORS.light1} │}`)
        L(chalk`{${COLORS.light1} │} {${COLORS.red}  } {${COLORS.light1} │}` +
        chalk`{white  ${lines[1]}} ${' '.repeat(maxLength - lines[1].length)}{${COLORS.light1} │}`)
      } else {
        L(chalk`{${COLORS.light1} │} {${COLORS.red} X} {${COLORS.light1} │}` +
        chalk`{white  ${title}} ${' '.repeat(maxLength - title.length)}{${COLORS.light1} │}`)
      }

      if (ind === codeQuality.length - 1) {
        L(chalk`{${COLORS.light1} └───┴─${'─'.repeat(maxLength)}─┘}`)
      } else {
        L(chalk`{${COLORS.light1} ├───┼─${'─'.repeat(maxLength)}─┤}`)
      }
    })
  } else {
    reportSuccessMsg('Passes all criteria')
  }
  L()
}

function moduleList (report) {
  /* Module List */
  L(chalk`{${COLORS.light1}   Module Name${' '.repeat(W[0] - 9)}Risk${' '.repeat(W[1] - 3)}License${' '.repeat(W[2] - 6)}Security}`)
  L(chalk`{${COLORS.light1} ┌──${'─'.repeat(W[0])}┬${'─'.repeat(W[1])}┬${'─'.repeat(W[2])}┬${'─'.repeat(W[3])}┐}`)
  report.forEach((pkg, ind) => {
    /* Module Name */
    let mod = pkg.name + ' @ ' + pkg.version
    if (mod.length > W[0]) mod = `${pkg.name.slice(0, W[0] - 14)}... @ ${pkg.version}`

    /* Risk */
    let maxRisk = 0

    /* License */
    const license = pkg.license.title.includes(':') ? pkg.license.title.split(':')[1].trim().replace(/['"]+/g, '') : 'NO LICENSE'
    const licenseBadge = pkg.license.pass ? chalk`{${COLORS.green} ✓}` : chalk`{${COLORS.red} X}`

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
      vulns.reduce((a, b) => a + b, 0) === 0 ? chalk`{${COLORS.green} ✓} ` + chalk`{white 0}` : chalk`{${COLORS.red} X} `,
      vulns[3] > 0 ? chalk`{${COLORS.red} ${vulns[3]}C} ` : '',
      vulns[2] > 0 ? chalk`{${COLORS.orange} ${vulns[2]}H} ` : '',
      vulns[1] > 0 ? chalk`{${COLORS.yellow} ${vulns[1]}M} ` : '',
      vulns[0] > 0 ? chalk`{${COLORS.light1} ${vulns[0]}L} ` : ''
    ]

    /* Logging */
    L(chalk`{${COLORS.light1} │} ` +
    chalk`{white ${mod} }` +
    chalk`${' '.repeat(W[0] - mod.length)}{${COLORS.light1} │} ` +
    severityMeter(SEVERITY_RMAP[maxRisk].toUpperCase())[0] + severityMeter(SEVERITY_RMAP[maxRisk].toUpperCase())[1] + severityTextLabel(SEVERITY_RMAP[maxRisk].toUpperCase()) +
    chalk`${' '.repeat(W[1] - 10)}{${COLORS.light1} │} ` +
    licenseBadge + chalk` {white ${license}}` +
    chalk`${' '.repeat(W[2] - license.length - 3)}{${COLORS.light1} │} ` +
    securityBadges.join('') +
    chalk`${' '.repeat(W[3] - securityBadges.join('').length / 9)}{${COLORS.light1} │}`)

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
