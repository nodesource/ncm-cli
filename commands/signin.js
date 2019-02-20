'use strict'

const {
  apiRequest,
  formatAPIURL,
  queryReadline,
  queryReadlineHidden
} = require('../lib/util')
const { setTokens } = require('../lib/config')
const { orgsCli } = require('./orgs')
const { helpHeader } = require('../lib/help')
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

module.exports = signin
module.exports.optionsList = optionsList

async function signin (argv, email, password) {
  if (argv.help) {
    printHelp()
    return
  }

  const SSO =
        (argv.google ? 'google' : null) ||
        (argv.github ? 'github' : null) ||
        null

  let headerMessage = 'Sign into NodeSource'
  if (SSO) {
    headerMessage += ' with ' + SSO[0].toUpperCase() + SSO.slice(1)
  }

  L()
  L(header(headerMessage))
  L()

  let authData

  // TODO: Token Auth

  if (SSO) {
    try {
      const { url, nonce } = await apiRequest(
        'GET',
        formatAPIURL('/accounts/auth/social-signin-url', { source: SSO })
      )

      L(line('|➔', 'Open the following very ugly URL:', COLORS.yellow))
      L()
      L(chalk`{${COLORS.blue} ${url}}`)

      authData = await apiRequest(
        'GET',
        formatAPIURL('/accounts/auth/retrieve-session', { nonce })
      )
    } catch (err) {
      E()
      E(formatError('Failed SSO Authentication.', err))
      E()
      process.exitCode = 1
      return
    }
  } else {
    while (!authData) {
      let email
      let password

      L(line('|➔', 'Enter your NodeSource credentials:', COLORS.yellow))
      L()

      L(line('?', 'Email:', COLORS.red))
      email = (await queryReadline(chalk`{${COLORS.light1} > }`)).trim()
      L()
      L(line('?', 'Password:', COLORS.red))
      password = (await queryReadlineHidden(chalk`{${COLORS.light1} > }`)).trim()

      const usrInfo = JSON.stringify({ email, password })

      try {
        authData = await apiRequest(
          'POST',
          formatAPIURL('/accounts/auth/login'),
          usrInfo
        )
      } catch (err) {
        E()
        E(formatError('Failed Authentication.', err))
        E()
      }
    }
  }

  if (!authData.session || !authData.refreshToken) {
    E()
    E(formatError('Bad auth data.', authData))
    E()
    process.exitCode = 1
    return
  }

  setTokens(authData)

  L()
  L(chalk`{${COLORS.light1} Authenticating...}`)

  let details
  try {
    details = await apiRequest(
      'GET',
      formatAPIURL('/accounts/user/details')
    )
  } catch (err) {
    E()
    E(formatError('Failed to fetch user info.', err))
    E()
    process.exitCode = 1
    return
  }

  L(box('✓', 'Signed in successfully', COLORS.green))

  await orgsCli(details)
}

function printHelp () {
  helpHeader(
    'signin',
    chalk`ncm {${COLORS.yellow} signin} {${COLORS.teal} [options]}`,
    'ncm signin [options]'
  )

  L(optionsList())
  L()
}

function optionsList () {
  return chalk`
{${COLORS.light1} ncm} {${COLORS.yellow} signin} {italic (interactive)}
  {${COLORS.teal} -g, --github} {white Sign in via GitHub account}
  {${COLORS.teal} -G, --google} {white Sign in via Google account}
  `.trim()
}
