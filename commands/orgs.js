'use strict'

module.exports = orgs

const clientRequest = require('../lib/client-request')
const { formatAPIURL, handleError, queryReadline } = require('../lib/util')
const { displayHelp } = require('../lib/help')
const { setValue, getTokens } = require('../lib/config')
const logger = require('../lib/logger')

function orgs (argv) {
  const help = argv.help || argv._[1] === 'help'

  if (help) {
    displayHelp('help')
    return true
  }

  doOrgs(argv)

  return true
}

async function doOrgs (argv) {
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

  if (typeof argv.org === 'string') {
    // user has provided an org choice, we need to verify it now

    if (argv.org === 'personal') {
      setValue('org', 'personal')
      setValue('orgId', '1')
    } else {
      let match
      for (let org in details.orgs) {
        if (org === argv.org || details.orgs[org].name === argv.org) {
          setValue('org', details.orgs[org].name)
          setValue('orgId', org)
          match = true
          break
        }
      }

      if (!match) {
        process.exitCode = 1
      }
    }
  } else {
    // user has not provided an org, prompt them via readline

    const orgs = [ 'personal' ]
    for (let org in details.orgs) {
      orgs.push(details.orgs[org].name)
    }

    logger([ { text: 'Please select an organization to set as active:', style: [] } ])
    logger([ { text: orgs.join(' '), style: [] } ])

    let result1 = await queryReadline('')
    let choice = result1.trim().toLowerCase()

    // verifies that the user's choice is valid once
    if (!orgs.includes(choice)) {
      logger([ { text: 'Choice was not recognized, try again:', style: [] } ])
      logger()
      logger([ { text: 'Please select an organization to set as active:', style: [] } ])
      logger([ { text: orgs.join(' '), style: [] } ])

      result1 = await queryReadline('')
      choice = result1.trim().toLowerCase()
      process.exitCode = 1 // prepare nonzero exit if choice isn't verified
    }

    logger([ { text: `Do you wish to set org:${choice} as active? (Y/n)`, style: [] } ])

    let result2 = await queryReadline('')
    let confirm = result2.trim().toLowerCase()

    if (confirm === 'y' || confirm === 'yes' || confirm === '' /* default */) {
      if (choice === 'personal') {
        setValue('org', 'personal')
        setValue('orgId', '1')
        process.exitCode = 0
      } else {
        for (let org in details.orgs) {
          if (org === choice || details.orgs[org].name === choice) {
            setValue('org', details.orgs[org].name)
            setValue('orgId', org)
            process.exitCode = 0
            break
          }
        }
      }
    }
  }
}
