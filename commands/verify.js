'use strict'

const analyze = require('../lib/ncm-analyze-tree')
const { getTokens } = require('../lib/config')
const {
  handleError,
  refreshSession,
  formatAPIURL,
  graphql,
} = require('../lib/util')
const {
  jsonReport,
  outputReport,
  shortReport,
  longReport
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
    report,
    long
  } = argv

  if (argv.help) {
    printHelp()
    return
  }

  const { session } = getTokens()

  doVerify(session, argv)

  return true
}

async function doVerify (session, argv) {
  const { json, output, dir, report } = argv

  /* search */ 
  if (argv._.length === 2) {
    // todo

    if (!argv._[1].includes('@')) {
      console.log(`Unrecognized module syntax: ${argv._[1]}`)
      process.exitCode = 1
      return
    }

    const options = {
      token: session,
      url: formatAPIURL('/ncm2/api/v2/graphql') 
    }

    const vars = {
      name: argv._[1].split('@')[0],
      version: argv._[1].split('@')[1]
    }

    const data = await graphql(
      options,
      `query($name: String!, $version: String!) {
          packageVersion(name: $name, version: $version) {
            name
            version
            published
            publishedAt
            description
            author
            maintainers
            keywords
            scores {
              group
              name
              pass
              severity
              title
              data
            }
          }
        }
        `,
      vars
    )

    let report = data.packageVersion
    for (const score of report.scores) {
      if (score.group !== 'compliance' && 
          score.group !== 'security' &&
          score.group !== 'risk') {
        continue
      }

      if (score.pass === false) {
        report.failures ? report.failures.push(score) : report.failures = [ score ]
      }

      if (score.name === 'license') {
        report.license = score
      }
    }

    /* todo: pass off to reports */
    console.log(JSON.stringify(report, null, 2))
  }

  /* verify */ 
  if (argv._.length === 1) {
    
    // start position logic
    if (!dir) dir = process.cwd()

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
      pkgScores.push({ name, version, maxSeverity, failures, license })
    }

  if (report && long) longReport(pkgScores, dir)
  else if (report) shortReport(pkgScores, dir)
  if (json) jsonReport(pkgScores)
  if (output) outputReport(pkgScores, output)

    if (hasFailures) process.exitCode = 1
  }
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
