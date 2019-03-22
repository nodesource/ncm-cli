'use strict'

const path = require('path')
const {
  formatAPIURL,
  graphql
} = require('../lib/util')
const moduleReport = require('../lib/report/module')
const universalModuleTree = require('universal-module-tree')
const {
  COLORS,
  header,
  failure,
  formatError
} = require('../lib/ncm-style')
const { helpHeader } = require('../lib/help')
const semver = require('semver')
const chalk = require('chalk')
const L = console.log
const E = console.error

module.exports = details
module.exports.optionsList = optionsList

async function details (argv, arg1, arg2, arg3) {
  if (argv.help) {
    printHelp()
    return
  }
  let { dir } = argv
  if (!dir) dir = process.cwd()

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

  const tree = await universalModuleTree(dir)
  const list = universalModuleTree.flatten(tree)
  let requirePaths = []
  for (const pkg of list) {
    if (pkg.name === name && pkg.version === version) {
      requirePaths = pkg.paths
      break
    }
  }

  /* NCM-Cli Header */
  L()
  if (requirePaths.length > 0) {
    L(header(`${name} @ ${version} (within ${path.basename(dir)})`))
  } else {
    L(header(`${name} @ ${version}`))
  }

  if (!name || (version !== 'latest' && !semver.valid(version))) {
    E()
    E(failure(`Unrecognized module syntax: ${argv._.slice(1).join('')}`))
    E()
    process.exitCode = 1
    return
  }

  const vars = {
    name,
    version
  }

  let hasFailures = false
  let data
  try {
    data = await graphql(
      formatAPIURL('/ncm2/api/v2/graphql'),
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
    E(formatError('Failed to query NCM API. Have you run `ncm signin`?', err))
    E()
    process.exitCode = 1
    return
  }

  if (!data) {
    E()
    E(failure('Unable to fetch module details. Have you run `ncm signin`?'))
    E()
    process.exitCode = 1
    return
  }

  let report = Object.assign({ failures: [], requirePaths }, data.packageVersion)

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

  moduleReport(report)
  if (hasFailures) process.exitCode = 1
}

function printHelp () {
  helpHeader(
    'details',
    chalk`ncm {${COLORS.yellow} details} {${COLORS.teal} <module\{@version\}> [options]}`,
    'ncm details <module{@version}> [options]'
  )

  L(optionsList())
  L()
}

function optionsList () {
  return chalk`
{${COLORS.light1} ncm} {${COLORS.yellow} details} {${COLORS.teal} <module>}
{${COLORS.light1} ncm} {${COLORS.yellow} details} {${COLORS.teal} <module@version>}
  `.trim()
}
