'use strict'

const readline = require('readline')
const https = require('https')

const { getTokens, api } = require('./config')
const logger = require('./logger')
const { GraphQLClient } = require('graphql-request')

module.exports = {
  makeRequest,
  graphql,
  handleError,
  handleReadline,
  refreshSession
}

function makeRequest (options, fn) {
  const { headers } = options || { 'Content-Type': 'application/json' }
  const reqOptions = Object.assign({}, options, { json: true, headers })

  var data = ''

  let req = https.request(reqOptions, (res) => {
    res
      .on('data', (chunk) => { data += chunk })
      .on('end', () => {
        try { fn(null, JSON.parse(data)) } catch (err) { fn(err) }
      })
  })

  if (reqOptions.method === 'POST') req.write(reqOptions.body)

  req
    .on('error', (err) => {
      fn(err)
    })
    .end()
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

function refreshSession () {
  let { refreshToken } = getTokens()

  const options = {
    method: 'GET',
    hostname: api,
    path: `/accounts/auth/refresh`,
    headers: {
      'Authorization': `Bearer ${refreshToken}`
    }
  }

  makeRequest(options, handleError)
}

function handleReadline (question, fn) {
  let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  rl.question(question, (d) => {
    fn(d)
    rl.close()
  })
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
