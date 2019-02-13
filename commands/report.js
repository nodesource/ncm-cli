'use strict'

const analyze = require('../lib/ncm-analyze-tree')
const { getTokens } = require('../lib/config')
const { formatAPIURL } = require('../lib/util')
const {
  jsonReport,
  outputReport,
  reportFailMsg
} = require('../lib/report/util')
const longReport = require('../lib/report/long')
const shortReport = require('../lib/report/short')
const logger = require('../lib/logger')
const { helpHeader } = require('../lib/help')
const L = console.log

const SEVERITY_MAP = {
  NONE: 0,
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
  CRITICAL: 4
}

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
    process.exitCode = 1
    if (err.code === 'ENOENT') {
      L()
      reportFailMsg(`Unable to find project at: ${dir}`)
      L()
    } else {
      L()
      reportFailMsg('Unable to fetch project report.')
      L()
    }
    return
  }

  for (const { name, version, scores } of data) {
    let maxSeverity = SEVERITY_MAP.NONE
    let license
    const failures = []

    for (const score of scores) {
      const severityValue = SEVERITY_MAP[score.severity]

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
    pkgScores.push({ name, version, maxSeverity, failures, license, scores })
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
