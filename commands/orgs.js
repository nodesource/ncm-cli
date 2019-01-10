'use strict'

module.exports = orgs

const clientRequest = require('../lib/client-request')
const { formatAPIURL, handleError, queryReadline } = require('../lib/util')
const { helpHeader } = require('../lib/help')
const { setValue, getTokens } = require('../lib/config')
const logger = require('../lib/logger')

async function orgs (argv) {
  if (argv.help) {
    printHelp()
    return
  }

  let { session } = getTokens()

  let details
  try {
    const { body } = await clientRequest({
      method: 'GET',
      uri: formatAPIURL('/accounts/user/details'),
      json: true,
      headers: {
        Authorization: `Bearer ${session}`
      }
    })
    details = body
  } catch (err) {
    handleError('Signin::FetchUserDetails')
    return
  }

  const orgs = [ 'personal' ]
  for (let orgId in details.orgs) {
    orgs.push(details.orgs[orgId].name)
  }

  let { org } = argv
  if (typeof org !== 'string') {
    // user has not provided an org, prompt them via readline

    let hasOrg = false
    while (!hasOrg) {
      logger([ { text: 'Please select an organization to set as active:', style: [] } ])
      logger([ { text: orgs.join(' '), style: [] } ])

      org = (await queryReadline('')).trim()

      // verifies that the user's choice is valid once
      hasOrg = orgs.includes(org)
      if (!hasOrg) {
        logger([ { text: 'Choice was not recognized, try again:', style: ['red'] } ])
        logger()
      }
    }

    logger([ { text: `Do you wish to set org: ${org} as active? (Y/n)`, style: [] } ])

    const confirm = (await queryReadline('')).trim().toLowerCase()

    if (confirm !== 'y' || confirm !== 'yes' || confirm !== '' /* default */) {
      // prepare nonzero exit if choice isn't confirmed
      process.exitCode = 1
      return
    }
  }

  // user has provided an org choice, we need to verify it now

  if (org === 'personal') {
    setValue('org', 'personal')
    setValue('orgId', '1')
  } else {
    let match
    for (const orgId in details.orgs) {
      if (orgId === org || details.orgs[orgId].name === org) {
        setValue('org', details.orgs[orgId].name)
        setValue('orgId', orgId)
        match = true
        break
      }
    }

    if (!match) {
      process.exitCode = 1
    }
  }
}

function printHelp () {
  helpHeader()

  logger([{ text: 'ncm-cli orgs [<org name>]', style: ['bold'] }])
  logger()
}
