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
const { displayHelp } = require('../lib/help')

const SEVERITY_MAP = {
  NONE: 0,
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
  CRITICAL: 4
}

module.exports = verify

function verify (argv) {
  const help = argv.help || argv._[1] === 'help'

  if (help) {
    displayHelp('verify')
    return true
  }

  const { session } = getTokens()

  doVerify(session, argv)

  return true
}

async function doVerify (session, argv) {
  let { json, output, dir, report } = argv

  // start position logic
  if (!dir) dir = process.cwd()

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
