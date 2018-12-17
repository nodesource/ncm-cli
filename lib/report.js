'use strict'

const fs = require('fs')
const path = require('path')

const logger = require('./logger')
const { handleError } = require('./util')

module.exports = {
  scoreReport,
  jsonReport,
  outputReport
}

function scoreReport (report) {
  let width = 70

  const logggerBar = () => logger([{ text: `╟${'—'.repeat(width * 0.55)}┼${'—'.repeat(width * 0.25 - 1)}┼${'—'.repeat(width * 0.20 - 1)}╢`, style: 'table' }])
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
    { text: `${' '.repeat(width * 0.05)}${pkg.score}`, style: pkg.score < 50 ? ['red', 'bold'] : [] },
    { text: `${' '.repeat(width * 0.10 + 3 - String(pkg.score).length)}║`, style: 'table' }
  ])

  logger([{ text: 'NCM-CLI', style: 'ncm' }])
  loggerTableHeader()
  loggerTableTitle()
  for (let pkg in report) {
    pkg = report[pkg]
    if (pkg.name.length > width * 0.40) pkg.name = `${pkg.name.slice(0, width * 0.40)}..`
    logggerBar()
    loggerPackageDetails(pkg)
  }
  loggerTableFooter()
}

function jsonReport (report) {
  try {
    let json = JSON.stringify(report, null, 2)
    console.log(json)
  } catch (err) {
    handleError('Tools::UnableToParseReport')
  }
}

function outputReport (report, dir) {
  if (typeof (dir) === 'boolean') dir = __dirname

  try {
    let json = JSON.stringify(report)
    let timestamp = new Date().valueOf()
    let p = path.join(dir, `ncm-score-report-${timestamp}.json`)
    fs.writeFile(p, json, 'utf8', (err) => onWrite(err, p))
  } catch (err) {
    handleError('Tools::UnableToFormatOutput')
  }
}

function onWrite (err, p) {
  if (err) {
    handleError('Tools::UnableToWriteReport')
    return
  }

  logger([{ text: 'Score report written to: ', style: [] }])
  logger([{ text: p, style: [] }])
}
