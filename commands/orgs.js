'use strict'

const {
  apiRequest,
  formatAPIURL,
  queryReadline
} = require('../lib/util')
const { helpHeader } = require('../lib/help')
const { setValue, getValue } = require('../lib/config')
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

module.exports = orgs
module.exports.orgsCli = orgsCli
module.exports.optionsList = optionsList

async function orgs (argv, org) {
  if (argv.help) {
    printHelp()
    return
  }

  L()
  L(header('Select your NodeSource organization'))

  let details
  try {
    details = await apiRequest(
      'GET',
      formatAPIURL('/accounts/user/details')
    )
  } catch (err) {
    E()
    E(formatError('Failed to fetch user info.'))
    E()
    return
  }

  await orgsCli(details, org)
}

async function orgsCli (details, org) {
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
  helpHeader(
    'orgs',
    chalk`ncm {${COLORS.yellow} orgs} {${COLORS.teal} [<orgname>] [options]}`,
    'ncm orgs [<orgname>] [options]'
  )

  L(optionsList())
  L()
}

function optionsList () {
  return chalk`
{${COLORS.light1} ncm} {${COLORS.yellow} orgs} {italic (interactive)}
{${COLORS.light1} ncm} {${COLORS.yellow} orgs} {${COLORS.teal} <orgname>}
  `.trim()
}
