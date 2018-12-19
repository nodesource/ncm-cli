'use strict'

const clientRequest = require('../lib/client-request')
const { formatAPIURL, handleError, queryReadline } = require('../lib/util')
const { displayHelp } = require('../lib/help')
const { setValue, getTokens, setTokens } = require('../lib/config')
const logger = require('../lib/logger')

module.exports = signin

function signin (argv) {
  let help = (argv['_'] && argv['_'][1] === 'help') || argv.help

  if (help) {
    displayHelp('signin')
    return true
  }

  // todo: deturd
  const args = argv['_'] || []

  const SSO =
        (argv['G'] ? 'google' : null) ||
        (argv['g'] ? 'github' : null) ||
        null

  const [ email, password ] = args
  const basicAuth = args && email && password && args.length === 3

  if (SSO || basicAuth) {
    doSignin(SSO, basicAuth, email, password)
  }

  return Boolean(SSO || basicAuth)
}

async function doSignin (SSO, basicAuth, email, password) {
  let authData
  if (basicAuth) {
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
      handleError('Signin::UnableToRetrieveSession')
      return
    }
  } else if (SSO) {
    try {
      const { body: b1 } = await clientRequest({
        method: 'GET',
        uri: formatAPIURL('/accounts/auth/social-signin-url', { source: SSO }),
        json: true
      })
      const { url, nonce } = b1

      logger([{ text: 'NCM-CLI:', style: 'ncm' }])
      logger([{ text: 'Please open the following URL in your browser: ', style: 'main' }])
      logger()
      logger([{ text: url, style: 'main' }])
      logger()

      const { body: b2 } = await clientRequest({
        method: 'GET',
        uri: formatAPIURL('/accounts/auth/retrieve-session', { nonce }),
        json: true
      })
      authData = b2
    } catch (err) {
      console.error(err)
      handleError('Signin::RetrieveSession')
      return
    }
  }

  if (!authData['session'] || !authData['refreshToken']) {
    handleError('Signin::InvalidLoginCredentials')
    return
  }

  setTokens(authData)
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

  let orgs = details.orgs ? Object.keys(details.orgs) : null // array of orgs
  let hasOrgs = orgs.length > 0

  // only supports api v1, currently
  if (hasOrgs) {
    let orgId = orgs[0]
    let org = details.orgs[orgId].name

    logger([
      { text: 'You belong to the organization: ', style: [] },
      { text: org, style: 'success' }
    ])
    logger([
      { text: 'Would you like to use the organiztion policy set? (Y/n)', style: [] }
    ])

    const result = await queryReadline('')
    const choice = result.trim().toLowerCase()

    if (choice === 'n' || choice === 'no') {
      setValue('org', 'default')
      setValue('orgId', '1')
    } else if (choice === 'y' || choice === 'yes' || choice === '' /* default */) {
      setValue('org', org)
      setValue('orgId', orgId)
    }
  } else {
    // User does not belong to any organizations.
    // Set orgId and policyId to personal configuration.
    setValue('org', 'default')
    setValue('orgId', '1')
    setValue('policy', 'personal')
    setValue('policyId', 'default')

    handleError('Signin::NoOrgs')
  }

  logger([{ text: 'Login Successful', style: 'success' }])
  logger()
}
