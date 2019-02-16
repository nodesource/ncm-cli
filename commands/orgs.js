'use strict'

module.exports = orgs
module.exports.orgsCli = orgsCli

const clientRequest = require('../lib/client-request')
const { formatAPIURL, queryReadline } = require('../lib/util')
const { helpHeader } = require('../lib/help')
const { setValue, getValue, getTokens } = require('../lib/config')
const {
  COLORS,
  header,
  line,
  box,
  formatError
} = require('../lib/ncm-style')
const chalk = require('chalk')
const L = console.log
const E = console.error
// TODO: Remove when refactoring Help
const logger = require('../lib/logger')

async function orgs (argv, org) {
  if (argv.help) {
    printHelp()
    return
  }

  L()
  L(header('Select your NodeSource organization'))

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
    E()
    E(formatError('Failed to fetch user info.'))
    E()
    return
  }

  await orgsCli(session, details, org)
}

async function orgsCli (session, details, org) {
  const orgs = [ 'personal' ]
  for (let orgId in details.orgs) {
    orgs.push(details.orgs[orgId].name)
  }

  const currentOrg = getValue('org').val

  if (typeof org !== 'string') {
    if (orgs.length === 1) {
      org = orgs[0]
    } else {
      L(box('!', 'Multiple organizations', COLORS.yellow))
    }
  }

  let hasOrg = orgs.includes(org)
  while (typeof org !== 'string' || !hasOrg) {
    L(line('|➔', 'Choose an organization to continue with:', COLORS.yellow))
    L()
    orgs.forEach((orgName, index) => {
      if (orgName === currentOrg) {
        L(chalk`{bold {${COLORS.green} ${index}) ${orgName}}}`)
      } else {
        L(`${index}) ${orgName}`)
      }
    })
    L()

    org = (await queryReadline(chalk`{${COLORS.light1} > }`)).trim()

    if (org === '') org = currentOrg

    // Index selection.
    if (orgs[org]) {
      org = orgs[org]
    }
    // Verifies that the user's choice is valid.
    hasOrg = orgs.includes(org)
    if (!hasOrg) {
      E()
      E(formatError('Unrecognized organization'))
    }
  }

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
      E()
      E(formatError('Org setting failed. Please contact support.'))
      E()
      process.exitCode = 1
      return
    }
  }

  L()
  L(line('✓', `You're using ncm with the ${org} settings.`, COLORS.green))
  L()
}

function printHelp () {
  helpHeader()

  logger([{ text: 'ncm-cli orgs [<org name>]', style: ['bold'] }])
  logger()
}
