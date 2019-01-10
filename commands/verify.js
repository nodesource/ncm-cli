'use strict'

const analyze = require('../lib/ncm-analyze-tree')
const { getTokens } = require('../lib/config')
const {
  handleError,
  refreshSession,
  formatAPIURL
} = require('../lib/util')
const {
  scoreReport,
  jsonReport,
  outputReport
} = require('../lib/report')
const logger = require('../lib/logger')
const { helpHeader } = require('../lib/help')

const SEVERITY_MAP = {
  NONE: 0,
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
  CRITICAL: 4
}

module.exports = verify

async function verify (argv, _dir) {
  const {
    json,
    output,
    dir = _dir || process.cwd(),
    report
  } = argv

  if (argv.help) {
    printHelp()
    return
  }

  const { session } = getTokens()

  const pkgScores = []
  let failures = false

  let data
  try {
    data = await analyze({
      dir,
      token: session,
      url: formatAPIURL('/ncm2/api/v2/graphql')
    })
  } catch (err) {
    // XXX(Jeremiah): Not the right way to handle this. See client-request retries.
    //
    // session token has expired, request new token and update
    if (err.response && err.response.message === 'Auth::LoginExpired') {
      refreshSession()
      // username / password has invalid token
      handleError('TEMP::InvalidToken')
    } else if (err.response && err.response.error === 'Unauthorized') {
      handleError('TEMP::Unauthorized')
    } else {
      console.error(err)
    }
    return
  }

  for (const { name, version, scores } of data) {
    let maxSeverity = SEVERITY_MAP.NONE

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
        failures = true
      }
    }
    pkgScores.push({ name, version, maxSeverity })
  }

  if (report) scoreReport(pkgScores)
  if (json) jsonReport(pkgScores)
  if (output) outputReport(pkgScores, output)

  if (failures) process.exitCode = 1
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
