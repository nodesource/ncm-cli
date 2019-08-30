'use strict'

const path = require('path')
const { promisify } = require('util')
const writeFile = promisify(require('fs').writeFile)
const {
  success,
  formatError
} = require('../ncm-style')
const {
  summaryInfo,
  moduleSort,
  filterReport,
  parseFilterOptions,
  formatFilterOptions
} = require('./util')
const renderTemplate = require('./html-template')
const L = console.log

module.exports = htmlReport

async function htmlReport (report, whitelist, dir, output, argv) {
  /* Output may only use the `.html` file format */
  if (output !== true && !(/^.*\.html$/.test(path.basename(output)))) {
    L()
    L(formatError('Invalid file extension to write the HTML report. Please use `*.html`.'))
    L()
    process.exitCode = 1
    return
  }

  const title = `${path.basename(dir) || 'NCM'}`
  const summary = summaryInfo(report) // { riskCount, insecureModules, complianceCount, securityCount }
  const reportLength = report.length
  const whitelistLength = whitelist.length

  const filterOptions = parseFilterOptions(argv)
  const formattedfilterOptions = formatFilterOptions(filterOptions)
  report = filterReport(report, filterOptions)
  report = moduleSort(report)

  whitelist = filterReport(whitelist, filterOptions)
  whitelist = moduleSort(whitelist)

  const htmlData = renderTemplate(
    title,
    summary,
    report,
    reportLength,
    whitelist,
    whitelistLength,
    formattedfilterOptions
  )

  /*
    No write location was specified.
    Setting output location to current working directory with generated report name.
  */
  if (output === true) output = path.join(process.cwd(), `${title.toLowerCase()}-report-${Date.now()}.html`)

  /* Write report to file */
  try {
    await writeFile(output, htmlData)
    L()
    L(success(`Wrote HTML report to: ${output}`))
    L()
  } catch (error) {
    L()
    L(formatError(`Unable to write HTML report to: ${output}`, error))
    L()
    process.exitCode = 1
  }
}
