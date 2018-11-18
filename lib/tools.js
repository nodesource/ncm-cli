#!/usr/bin/env node

'use strict'

const readline = require('readline')
const https = require('https')
const fs = require('fs')
const path = require('path')

const { getTokens, api } = require('./config')
const logger = require('./logger')
const { GraphQLClient } = require('graphql-request')

module.exports = {
  makeRequest: makeRequest,
  graphql: graphql,
  scoreReport: scoreReport,
  jsonReport: jsonReport,
  outputReport: outputReport,
  handleError: handleError,
  handleReadline: handleReadline,
  refreshSession: refreshSession,
  displayHelp: displayHelp
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

function scoreReport (report) {
  let width = 70

  const logggerBar = () => logger([{ text: `╟${'—'.repeat(width * 0.55)}┼${'—'.repeat(width * 0.25 - 1)}┼${'—'.repeat(width * 0.20 - 1)}╢`, style: 'table' }])
  const loggerTableHeader = () => logger([{ text: `╔${'═'.repeat(width * 0.55)}╤${'═'.repeat(width * 0.25 - 1)}╤${'═'.repeat(width * 0.20 - 1)}╗`, style: 'table' }])
  const loggerTableFooter = () => logger([{ text: `╚${'═'.repeat(width * 0.55)}╧${'═'.repeat(width * 0.25 - 1)}╧${'═'.repeat(width * 0.20 - 1)}╝`, style: 'table' }])
  const loggerTableTitle = () => logger([
    { text: `║`, style: 'table' },
    { text: `${' '.repeat(width * 0.05)}Package`, style: 'title' },
    { text: `${' '.repeat(Math.floor(width * 0.50 - 7))}|`, style: 'table' },
    { text: `${' '.repeat(width * 0.05)}Version`, style: 'title' },
    { text: `${' '.repeat(Math.floor(width * 0.20 - 8))}|`, style: 'table' },
    { text: `${' '.repeat(width * 0.05)}Score`, style: 'title' },
    { text: `${' '.repeat(Math.floor(width * 0.10 - 2))}║`, style: 'table' }
  ])
  const loggerPackageDetails = (pkg) => logger([
    { text: `║`, style: 'table' },
    { text: `${' '.repeat(width * 0.05)}${pkg.name}`, style: [] },
    { text: `${' '.repeat(Math.floor(width * 0.50 - (pkg.name.length)))}|`, style: 'table' },
    { text: `${' '.repeat(width * 0.05)}${pkg.version}`, style: [] },
    { text: `${' '.repeat(Math.floor(width * 0.20 - (pkg.version.length) - 1))}|`, style: 'table' },
    { text: `${' '.repeat(width * 0.05)}${pkg.score}`, style: pkg.score < 50 ? ['red', 'bold'] : [] },
    { text: `${' '.repeat(width * 0.10 + 3 - String(pkg.score).length)}║`, style: 'table' }
  ])

  logger([{ text: 'NCM-CLI', style: 'ncm' }])
  loggerTableHeader()
  loggerTableTitle()
  for (let pkg in report) {
    pkg = report[pkg]
    if (pkg.name.length > width * 0.40) pkg.name = `${pkg.name.slice(0, width * 0.40)}..`
    logggerBar()
    loggerPackageDetails(pkg)
  }
  loggerTableFooter()
}

function jsonReport (report) {
  try {
    let json = JSON.stringify(report, null, 2)
    console.log(json)
  } catch (err) {
    handleError('Tools::UnableToParseReport')
  }
}

function outputReport (report, dir) {
  if (typeof (dir) === 'boolean') dir = __dirname

  try {
    let json = JSON.stringify(report)
    let timestamp = new Date().valueOf()
    let p = path.join(dir, `ncm-score-report-${timestamp}.json`)
    fs.writeFile(p, json, 'utf8', (err) => onWrite(err, p))
  } catch (err) {
    handleError('Tools::UnableToFormatOutput')
  }
}

function onWrite (err, p) {
  if (err) {
    handleError('Tools::UnableToWriteReport')
    return
  }

  logger([{ text: 'Score report written to: ', style: [] }])
  logger([{ text: p, style: [] }])
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

function displayHelp (cmd) {
  logger([{ text: 'NCM-CLI', style: 'ncm' }])
  logger([{ text: 'usage: ncm-cli [command] [options]', style: [] }])
  logger()

  logger([{ text: 'Commands:', style: ['bold'] }])
  switch (cmd) {
    case 'config':
      logger([{ text: `ncm-cli config set`, style: [] }])
      logger([{ text: `ncm-cli config get`, style: [] }])
      logger([{ text: `ncm-cli config del`, style: [] }])
      logger([{ text: `ncm-cli config list`, style: [] }])
      logger([{ text: `ncm-cli config reset`, style: [] }])
      break
    case 'signin':
      logger([{ text: `ncm-cli signin [options]`, style: [] }])
      break
    case 'signout':
      logger([{ text: 'ncm-cli signout', style: [] }])
      break
    case 'policy':
      logger([{ text: `ncm-cli policy whitelist`, style: [] }])
      logger([{ text: `ncm-cli policy whitelist add <pkg-name>@<ver>`, style: [] }])
      logger([{ text: `ncm-cli policy whitelist del <pkg-name>@<ver>`, style: [] }])
      break
    case 'verify':
      logger([{ text: `ncm-cli verify [options]`, style: [] }])
      break
    case 'watch':
      logger([{ text: `ncm-cli watch [options]`, style: [] }])
      break
    case 'help':
      logger([{ text: `ncm-cli help`, style: [] }])
      logger([{ text: `ncm-cli signin [options]`, style: [] }])
      logger([{ text: `ncm-cli signout`, style: [] }])
      logger([{ text: `ncm-cli config [command]`, style: [] }])
      logger([{ text: `ncm-cli policy [command] [options]`, style: [] }])
      logger([{ text: `ncm-cli verify [options]`, style: [] }])
      logger([{ text: `ncm-cli watch [options]`, style: [] }])
  }
  logger()

  logger([{ text: 'Options:', style: ['bold'] }])
  logger([{ text: `--help`, style: [] }])
  switch (cmd) {
    case 'signin':
      logger([{ text: `--help`, style: [] }])
      logger([{ text: `--google, -G`, style: [] }])
      logger([{ text: `--github, -g`, style: [] }])
      break
    case 'verify':
      logger([{ text: `--dir, -d`, style: [] }])
      logger([{ text: `--report, -r`, style: [] }])
      logger([{ text: `--json, -j`, style: [] }])
      logger([{ text: `--output, -o`, style: [] }])
      logger([{ text: `--certified, -C`, style: [] }])
      logger([{ text: `--production, -p`, style: [] }])
      break
    case 'watch':
      logger([{ text: `--dir, -d`, style: [] }])
      break
    case 'help':
      logger([{ text: `--version, -v`, style: [] }])
  }
  logger()
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
