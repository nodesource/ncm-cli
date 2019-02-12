'use strict'

const { formatAPIURL, refreshSession } = require('../lib/util')
const { helpHeader } = require('../lib/help')
const { getValue, setValue } = require('../lib/config')
const whitelistReport = require('../lib/report/whitelist')
const { reportFailMsg, reportSuccessMsg, SEVERITY_RMAP } = require('../lib/report/util')
const clientRequest = require('../lib/client-request')
const logger = require('../lib/logger')
const {
  red,
  formatError,
  line,
  header
} = require('../lib/ncm-style')

const L = console.log
const E = console.error

const semver = require('semver')

module.exports = whitelist

async function whitelist (argv) {
  if (argv.help) {
    printHelp()
    return
  }

  let { val: policy } = getValue('policyId')
  let { val: token } = getValue('token')
  let { val: orgId } = getValue('orgId')
  let { val: orgName } = getValue('org')

  L()
  L(header(`${orgName} Whitelisted Modules`))
  L()

  let policyData
  try {
    let requestBody = JSON.stringify({
      query: queries.policy,
      variables: { orgId }
    })
    const { body } = await clientRequest({
      method: 'POST',
      uri: formatAPIURL(`/ncm2/api/v2/graphql`),
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      json: true,
      body: requestBody
    })
    policyData = body.data.policies[0]
  } catch (error) {
    if (error.statusCode === 401) {
      /* unauthorized -- refresh session */
      L(line('!', 'Your session has expired.', red))
      await refreshSession()
      // TODO(mster): retry
    } else {
      E()
      E(formatError('Unable to fetch data.', error))
      E()
    }
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
      L()
      reportFailMsg(`Unable to ${add ? 'add' : 'remove'} invalid package(s) from the whitelist.`)
      L()
      process.exitCode = 1
      return
    }

    try {
      let requestBody = JSON.stringify({
        query: queries[add ? 'add' : 'remove'],
        variables: { policy, orgId, entries }
      })
      await clientRequest({
        method: 'POST',
        uri: formatAPIURL(`/ncm2/api/v2/graphql`),
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        json: true,
        body: requestBody
      })
    } catch (error) {
      if (error.statusCode === 401) {
        /* unauthorized -- refresh session */
        L(line('!', 'Your session has expired.', red))
        await refreshSession()
        // TODO(mster): retry
      } else {
        E()
        E(formatError('Unable to fetch data.', error))
        E()
      }
      process.exitCode = 1
      return
    }

    reportSuccessMsg(`Package(s) ${add ? 'added' : 'removed'} successfully.`)
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
      let requestBody = JSON.stringify({
        query: queries.list,
        variables: { orgId }
      })
      const { body } = await clientRequest({
        method: 'POST',
        uri: formatAPIURL(`/ncm2/api/v2/graphql`),
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        json: true,
        body: requestBody
      })
      whitelistData = body.data.policies[0]
    } catch (error) {
      if (error.statusCode === 401) {
        /* unauthorized -- refresh session */
        L(line('!', 'Your session has expired.', red))
        await refreshSession()
        // TODO(mster): retry
      } else {
        E()
        E(formatError('Unable to fetch data.', error))
        E()
      }
      process.exitCode = 1
      return
    }

    let pkgData
    try {
      let requestBody = JSON.stringify({
        query: queries.pkgVer,
        variables: { pkgVers: whitelistData.whitelist }
      })
      const { body } = await clientRequest({
        method: 'POST',
        uri: formatAPIURL(`/ncm2/api/v2/graphql`),
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        json: true,
        body: requestBody
      })
      pkgData = body.data
    } catch (error) {
      if (error.statusCode === 401) {
        /* unauthorized -- refresh session */
        L(line('!', 'Your session has expired.', red))
        await refreshSession()
        // TODO(mster): retry
      } else {
        E()
        E(formatError('Unable to fetch data.', error))
        E()
      }
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
  helpHeader()

  logger([{ text: 'ncm-cli policy', style: ['bold'] }])
  logger([{ text: `ncm-cli policy whitelist`, style: [] }])
  logger([{ text: `ncm-cli policy whitelist add <pkg-name>@<ver>`, style: [] }])
  logger([{ text: `ncm-cli policy whitelist del <pkg-name>@<ver>`, style: [] }])
  logger()
}
