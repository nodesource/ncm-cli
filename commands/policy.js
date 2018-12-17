'use strict'

const { graphql, handleError, displayHelp } = require('../lib/tools')
const { getValue, setValue, api } = require('../lib/config')
const logger = require('../lib/logger')

module.exports = policy

function policy (argv) {
  let help = (argv['_'] && argv['_'][1] === 'help') || argv.help

  if (help) {
    displayHelp('policy')
    return true
  }

  const cmd = (argv) => {
    let action = (argv['_'][1] ? argv['_'][1].toLowerCase() : null)

    let subaction = (argv['_'][2] ? argv['_'][2].toLowerCase() : null)

    switch (action) {
      case 'whitelist':
        switch (subaction) {
          case null:
            getWhitelist()
            break
          case 'add':
            modifyWhitelistEntries(subaction, parseEntries(argv))
            break
          case 'del':
            modifyWhitelistEntries(subaction, parseEntries(argv))
            break
          default:
            displayHelp('policy')
            break
        }
        break
      default:
        displayHelp('policy')
        break
    }
  }

  let { val: policy } = getValue('policyId')

  if (policy === ' ') {
    getPolicy(setPolicy)
      .then(() => cmd(argv))
  } else {
    cmd(argv)
  }

  return true
}

const modifyWhitelistEntries = async (action, entries) => {
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

  await graphql(options, query, vars)
    .then(madeModifications)
    .catch(catchErrors)
}

const getWhitelist = async () => {
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

  await graphql(options, query, vars)
    .then(gotWhitelist)
    .catch(catchErrors)
}

const getPolicy = async (fn) => {
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

  await graphql(options, query, vars)
    .then(fn)
    .catch(catchErrors)
}

const parseEntries = (argv) => {
  let entries = []

  argv['_'].forEach((pkg, ind) => {
    if (ind > 2 && pkg.includes('@')) {
      entries.push({ name: pkg.split('@')[0], version: pkg.split('@')[1] })
    } else if (ind > 2) {
      logger([{ text: 'Unable to determine package: ', style: [] }, { text: `${pkg}`, style: 'error' }])
    }
  })

  return entries
}

const gotWhitelist = (data) => {
  console.log(data.policies[0].whitelist)
}

const setPolicy = (data) => {
  if (!data.policies) handleError('Policy::NoPolicy')

  let policyId = data.policies[0].id
  let policyName = data.policies[0].name

  setValue('policyId', policyId)
  setValue('policy', policyName)
}

const madeModifications = (data) => {
  console.log(data)
}

const catchErrors = (err) => {
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
