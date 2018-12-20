'use strict'

module.exports = orgs

const clientRequest = require('../lib/client-request')
const { formatAPIURL, handleError, queryReadline } = require('../lib/util')
const { displayHelp } = require('../lib/help')
const { setValue, getTokens } = require('../lib/config')
const logger = require('../lib/logger')

function orgs (argv) {
  const help = argv.help || argv._[1] === 'help'

  if (help) {
    displayHelp('policy')
    return true
  }

  doOrgs(argv)

  return true
}

function doOrgs(argv) {
  console.log(argv)

  if (typeof argv.orgs === 'string') {
    // user has provided an org choice, we need to verify it now
    
  }

  else {
    // user has not provided an org, prompt them via readline
    
  }
}
