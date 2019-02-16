'use strict'

const analyze = require('../lib/ncm-analyze-tree')
const { getTokens } = require('../lib/config')
const { formatAPIURL } = require('../lib/util')
const {
  jsonReport,
  outputReport,
  SEVERITY_RMAP
} = require('../lib/report/util')
const longReport = require('../lib/report/long')
const shortReport = require('../lib/report/short')
const logger = require('../lib/logger')
const { helpHeader } = require('../lib/help')
const {
  failure,
  formatError
} = require('../lib/ncm-style')
const E = console.error

module.exports = report

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

  const { session } = getTokens()

  /* verify */
  const pkgScores = []
  let hasFailures = false

  let data
  try {
    data = await analyze({
      dir,
      token: session,
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

  if (!json && !output && !long) shortReport(pkgScores, dir)
  if (long) longReport(pkgScores, dir)
  if (json) jsonReport(pkgScores)
  if (output) outputReport(pkgScores, output)
  if (hasFailures) process.exitCode = 1
}

function printHelp () {
  helpHeader()

  logger([{ text: 'ncm-cli verify', style: ['bold'] }])
  logger([{ text: `ncm-cli verify [options]`, style: [] }])
  logger()

  logger([{ text: 'verify Options:', style: ['bold'] }])
  logger([{ text: `--dir, -d`, style: [] }])
  logger([{ text: `--report, -r`, style: [] }])
  logger([{ text: `--json, -j`, style: [] }])
  logger([{ text: `--output, -o`, style: [] }])
  logger([{ text: `--certified, -C`, style: [] }])
  logger([{ text: `--production, -p`, style: [] }])
  logger()
}
