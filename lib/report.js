'use strict'

const fs = require('fs')
const path = require('path')
const util = require('util')

const fsPromises = {
  writeFile: util.promisify(fs.writeFile)
}

const logger = require('./logger')
const { handleError } = require('./util')

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

module.exports = {
  scoreReport,
  jsonReport,
  outputReport
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
    console.log(json)
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
