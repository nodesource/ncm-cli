'use strict'

const { getTokens } = require('../lib/config')
const {
  formatAPIURL,
  graphql
} = require('../lib/util')
const {
  jsonReport,
  outputReport
} = require('../lib/report/util')
const moduleReport = require('../lib/report/module')
const {
  header,
  failure,
  formatError
} = require('../lib/ncm-style')
const logger = require('../lib/logger')
const { helpHeader } = require('../lib/help')
const semver = require('semver')
const L = console.log
const E = console.error

module.exports = details

async function details (argv, arg1, arg2, arg3) {
  const {
    json,
    output
  } = argv

  if (argv.help) {
    printHelp()
    return
  }

  const { session } = getTokens()

  let name
  let version
  if (!arg1) {
    printHelp()
    process.exitCode = 1
    return
  } else if (arg1.indexOf('@') > 0 && !arg2 && !arg3) {
    ;[name, version] = arg1.split('@')
  } else if (arg2 === '@' && arg3) {
    name = arg1
    version = arg3
  } else if (arg1) {
    name = arg1
    version = arg2 || 'latest'
  } else {
    printHelp()
    process.exitCode = 1
    return
  }

  /* NCM-Cli Header */
  L()
  L(header(`${name} @ ${version}`))

  if (!name || (version !== 'latest' && !semver.valid(version))) {
    E()
    E(failure(`Unrecognized module syntax: ${argv._.slice(1).join('')}`))
    E()
    process.exitCode = 1
    return
  }

  const options = {
    token: session,
    url: formatAPIURL('/ncm2/api/v2/graphql')
  }

  const vars = {
    name,
    version
  }

  let hasFailures = false
  let data
  try {
    data = await graphql(
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
  } catch (err) {
    E()
    E(formatError('Failed to query NCM API', err))
    E()
    process.exitCode = 1
    return
  }

  if (!data) {
    E()
    E(failure('Unable to fetch module details.'))
    E()
    process.exitCode = 1
    return
  }

  let report = Object.assign({ failures: [] }, data.packageVersion)

  if (!report.published) {
    E()
    E(failure(`Module not found: ${argv._.slice(1).join('')}`))
    E()
    process.exitCode = 1
    return
  }

  for (const score of report.scores) {
    if (score.group !== 'compliance' &&
        score.group !== 'security' &&
        score.group !== 'risk') {
      continue
    }

    if (score.pass === false) {
      report.failures.push(score)
      hasFailures = true
    }

    if (score.name === 'license') {
      report.license = score
    }
  }

  if (!json && !output) moduleReport(report)
  if (json) jsonReport(report)
  if (output) outputReport(report, output)
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
