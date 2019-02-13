'use strict'

module.exports = moduleReport

const L = console.log
const {
  COLORS,
  W,
  reportHeader,
  SEVERITY_RMAP,
  severityMeter,
  shortVulnerabilityList,
  reportSuccessMsg,
  reportFailMsg
} = require('./util')
const chalk = require('chalk')

function moduleReport (report) {
  const { name, version, scores, failures, license } = report

  const SEVERITY_COLORMAP = {
    None: COLORS.light1,
    Low: COLORS.light1,
    Medium: COLORS.yellow,
    High: COLORS.orange,
    Critical: COLORS.red
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
  let moduleRisk = 'None'
  if (failures.length > 0) {
    for (const { severity } of failures) {
      let formatted = severity[0].toUpperCase() + severity.slice(1).toLowerCase()
      if (SEVERITY_RMAP.indexOf(formatted) > SEVERITY_RMAP.indexOf(moduleRisk)) moduleRisk = formatted
    }
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
