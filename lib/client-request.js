'use strict'

// client-request/promise with additions, such as retry & proxy support.

const clientRequestP = require('client-request/promise')
const util = require('util')

// http(s) proxy support
const { getProxyForUrl } = require('proxy-from-env')
const ProxyAgent = require('proxy-agent')

const REDIRECT_CODES = [ // List of acceptible 300-series redirect codes.
  301, 302, 303, 307, 308
]
const RETRY_CODES = [ // List of codes which are acceptible to retry on.
  408, 500, 502, 503, 504
]
const DEFAULT_RETRY_LIMIT = 3

module.exports = ClientRequestExtended

async function ClientRequestExtended (options) {
  options = Object.assign({}, options)
  let retries = options.retries || DEFAULT_RETRY_LIMIT

  const proxyUri = getProxyForUrl(options.uri)
  if (proxyUri) {
    options.agent = new ProxyAgent(proxyUri)
  }

  let responseRef, bodyRef, timeoutRef
  do {
    const { response, body, timeout } = await DoRequest(options)
    responseRef = response
    bodyRef = body
    timeoutRef = timeout

    if (timeout) {
      // The do-while() will still decrease the retry count.
      continue
    }

    // Only attempt to follow redirects if we allow retries.
    // Restrict redirect chains via the retry limit.
    if (REDIRECT_CODES.includes(response.statusCode)) {
      options.uri = response.location
    }
  } while (retries-- > 0 && (timeoutRef || RETRY_CODES.includes(responseRef.statusCode)))

  // If we still timed out, we want to bail out.
  if (timeoutRef) {
    // Timeout always gets set to the upstream timeout error if there was one.
    throw timeoutRef
  }

  // Any non- 200-series code
  if (!options.opted && (responseRef.statusCode < 200 || responseRef.statusCode >= 300)) {
    responseRef.destroy()

    let error
    if (bodyRef && !options.stream) {
      bodyRef = util.inspect(bodyRef)
      if (bodyRef.length > 30) {
        bodyRef = `${bodyRef.substr(0, 30)}...`
      }
      error = new Error(`${responseRef.statusCode} ${options.method} ${options.uri} - '${bodyRef}'`)
    } else {
      error = new Error(`${responseRef.statusCode} ${options.method} ${options.uri}`)
    }

    error.statusCode = responseRef.statusCode
    throw error
  }

  return { response: responseRef, body: bodyRef }
}

async function DoRequest (options) {
  let result
  try {
    result = await clientRequestP(options)
  } catch (err) {
    result = err
    if (!result.response) {
      // Less than ideal
      // See https://github.com/brycebaril/client-request/issues/14
      if (typeof err.message === 'string' &&
          err.message.toLowerCase().includes('timeout')) {
        return { timeout: err }
      } else {
        throw err
      }
    }
  }

  return result
}
