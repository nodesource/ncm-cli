'use strict'

const path = require('path')
const analyze = require('../lib/ncm-analyze-tree')
const { formatAPIURL, refreshSession } = require('../lib/util')
const {
  jsonReport,
  outputReport,
  SEVERITY_RMAP,
  moduleSort
} = require('../lib/report/util')
const longReport = require('../lib/report/long')
const shortReport = require('../lib/report/short')
const { helpHeader } = require('../lib/help')
const {
  COLORS,
  header,
  failure,
  formatError
} = require('../lib/ncm-style')
const chalk = require('chalk')
const L = console.log
const E = console.error

module.exports = report
module.exports.optionsList = optionsList

async function report (argv, _dir) {
  const {
    json,
    output,
    long
  } = argv
  let { dir = _dir } = argv
  if (!dir) dir = process.cwd()

  if (argv.help) {
    printHelp()
    return
  }

  /* NCM-Cli Header */
  L()
  L(header(`${path.basename(dir)} Report`))

  /* verify */
  let pkgScores = []
  let hasFailures = false

  // analyze is parallelized between 'pages' of a size...
  // ... so just always refresh before due to race conditions
  await refreshSession()

  let data
  try {
    data = await analyze({
      dir,
      url: formatAPIURL('/ncm2/api/v2/graphql')
    })
  } catch (err) {
    if (err.code === 'ENOENT') {
      E()
      E(failure(`Unable to find project at: ${dir}`))
      E()
    } else {
      E()
      E(formatError('Unable to fetch project report.', err))
      E()
    }
    process.exitCode = 1
    return
  }

  for (const { name, version, scores, published } of data) {
    let maxSeverity = 0
    let license
    const failures = []

    for (const score of scores) {
      const severityValue = SEVERITY_RMAP.indexOf(score.severity)

      if (score.group !== 'compliance' &&
          score.group !== 'security' &&
          score.group !== 'risk') {
        continue
      }

      if (severityValue > maxSeverity) {
        maxSeverity = severityValue
      }

      if (score.pass === false) {
        failures.push(score)
        hasFailures = true
      }

      if (score.name === 'license') {
        license = score
      }
    }
    pkgScores.push({ name, version, published, maxSeverity, failures, license, scores })
  }

  pkgScores = moduleSort(pkgScores)

  if (!json && !output && !long) shortReport(pkgScores, dir, argv)
  if (long) longReport(pkgScores, dir, argv)
  if (json) jsonReport(pkgScores)
  if (output) outputReport(pkgScores, output)
  if (hasFailures) process.exitCode = 1
}

function printHelp () {
  helpHeader(
    'report',
    chalk`ncm {${COLORS.yellow} report} {${COLORS.teal} [<directory>] [options]}`,
    'ncm report [<directory>] [options]'
  )

  L(optionsList())
  L()
}

function optionsList () {
  return chalk`
{${COLORS.light1} ncm} {${COLORS.yellow} report}
{${COLORS.light1} ncm} {${COLORS.yellow} report} {${COLORS.teal} <directory>}
  {${COLORS.teal} -l, --long}              {white Expanded output with module list}
  {${COLORS.teal} -c --compliance}         {white Expanded output with compliance failures}
  {${COLORS.teal} -s --security}           {white Expanded output with security failures}
  {${COLORS.teal} -j, --json}              {white Output report as JSON}
  {${COLORS.teal} -o, --output <filepath>} {white Write JSON report to file}
  `.trim()
}
