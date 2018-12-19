'use strict'

// client-request/promise with additions, such as retry support.

const clientRequestP = require('client-request/promise')
const util = require('util')

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

  do {
    var { response, body } = await DoRequest(options)

    // Only attempt to follow redirects if we allow retries.
    // Restrict redirect chains via the retry limit.
    if (REDIRECT_CODES.includes(response.statusCode)) {
      options.uri = response.location
    }
  } while (retries-- > 0 && RETRY_CODES.includes(response.statusCode))

  // Any non- 200-series code
  if (response.statusCode < 200 || response.statusCode >= 300) {
    response.destroy()

    let error
    if (body && !options.stream) {
      body = util.inspect(body)
      if (body.length > 30) {
        body = `${body.substr(0, 30)}...`
      }
      error = new Error(`${response.statusCode} ${options.method} ${options.uri} - '${body}'`)
    } else {
      error = new Error(`${response.statusCode} ${options.method} ${options.uri}`)
    }

    error.statusCode = response.statusCode
    throw error
  }

  return { response, body }
}

async function DoRequest (options) {
  let result
  try {
    result = await clientRequestP(options)
  } catch (err) {
    result = err
    if (!result.response) {
      throw err
    }
  }

  return result
}
