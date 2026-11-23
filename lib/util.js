'use strict'

const readline = require('readline')

const url = require('url')
const pDefer = require('p-defer')
const clientRequest = require('./client-request')
const { setTokens, api, ncmApi, getTokens, popValue } = require('./config')
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
  refreshSession,
  reversedSplit
}

function formatAPIURL (pathname, query) {
  return api + url.format({
    pathname,
    query
  })
}

async function graphql (uri, query, variables, options) {
  const updatedUri = uri.replace('api.nodesource', 'api.ncm.nodesource')
  const body = await apiRequest(
    'POST',
    updatedUri,
    { query, variables },
    options
  )
  return body.data
}

// `publicRead`: the call needs no credentials, as scoring packages doesn't.
// If the NCM API refuses the token with a 401, it is sent once more without
// one, instead of asking accounts-api for a new session: the call never
// depends on accounts-api, which is shutting down (nodesource/ncm2-api#308).
async function apiRequest (method, uri, reqbody, { publicRead = false } = {}) {
  let { token } = getTokens()
  let body
  while (!body && token) {
    try {
      body = await send(method, uri, reqbody, token)
    } catch (error) {
      if (error.statusCode !== 401) throw error
      if (publicRead) return send(method, uri, reqbody)
      token = await refreshSession()
    }
  }
  return body
}

async function send (method, uri, reqbody, token) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`
  const response = await clientRequest({
    method,
    uri,
    headers,
    json: true,
    body: JSON.stringify(reqbody)
  })
  return response.body
}

async function refreshSession () {
  // Just short-circut this if the token was provided via env...
  if (process.env.NCM_TOKEN) return process.env.NCM_TOKEN

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
    let newStr = ''
    // Do not interfere with a prompt.
    if (this._prompt && stringToWrite.startsWith(this._prompt)) {
      stringToWrite = stringToWrite.substring(this._prompt.length)
      newStr += this._prompt
    }
    // Iterate and reconstruct word characters (including spaces) to hide.
    for (let char of stringToWrite) {
      if (/^[\S ]+$/.test(char)) {
        char = '*'
      }
      newStr += char
    }
    stringToWrite = newStr

    _writeToOutput(stringToWrite)
  }

  return deferred.promise
}

// To be able to replicate regex lookbehinds in Node 8.
function reversedSplit (str, split) {
  return reverseStr(str).split(split).map(reverseStr).reverse()
}

function reverseStr (str) {
  return str.split('').reverse().join('')
}
