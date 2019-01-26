'use strict'

const { graphql, handleError, formatAPIURL } = require('../lib/util')
const { helpHeader } = require('../lib/help')
const { getValue, setValue } = require('../lib/config')
const chalk = require('chalk')
const logger = require('../lib/logger')
const L = console.log

module.exports = policy

async function policy (argv) {

  const [ action ] = argv._.slice(1)

  if (argv.help) {
    printHelp()
    return
  } else if (!action) {
    printHelp()
    process.exitCode = 1
    return
  }

  let { val: policy } = getValue('policyId')

  if (policy === ' ') {
    const policyData = await getPolicy()
    if (!policyData.policies) handleError('Policy::NoPolicy')

    setValue('policyId', policyData.policies[0].id)
    setValue('policy', policyData.policies[0].name)
  }

  if (action === 'add' || action === 'del') {
    const entries = []

    argv._.slice(2).forEach(pkgVer => {
      const match = pkgVer.match(/^(.*)@(.*)$/)

      if (match !== null) {
        entries.push({ name: match[1], version: match[2] })
      } else {
        L(chalk`{rgb(255,183,38) ┌────────────────────────────${'─'.repeat(pkgVer.length)}┐}`)
        L(chalk`{rgb(255,183,38) │ !} Package not recognized: ${pkgVer} {rgb(255,183,38) │}`)
        L(chalk`{rgb(255,183,38) └────────────────────────────${'─'.repeat(pkgVer.length)}┘}`)
      }
    })

    if (entries.length === 0) {
      process.exitCode = 1
      L(chalk`{rgb(255,96,64) ┌───┬─────────────────────────────┐}`)
      L(chalk`{rgb(255,96,64) │ X │} {white Unable to modify whitelist.} {rgb(255,96,64) │}`)
      L(chalk`{rgb(255,96,64) └───┴─────────────────────────────┘}`)
      return
    }

    const data = await modifyWhitelistEntries(action, entries)

    if (!data) {
      process.exitCode = 1
      L(chalk`{rgb(255,96,64) ┌───┬─────────────────────────────┐}`)
      L(chalk`{rgb(255,96,64) │ X │} {white Unable to modify whitelist.} {rgb(255,96,64) │}`)
      L(chalk`{rgb(255,96,64) └───┴─────────────────────────────┘}`)
      return
    }

    L(chalk`{rgb(90,200,120) ┌────────────────────────────────────┐ }`)
    L(chalk`{rgb(90,200,120) │ ✓} {white Whitelist successfully modified.} {rgb(90,200,120) │ }`)
    L(chalk`{rgb(90,200,120) └────────────────────────────────────┘}`)
  }
  if (action === 'list') {
    const data = await getWhitelist()

    if (!data || !data.policies[0].whitelist) {
      process.exitCode = 1
      L(chalk`{rgb(255,96,64) ┌───┬────────────────────────────┐}`)
      L(chalk`{rgb(255,96,64) │ X │} {white Unable to fetch whitelist.} {rgb(255,96,64) │}`)
      L(chalk`{rgb(255,96,64) └───┴────────────────────────────┘}`)
      return
    }

    try {
      /* pass-off to reports */
      logger([{ text: JSON.stringify(data, null, 2), style: [] }])
    } catch (e) {
      handleError(e)
    }
    L()
  }
  if (!action) {
    printHelp()
  }
}

async function modifyWhitelistEntries (action, entries) {
  let { val: token } = getValue('token')
  let { val: org } = getValue('orgId')
  let { val: policy } = getValue('policyId')

  if (!token || token === ' ') {
    handleError('Policy::NoToken')
    return
  }

  if (!org || org === ' ') {
    handleError('Policy::NoOrg')
    return
  }

  if (!policy || policy === ' ') {
    handleError('Policy::PolicyNotSet')
    return
  }

  if (!entries || entries.length === 0) {
    handleError('Policy::NoValidEntries')
    return
  }

  let options = {
    token: token,
    url: formatAPIURL('/ncm2/api/v2/graphql')
  }

  let query = queries[action]
  let vars = { policy, org, entries }

  return graphql(options, query, vars)
    .catch(catchErrors)
}

async function getWhitelist () {
  let { val: token } = getValue('token')
  let { val: org } = getValue('orgId')

  if (!token) {
    handleError('Policy::NoToken')
    return
  }
  if (!org) {
    handleError('Policy::NoOrg')
    return
  }

  let options = {
    token: token,
    url: formatAPIURL('/ncm2/api/v2/graphql')
  }

  let query = queries['whitelist']
  let vars = { org }

  return graphql(options, query, vars)
    .catch(catchErrors)
}

async function getPolicy () {
  let { val: token } = getValue('token')
  let { val: org } = getValue('orgId')

  if (!token) {
    handleError('Policy::NoToken')
    return
  }

  let options = {
    token: token,
    url: formatAPIURL('/ncm2/api/v2/graphql')
  }

  let query = queries['policy']
  let vars = { org }

  return graphql(options, query, vars)
    .catch(catchErrors)
}

function catchErrors (err) {
  if (err.response && err.response.code) {
    handleError(err.response.code)
  } else {
    handleError(err)
  }
}

const queries = {
  add:
    `mutation($org: String!, $policy: String!, $entries: [WhitelistEntryInput!]!) {
        addWhitelistEntries(
            organizationId:$org
            policyId:$policy
            whitelistEntries:$entries
      ){
        name
        version
      }
    }`,
  del:
    `mutation($org: String!, $policy: String!, $entries: [WhitelistEntryInput!]!) {
        deleteWhitelistEntries(
                organizationId:$org
                policyId:$policy
                whitelistEntries:$entries
        ){
            name
            version
        }
    }`,
  whitelist:
    `query($org: String!) {
        policies(organizationId: $org) {
            whitelist {
                name
                version
            }
        }
    }`,
  policy:
    `query($org: String!) {
        policies(organizationId: $org) {
          id
          name
          organizationId
          whitelist {
            name
            version
          }
        }
      }
    `
}

function printHelp () {
  helpHeader()

  logger([{ text: 'ncm-cli whitelist', style: ['bold'] }])
  logger([{ text: `ncm-cli whitelist list`, style: [] }])
  logger([{ text: `ncm-cli whitelist add <pkg-name>@<ver>`, style: [] }])
  logger([{ text: `ncm-cli whitelist del <pkg-name>@<ver>`, style: [] }])
  logger()
}
