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
  const { scores, failures = [], license } = report

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
  L('Security:')
  L()
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
      L()
    }
  } else {
    L(boxbox('✓', 'No Security Vulnerabilities', COLORS.green))
    L()
  }

  /* License */
  L()
  L('License:')
  L()
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
  L()

  /* Module Risk */
  L()
  L('Module Risk:')
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
    L(boxbox('✓', 'No Module Risk', COLORS.green))
  }
  L()

  /* Code Quality */
  L()
  L('Code Quality')
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
    L(boxbox('✓', 'Passes all criteria', COLORS.green))
  }
  L()
}
