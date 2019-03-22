'use strict'

module.exports = moduleReport

const {
  W,
  SEVERITY_RMAP,
  SEVERITY_COLOR,
  severityMeter,
  shortVulnerabilityList
} = require('./util')
const {
  COLORS,
  boxbox
} = require('../ncm-style')
const chalk = require('chalk')
const L = console.log

function moduleReport (report) {
  const { scores, failures = [], license, requirePaths } = report

  let moduleRisks = []
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

  moduleRisks = moduleRisks.sort((a, b) => {
    if (SEVERITY_RMAP.indexOf(a.severity) > SEVERITY_RMAP.indexOf(b.severity)) return -1
    if (SEVERITY_RMAP.indexOf(b.severity) > SEVERITY_RMAP.indexOf(a.severity)) return 1
  })

  const maxLength = W.reduce((a, b) => a + b)

  /* Module Risk */
  let moduleRisk = 'NONE'
  for (const { severity } of failures) {
    if (SEVERITY_RMAP.indexOf(severity) > SEVERITY_RMAP.indexOf(moduleRisk)) {
      moduleRisk = severity
    }
  }
  const riskColor = SEVERITY_COLOR[moduleRisk]

  L()
  L(boxbox(
    severityMeter(moduleRisk),
    `${moduleRisk[0].toUpperCase() + moduleRisk.slice(1).toLowerCase()} Risk`,
    riskColor,
    4 // Need to override the symbol length because unicode.
  ))

  /* Security Overview */
  L()
  L(chalk`{bold Security Risk:}`)
  shortVulnerabilityList([report])
  L()

  /* Security Detail */
  if (securityVulnerabilities.length > 0) {
    for (const { severity, title, data } of securityVulnerabilities) {
      L(boxbox(
        severity[0].toUpperCase(),
        title,
        SEVERITY_COLOR[severity]
      ))

      L(chalk`{${COLORS.light1} Versions ${data.vulnerable.join(' ')} (Source: Synk)}`)
      L(chalk`{${COLORS.blue} |➔ https://snyk.io/vuln/${data.id}}`)
    }
  } else {
    L(boxbox('✓', 'No Security Vulnerabilities', COLORS.green))
  }

  /* License */
  L()
  L(chalk`{bold License Risk:}`)
  const licenseName = license &&
                      license.data &&
                      license.data.spdx
    ? license.data.spdx
    : 'UNKNOWN'
  if (license && license.pass === true) {
    L(boxbox('✓', licenseName, COLORS.green))
  } else {
    let msg = 'Unknown license'
    if (licenseName) {
      msg = `Noncompliant license: ${licenseName}`
    }
    L(boxbox('X', msg, COLORS.red))
  }

  /* Module Risk */
  L()
  L(chalk`{bold Module Risk:}`)
  if (moduleRisks.length > 0) {
    moduleRisks.forEach(({ title, severity }, ind) => {
      if (ind === 0) {
        L(chalk`{${COLORS.light1} ┌──────┬─${'─'.repeat(maxLength)}─┐}`)
      }

      severity = severityTextLabel(severity)

      const lines = lineWrap(title, maxLength)

      {
        const line = lines.shift()
        L(chalk`{${COLORS.light1} │} {${COLORS.red} ${severity}} {${COLORS.light1} │}` +
        chalk`{white  ${line}} ${' '.repeat(maxLength - line.length)}{${COLORS.light1} │}`)
      }

      for (const line of lines) {
        L(chalk`{${COLORS.light1} │}      {${COLORS.light1} │}` +
        chalk`{white  ${line}} ${' '.repeat(maxLength - line.length)}{${COLORS.light1} │}`)
      }

      if (ind === moduleRisks.length - 1) {
        L(chalk`{${COLORS.light1} └──────┴─${'─'.repeat(maxLength)}─┘}`)
      } else {
        L(chalk`{${COLORS.light1} ├──────┼─${'─'.repeat(maxLength)}─┤}`)
      }
    })
  } else {
    L(boxbox('✓', 'No Module Risk', COLORS.green))
  }

  /* Code Quality */
  L()
  L(chalk`{bold Code Quality} (does not affect risk score){bold :}`)
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
        L(chalk`{${COLORS.light1} │} {${COLORS.yellow} !} {${COLORS.light1} │}` +
        chalk`{white  ${lines[0]}} ${' '.repeat(maxLength - lines[0].length)}{${COLORS.light1} │}`)
        L(chalk`{${COLORS.light1} │} {${COLORS.red}  } {${COLORS.light1} │}` +
        chalk`{white  ${lines[1]}} ${' '.repeat(maxLength - lines[1].length)}{${COLORS.light1} │}`)
      } else {
        L(chalk`{${COLORS.light1} │} {${COLORS.yellow} !} {${COLORS.light1} │}` +
        chalk`{white  ${title}} ${' '.repeat(maxLength - title.length)}{${COLORS.light1} │}`)
      }

      if (ind === codeQuality.length - 1) {
        L(chalk`{${COLORS.light1} └───┴─${'─'.repeat(maxLength)}─┘}`)
      } else {
        L(chalk`{${COLORS.light1} ├───┼─${'─'.repeat(maxLength)}─┤}`)
      }
    })
  } else {
    L(boxbox('✓', 'Passes all criteria', COLORS.green))
  }
  if (requirePaths.length > 0) {
    /* Required By */
    L()
    L(chalk`{bold Required By} (leftmost is directly in your package){bold :}`)
    requirePaths.sort().forEach((path, ind) => {
      if (ind === 0) {
        L(chalk`{${COLORS.light1} ┌─${'─'.repeat(maxLength)}─┐}`)
      }

      let formatted = path.map(({ data }) => `${data.name} @ ${data.version}`).join(' / ')
      if (!formatted) formatted = '(Directly in your package)'
      const lines = lineWrap(formatted, maxLength, '/')

      for (const line of lines) {
        L(chalk`{${COLORS.light1} │} ${line} ${' '.repeat(maxLength - line.length)}{${COLORS.light1} │}`)
      }

      if (ind === requirePaths.length - 1) {
        L(chalk`{${COLORS.light1} └─${'─'.repeat(maxLength)}─┘}`)
      } else {
        L(chalk`{${COLORS.light1} ├─${'─'.repeat(maxLength)}─┤}`)
      }
    })
  }
  L()
}

function severityTextLabel (severity) {
  const severityLabel = {
    CRITICAL: 'Crit',
    HIGH: 'High',
    MEDIUM: 'Med ',
    LOW: 'Low ',
    NONE: 'None'
  }
  return chalk`{${SEVERITY_COLOR[severity]} ${severityLabel[severity]}}`
}

function lineWrap (str, maxLength, split = ' ') {
  let words = str.split(split)
  let lines = []
  let lineIdx = 0
  for (const word of words) {
    while ((lines[lineIdx] + word).length > maxLength) {
      lineIdx++
    }
    if (!lines[lineIdx]) lines[lineIdx] = lineIdx > 0 ? [''] : []
    lines[lineIdx].push(word)
  }
  return lines.map(line => line.join(split).trim())
}
