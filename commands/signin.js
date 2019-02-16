'use strict'

const clientRequest = require('../lib/client-request')
const {
  formatAPIURL,
  queryReadline,
  queryReadlineHidden
} = require('../lib/util')
const { getTokens, setTokens } = require('../lib/config')
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
// TODO: Remove when refactoring Help
const logger = require('../lib/logger')

module.exports = signin

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
      const { body: b1 } = await clientRequest({
        method: 'GET',
        uri: formatAPIURL('/accounts/auth/social-signin-url', { source: SSO }),
        json: true
      })
      const { url, nonce } = b1

      L(line('|➔', 'Open the following very ugly URL:', COLORS.yellow))
      L()
      L(chalk`{${COLORS.blue} ${url}}`)

      const { body: b2 } = await clientRequest({
        method: 'GET',
        uri: formatAPIURL('/accounts/auth/retrieve-session', { nonce }),
        json: true
      })
      authData = b2
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
        const { body } = await clientRequest({
          method: 'POST',
          uri: formatAPIURL('/accounts/auth/login'),
          json: true,
          body: usrInfo
        })
        authData = body
      } catch (err) {
        E()
        E(formatError('Failed Authentication.', err))
        E()
      }
    }
  }

  if (!authData['session'] || !authData['refreshToken']) {
    E()
    E(formatError('Bad auth data.', authData))
    E()
    process.exitCode = 1
    return
  }

  setTokens(authData)
  let { session } = getTokens()

  L()
  L(chalk`{${COLORS.light1} Authenticating...}`)

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
    E(formatError('Failed to fetch user info.', err))
    E()
    process.exitCode = 1
    return
  }

  L(box('✓', 'Signed in successfully', COLORS.green))

  await orgsCli(session, details)
}

function printHelp () {
  helpHeader()

  logger([{ text: 'ncm-cli signin', style: ['bold'] }])
  logger([{ text: `ncm-cli signin [options]`, style: [] }])
  logger()

  logger([{ text: 'signin Options:', style: ['bold'] }])
  logger([{ text: `--help`, style: [] }])
  logger([{ text: `--google, -G`, style: [] }])
  logger([{ text: `--github, -g`, style: [] }])
  logger()
}
