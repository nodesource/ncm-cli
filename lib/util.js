'use strict'

const readline = require('readline')

const url = require('url')
const pDefer = require('p-defer')
const clientRequest = require('./client-request')
const { getTokens, setTokens, api } = require('./config')
const logger = require('./logger')
const { GraphQLClient } = require('graphql-request')
const {
  formatError
} = require('../lib/ncm-style')

const E = console.error

module.exports = {
  formatAPIURL,
  graphql,
  handleError,
  queryReadline,
  queryReadlineHidden,
  refreshSession
}

function formatAPIURL (pathname, query) {
  return url.format({
    protocol: 'https',
    hostname: api,
    pathname,
    query
  })
}

function graphql (options, query, vars) {
  if (typeof options === 'string') {
    options = { options }
  }

  const client = new GraphQLClient(options.url, {
    headers: {
      Authorization: `Bearer ${options.token}`
    }
  })

  return client.request(query, vars)
}

async function refreshSession () {
  let { refreshToken } = getTokens()

  let refreshData
  try {
    const { body } = await clientRequest({
      method: 'GET',
      uri: formatAPIURL('/accounts/auth/refresh'),
      json: true,
      headers: {
        Authorization: `Bearer ${refreshToken}`
      }
    })
    refreshData = body
  } catch (err) {
    E(formatError('Failed to refresh session.', err))
    E()
    process.exitCode = 1
    return
  }

  setTokens(refreshData)
}

function queryReadline (query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  const deferred = pDefer()
  rl.question(query, answer => {
    deferred.resolve(answer)
    rl.close()
  })

  return deferred.promise
}

// For passwords
function queryReadlineHidden (query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  const deferred = pDefer()
  rl.question(query, answer => {
    deferred.resolve(answer)
    rl.close()
  })

  // This is an unpleasant hack.
  // This functionality belongs in Node core.
  const _writeToOutput = rl._writeToOutput.bind(rl)
  rl._writeToOutput = function _writeHiddenToOutput (stringToWrite) {
    // XXX(Jeremiah): Ideally ignore any escape character
    _writeToOutput('*')
  }

  return deferred.promise
}

function handleError (err) {
  switch (err) {
    case 'Config::NoAction':
      logger([{ text: `Not a valid action.`, style: 'error' }])
      logger()
      break
    case 'Config::SetInvalidField':
      logger([{ text: `Could not set value.`, style: 'error' }])
      logger()
      break
    case 'Config::GetInvalidField':
      logger([{ text: `Could not get value.`, style: 'error' }])
      logger()
      break
    case 'Config::DelInvalidField':
      logger([{ text: `Could not delete value.`, style: 'error' }])
      logger()
      break
    case '':
      break
    default:
      logger([{ text: err, style: 'error' }])
      break
  }
}
