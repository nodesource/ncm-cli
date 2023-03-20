'use strict'

const path = require('path')
const fs = require('fs')

const analyze = require('../lib/ncm-analyze-tree')
const {
  apiRequest,
  formatAPIURL,
  graphql
} = require('../lib/util')
const config = require('../lib/config')
const score = require('../lib/report/score')
const {
  SEVERITY_RMAP,
  moduleSort
} = require('../lib/report/util')
const longReport = require('../lib/report/long')
const shortReport = require('../lib/report/short')
const { helpHeader } = require('../lib/help')
const GitHubActionCheck = require('../lib/report/github-action')
const {
  COLORS,
  header,
  failure,
  formatError
} = require('../lib/ncm-style')
const chalk = require('chalk')
const L = console.log
const E = console.error
const githubMode = process.env.IS_GITHUB_ACTION
const isTest = process.env.NODE_ENV === 'testing'

module.exports = report
module.exports.optionsList = optionsList

async function report (argv, _dir) {
  const {
    long,
    json,
    gate
  } = argv
  let { dir = _dir } = argv
  if (!dir) dir = process.cwd()

  if (argv.help) {
    printHelp()
    return
  }

  if (!json && !gate) {
    /* NCM-Cli Header */
    L()
    L(header(`${path.basename(dir)} Report`))
  }

  let orgId = config.getValue('orgId')

  try {
    const details = await apiRequest(
      'GET',
      formatAPIURL('/accounts/user/details')
    )
    if (typeof details.orgId === 'string') {
      orgId = details.orgId
    }
  } catch (err) {
    E()
    E(formatError('Failed to fetch user info. Have you run `ncm signin`?', err))
    E()
    process.exitCode = 1
    return
  }

  const whitelist = new Set()
  try {
    const data = await graphql(
      formatAPIURL('/ncm2/api/v2/graphql'),
      `query($organizationId: String!) {
        policies(organizationId: $organizationId) {
          whitelist {
            name
            version
          }
        }
      }`,
      { organizationId: orgId }
    )
    for (const policy of data.policies) {
      for (const pkg of policy.whitelist) {
        whitelist.add(`${pkg.name}@${pkg.version}`)
      }
    }
  } catch (err) {
    L()
    L(formatError('Unable to fetch whitelist.', err))
    L()
  }

  /* verify */
  let pkgScores = []
  let hasFailures = false

  let data
  try {
    data = await analyze({
      dir,
      url: formatAPIURL('/ncm2/api/v2/graphql')
    })
  } catch (err) {
    if (err.code === 'ENOENT') {
      E()
      E(failure(err.message))
      E(formatError(`Unable to read project at: ${dir}`, err))
      E()
    } else {
      E()
      E(formatError(`Unable to analyze project. ${err.message}.`, err))
      E()
    }
    process.exitCode = 1
    return
  }

  const {
    name: pkgName,
    version: pkgVersion
  } = require(path.join(__dirname, '..', 'package.json'))

  let nestedPkgName, nestedPkgVersion
  try {
    const {
      name: _nestedPkgName,
      version: _nestedPkgVersion
    } = require(`${dir}/package.json`)
    nestedPkgName = _nestedPkgName
    nestedPkgVersion = _nestedPkgVersion
  } catch (_) {}

  const isNested = pkgName === nestedPkgName && pkgVersion === nestedPkgVersion

  for (const { name, version, scores, published } of data) {
    let maxSeverity = 0
    let license = {}
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

    if (!version) {
      // skip unknown version to make the report consistent
      continue
    }

    if (isNested && !!maxSeverity) {
      continue
    }

    const getLicenseScore = ({ pass }) => !pass ? 0 : null
    if (getLicenseScore(license) === 0) maxSeverity = 4

    pkgScores.push({
      name,
      version,
      published,
      maxSeverity,
      failures,
      license,
      scores
    })
  }

  pkgScores = moduleSort(pkgScores)

  const whitelisted = pkgScores.filter(pkg => whitelist.has(`${pkg.name}@${pkg.version}`))
    .map(pkgScore => ({ ...pkgScore, quantitativeScore: score(pkgScore.scores, pkgScore.maxSeverity) }))
  pkgScores = pkgScores.filter(pkg => !whitelist.has(`${pkg.name}@${pkg.version}`))
    .map(pkgScore => ({ ...pkgScore, quantitativeScore: score(pkgScore.scores, pkgScore.maxSeverity) }))

  if (gate) {
    const ret = []
    const pkgLock = fs.readFileSync(path.join(dir, 'package-lock.json'), 'utf8')
    const pkgJson = fs.readFileSync(path.join(dir, 'package.json'), 'utf8')
    pkgScores.forEach(pkg => {
      if (pkg.maxSeverity !== 0) {
        let isLock = false
        let start = findPkgFromJson(pkgJson, pkg.name)
        if (start <= 0) {
          isLock = true
          start = findPkgVerFromLock(pkgLock, pkg.name, pkg.version)
        }
        pkg.failures = pkg.failures || []
        const reasons = pkg.failures.map(failure => `• ${failure.title}`).join('%0A')
        ret.push({
          message: `NCM found ${pkg.failures.length} issues in ${pkg.name}@${pkg.version}:%0A${reasons}`,
          path: isLock ? 'package-lock.json' : 'package.json',
          line: { start, end: start },
          level: 'failure'
        })
      }
    })
    let sh = ''
    ret.forEach(item => {
      sh += `echo "::error title=NCM Report,file=${item.path},line=${item.line.start},col=1::${item.message}"\n`
    })
    fs.writeFileSync('ncm-annotate.sh', sh)
    return L(JSON.stringify(ret, null, 2))
  }

  function findPkgFromJson (json, pkg) {
    const lines = json.split('\n')

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(pkg)) {
        return i + 1
      }
    }

    return -1
  }

  function findPkgVerFromLock (lock, pkg, ver) {
    try {
      const searchTerms = `"${pkg}": {
        "version": "${ver}"`
      const terms = searchTerms.split('\n').map(term => term.trim())
      const lines = lock.split('\n')
      const matches = []
      lines.forEach((line, lineNumber) => {
        if (terms.some(term => line.includes(term))) {
          if (matches.length && matches[0] === lineNumber) {
            matches.push(lineNumber + 1)
          } else if (!matches.length) {
            matches.push(lineNumber + 1)
          }
        }
      })
      return matches[matches.length - 1]
    } catch (err) {
      return -1
    }
  }

  if (json) return L(JSON.stringify(pkgScores, null, 2))
  if (!long) shortReport(pkgScores, whitelisted, dir, argv)
  if (long) longReport(pkgScores, whitelisted, dir, argv)

  if (githubMode && !isTest) {
    await GitHubActionCheck(pkgScores, whitelisted, hasFailures)
  }

  if (hasFailures) {
    process.exitCode = 1
  }
}

function printHelp () {
  helpHeader(
    'report',
    chalk`{${COLORS.light1} ncm} {${COLORS.yellow} report} {${COLORS.teal} [<directory>] [options]}`,
    'ncm report [<directory>] [options]',
    chalk`
Generates a project-wide report of directory risk and quality of installed or specified packages.
The top five riskiest modules detected will be displayed alongside a concise project report.

A report with a list of all modules can be generated by passing {${COLORS.teal} --long}.

Reports may be filtered based on any of the following flags:
  {${COLORS.teal} --compliance}, {${COLORS.teal} --security}
    `
  )

  L(optionsList())
  L()
}

function optionsList () {
  return chalk`
{${COLORS.light1} ncm} {${COLORS.yellow} report}
{${COLORS.light1} ncm} {${COLORS.yellow} report} {${COLORS.teal} <directory>}
  {${COLORS.teal} -d, --dir}               {white Another way to specify <directory>}
  {${COLORS.teal} -l, --long}              {white Full module list output}
  {${COLORS.teal} -c --compliance}         {white Compliance failures only output}
  {${COLORS.teal} -s --security}           {white Security failures only output}
  `.trim()
}
