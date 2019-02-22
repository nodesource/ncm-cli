'use strict'

const {
  apiRequest,
  formatAPIURL
} = require('../lib/util')
const { helpHeader } = require('../lib/help')
const { getValue, setValue } = require('../lib/config')
const whitelistReport = require('../lib/report/whitelist')
const { SEVERITY_RMAP } = require('../lib/report/util')
const {
  COLORS,
  header,
  failure,
  success,
  formatError
} = require('../lib/ncm-style')
const chalk = require('chalk')

const L = console.log
const E = console.error

const semver = require('semver')

module.exports = whitelist
module.exports.optionsList = optionsList

async function whitelist (argv) {
  if (argv.help) {
    printHelp()
    return
  }

  const policy = getValue('policyId')
  const orgId = getValue('orgId')
  const orgName = getValue('org')

  L()
  L(header(`${orgName} Whitelisted Modules`))

  let policyData
  try {
    const body = await apiRequest(
      'POST',
      formatAPIURL(`/ncm2/api/v2/graphql`),
      {
        query: queries.policy,
        variables: { orgId }
      }
    )
    policyData = body.data.policies[0]
  } catch (error) {
    E()
    E(formatError('Unable to fetch policy data.', error))
    E()
    process.exitCode = 1
    return
  }

  setValue('policyId', policyData.id)
  setValue('policy', policyData.name)

  const {
    list,
    add,
    remove
  } = argv

  // non-interactive list
  if (list && typeof list === 'boolean') {
    whitelistList()
  } else if (add || remove) {
    const input = add ? [ add, ...argv._.slice(1) ] : [ remove, ...argv._.slice(1) ]
    const entries = prepareInput(input)

    if (entries.length === 0) {
      E()
      E(failure(`Unable to ${add ? 'add' : 'remove'} invalid package(s) from the whitelist.`))
      E()
      process.exitCode = 1
      return
    }

    try {
      await apiRequest(
        'POST',
        formatAPIURL(`/ncm2/api/v2/graphql`),
        {
          query: queries[add ? 'add' : 'remove'],
          variables: { policy, orgId, entries }
        }
      )
    } catch (error) {
      E()
      E(formatError('Unable to modify whitelist data.', error))
      E()
      process.exitCode = 1
      return
    }

    L()
    L(success(`Package(s) ${add ? 'added' : 'removed'} successfully.`))
    L()
  } else if (!list && !add && !remove) {
    // TODO: interactive mode
    process.exitCode = 1
    printHelp()
  } else {
    process.exitCode = 1
    printHelp()
  }

  async function whitelistList () {
    let whitelistData
    try {
      const body = await apiRequest(
        'POST',
        formatAPIURL(`/ncm2/api/v2/graphql`),
        {
          query: queries.list,
          variables: { orgId }
        }
      )
      whitelistData = body.data.policies[0]
    } catch (error) {
      E()
      E(formatError('Unable to fetch policy data.', error))
      E()
      process.exitCode = 1
      return
    }

    let pkgData
    try {
      const body = await apiRequest(
        'POST',
        formatAPIURL(`/ncm2/api/v2/graphql`),
        {
          query: queries.pkgVer,
          variables: { pkgVers: whitelistData.whitelist }
        }
      )
      pkgData = body.data
    } catch (error) {
      E()
      E(formatError('Unable to fetch whitelist data.', error))
      E()
      process.exitCode = 1
      return
    }

    // prepare whitelist package data
    const report = []
    pkgData.packageVersions.forEach(({ name, version, published, scores }, index) => {
      const failures = []
      let maxSeverity = 0
      let license
      for (const score of scores) {
        if (!score.pass) {
          failures.push(score)
          if (score.group === 'risk') {
            let riskSeverity = SEVERITY_RMAP.indexOf(score.severity[0] + score.severity.slice(1).toLowerCase())
            if (riskSeverity > maxSeverity) maxSeverity = riskSeverity
          }
        }
        if (score.name === 'license') license = score
      }
      report.push({
        name,
        /* def response is null, replace with the user specified version */
        version: !version ? whitelistData.whitelist[index].version : version,
        published,
        scores,
        license,
        failures,
        maxSeverity
      })
    })

    whitelistReport(report, orgName)
  }
}

function prepareInput (input) {
  const entries = []

  while (input.length > 0) {
    const entry = input.shift()

    if (entry.indexOf('@') > 0 &&
        semver.valid(entry.split('@')[1])
    ) {
      /* pkg@ver */
      let [ name, version ] = entry.trim().split('@')
      entries.push({ name, version })
    } else {
      if (entry.indexOf('@') < 0 &&
        semver.valid(input[0])
      ) {
      /* pkg ver */
        const ver = input.shift()
        entries.push({
          name: entry.trim(),
          version: ver.trim()
        })
      } else if (entry.indexOf('@') < 0 &&
        input[0] === '@' &&
        semver.valid(input[1])
      ) {
        /* pkg @ ver */
        input.shift() // shift off '@'
        const ver = input.shift()
        entries.push({
          name: entry.trim(),
          version: ver.trim()
        })
      }
    }
  }

  return entries
}

const queries = {
  add:
    `mutation($orgId: String!, $policy: String!, $entries: [WhitelistEntryInput!]!) {
        addWhitelistEntries(
            organizationId:$orgId
            policyId:$policy
            whitelistEntries:$entries
      ){
        name
        version
      }
    }`,
  remove:
    `mutation($orgId: String!, $policy: String!, $entries: [WhitelistEntryInput!]!) {
        deleteWhitelistEntries(
                organizationId:$orgId
                policyId:$policy
                whitelistEntries:$entries
        ){
            name
            version
        }
    }`,
  list:
    `query($orgId: String!) {
        policies(organizationId: $orgId) {
            whitelist {
                name
                version
            }
        }
    }`,
  policy:
    `query($orgId: String!) {
        policies(organizationId: $orgId) {
          id
          name
          organizationId
          whitelist {
            name
            version
          }
        }
      }
    `,
  pkgVer:
    `query($pkgVers: [PackageVersionInput!]!) {
      packageVersions(packageVersions: $pkgVers) {
        name
        version
        published
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
    `
}

function printHelp () {
  helpHeader(
    'whitelist',
    chalk`ncm {${COLORS.yellow} whitelist} {${COLORS.teal} <option>}`,
    'ncm whitelist [option]'
  )

  L(optionsList())
  L()
}

function optionsList () {
  return chalk`
{${COLORS.light1} ncm} {${COLORS.yellow} whitelist} {${COLORS.teal} <option>}
  {${COLORS.teal} --list}                      {white List modules in a whitelist}
  {${COLORS.teal} --add <module\{@version\}>}    {white Add module to a whitelist}
  {${COLORS.teal} --remove <module\{@version\}>} {white Remove module from a whitelist}
  `.trim()
}
