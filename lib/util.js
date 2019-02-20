'use strict'

const readline = require('readline')

const url = require('url')
const pDefer = require('p-defer')
const clientRequest = require('./client-request')
const { setTokens, api, getValue, popValue } = require('./config')
const { GraphQLClient } = require('graphql-request')
const {
  formatError
} = require('../lib/ncm-style')

const E = console.error

module.exports = {
  apiRequest,
  formatAPIURL,
  graphql,
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

async function graphql (uri, query, vars) {
  let token = getValue('token')
  let data
  while (!data && token) {
    try {
      const client = new GraphQLClient(uri, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      data = await client.request(query, vars)
    } catch (error) {
      if (error.response && error.response.status === 401) {
        token = await refreshSession()
      } else {
        throw error
      }
    }
  }
  return data
}

async function apiRequest (method, uri, reqbody) {
  let token = getValue('token')
  let body
  while (!body && token) {
    try {
      const response = await clientRequest({
        method,
        uri,
        headers: {
          Authorization: `Bearer ${token}`
        },
        json: true,
        body: JSON.stringify(reqbody)
      })
      body = response.body
    } catch (error) {
      if (error.statusCode === 401) {
        token = await refreshSession()
      } else {
        throw error
      }
    }
  }
  return body
}

async function refreshSession () {
  const refreshToken = popValue('refreshToken')
  if (!refreshToken || !refreshToken.trim()) {
    return
  }

  let refreshData
  try {
    const response = await clientRequest({
      method: 'GET',
      uri: formatAPIURL('/accounts/auth/refresh'),
      json: true,
      headers: {
        Authorization: `Bearer ${refreshToken}`
      }
    })
    refreshData = response.body
  } catch (err) {
    E()
    E(formatError('Failed to refresh session.', err))
    E()
    process.exitCode = 1
    return
  }

  setTokens(refreshData)
  return refreshData.session
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
