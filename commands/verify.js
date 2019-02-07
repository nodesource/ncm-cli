'use strict'

const analyze = require('../lib/ncm-analyze-tree')
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
const longReport = require('../lib/report/long')
const shortReport = require('../lib/report/short')
const moduleReport = require('../lib/report/module')
const logger = require('../lib/logger')
const { helpHeader } = require('../lib/help')
const semver = require('semver')
const L = console.log

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
    long
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
    let pkgName = argv._.length === 4 ? argv._[1] : argv._[1].split('@')[0]
    let pkgVer = argv._.length === 4 ? argv._[3] : argv._[1].split('@')[1]

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

    let report = data.packageVersion

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
        report.failures ? report.failures.push(score) : report.failures = [ score ]
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

  /* verify */
  if (argv._.length === 1) {
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
      pkgScores.push({ name, version, maxSeverity, failures, license })
    }

    if (!json && !output && !long) shortReport(pkgScores, dir)
    if (long) longReport(pkgScores, dir)
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
