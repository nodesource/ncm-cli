'use strict'

const analyze = require('ncm-analyze-tree')
const { getTokens } = require('../lib/config')
const {
  handleError,
  refreshSession
} = require('../lib/util')
const {
  scoreReport,
  jsonReport,
  outputReport
} = require('../lib/report')
const { displayHelp } = require('../lib/help')

module.exports = verify

function verify (argv) {
  let { help } = argv
  if ((argv['_'] && argv['_'][1] === 'help') || help) {
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
  if (!dir) dir = path.join(__dirname, '..')

  const scores = []
  let failures = false

  let data
  try {
    data = await analyze({
      dir,
      token: session
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

  for (const { name, version, score, results } of data) {
    scores.push({ name, version, score })
    for (const result of results) {
      if (result.pass === false) {
        failures = true
        break
      }
    }
  }

  if (report) scoreReport(scores)
  if (json) jsonReport(scores)
  if (output) outputReport(scores, output)

  if (failures) process.exitCode = 1
}
