#!/usr/bin/env node

'use strict'

const analyze = require('ncm-analyze-tree')
const { getTokens } = require('../lib/config')
const {
  scoreReport,
  jsonReport,
  outputReport,
  handleError,
  refreshSession,
  displayHelp,
  crawlDir
} = require('../lib/tools')

module.exports = verify

function verify (argv) {
  let { json, output, dir, report, help } = argv

  if ((argv['_'] && argv['_'][1] === 'help') || help) {
    displayHelp('verify')
    return true
  }

  let tokens = getTokens()

  return crawl(tokens, dir)
    .then(({ scores, failures }) => {
      if (report) scoreReport(scores)
      if (json) jsonReport(scores)
      if (output) outputReport(scores, output)

      if (failures) process.exit(1)
      else return true
    })
    .catch(catchAuth)
}

const crawl = async ({ session }, dir) => {
  if (!dir) dir = crawlDir(__dirname)
  else dir = crawlDir(dir)

  const f = new Set()
  const r = new Set()

  const data = await analyze({
    dir: dir,
    token: session
  })

  for (const pkg of data) {
    r[pkg.name] = { name: pkg.name, version: pkg.version, score: pkg.score }
    pkg.results.forEach(result => {
      if (result.pass === false) {
        f[pkg.name] && f[pkg.name].results ? f[pkg.name]['results'] = [ f[pkg.name]['results'], result ] : f[pkg.name] = { name: pkg.name, version: pkg.version, 'results': [ result ] }
      }
    })
  }

  return { scores: r, failures: f }
}

const catchAuth = (err) => {
  // graphql login error
  try {
    let e = JSON.stringify(err)

    // session token has expired, request new token and update
    if (e.response && e.response.message === 'Auth::LoginExpired') {
      refreshSession()
    }

    // username / password has invalid token
    handleError('TEMP::InvalidToken')
  } catch (err) {
    handleError('TEMP::UncaughtException')
  }
}
