'use strict'

const { graphql, handleError } = require('../lib/util')
const { displayHelp } = require('../lib/help')
const { getValue, setValue, api } = require('../lib/config')
const logger = require('../lib/logger')

module.exports = policy

function policy (argv) {
  const help = argv.help || argv._[1] === 'help'

  if (help) {
    displayHelp('policy')
    return true
  }

  doPolicy(argv)

  return true
}

async function doPolicy (argv) {
  let { val: policy } = getValue('policyId')

  if (policy === ' ') {
    const policyData = await getPolicy()
    if (!policyData.policies) handleError('Policy::NoPolicy')

    setValue('policyId', policyData.policies[0].id)
    setValue('policy', policyData.policies[0].name)
  }

  const [ action, subaction ] = argv._.slice(1)

  if (action === 'whitelist') {
    if (subaction === 'add' || subaction === 'del') {
      const entries = []

      argv._.slice(2).forEach((pkg, ind) => {
        if (pkg.includes('@')) {
          const [ name, version ] = pkg.split('@')
          entries.push({ name, version })
        } else {
          logger([
            { text: 'Unable to determine package: ', style: [] },
            { text: `${pkg}`, style: 'error' }
          ])
        }
      })

      const data = await modifyWhitelistEntries(subaction, entries)
      console.log(data)
    } else if (!subaction) {
      const data = await getWhitelist()
      console.log(data.policies[0].whitelist)
    } else {
      displayHelp('policy')
    }
  } else {
    displayHelp('policy')
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
    url: `https://${api}/ncm2/api/v1`
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
    url: `https://${api}/ncm2/api/v1`
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
    url: `https://${api}/ncm2/api/v1`
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
    `mutation($org: String!, $policy: String!, $entries: [WhitelistEntryInput]!) {
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
    `mutation($org: String!, $policy: String!, $entries: [WhitelistEntryInput]!) {
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
