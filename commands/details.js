'use strict'

const { getTokens } = require('../lib/config')
const {
  formatAPIURL,
  graphql
} = require('../lib/util')
const {
  jsonReport,
  outputReport,
  reportFailMsg
} = require('../lib/report/util')
const moduleReport = require('../lib/report/module')
const logger = require('../lib/logger')
const { helpHeader } = require('../lib/help')
const semver = require('semver')
const L = console.log

module.exports = details

async function details (argv, _dir) {
  const {
    json,
    output
  } = argv
  let { dir = _dir } = argv
  if (!dir) dir = process.cwd()

  if (argv.help) {
    printHelp()
    return
  }

  const { session } = getTokens()

  /* details */
  if (argv._.length > 1) {
    let pkgName, pkgVer
    switch (argv._.length) {
      case 4:
        pkgName = argv._[1]
        pkgVer = argv._[3]
        break
      case 3:
        pkgName = argv._[1]
        pkgVer = argv._[2]
        break
      case 2:
        pkgName = argv._[1].split('@')[0]
        pkgVer = argv._[1].split('@')[1]
        break
    }

    if (!pkgName || !semver.valid(pkgVer) || argv.length > 4) {
      L()
      reportFailMsg(`Unrecognized module syntax: ${argv._.slice(1).join('')}`)
      L()
      process.exitCode = 1
      return
    }

    const options = {
      token: session,
      url: formatAPIURL('/ncm2/api/v2/graphql')
    }

    const vars = {
      name: pkgName,
      version: pkgVer
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
      console.error(err)
      process.exitCode = 1
      return

      /* refresh session */
    }

    if (!data) {
      L()
      reportFailMsg('Unable to fetch module details.')
      L()
      process.exitCode = 1
      return
    }

    let report = Object.assign({ failures: [] }, data.packageVersion)

    if (!report.published) {
      L()
      reportFailMsg(`Module not found: ${argv._.slice(1).join('')}`)
      L()
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
  } else {
    process.exitCode = 1
    L()
    reportFailMsg('Unable to fetch details -- please specify a package.')
    L()
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
