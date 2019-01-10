'use strict'

const { setTokens } = require('../lib/config')
const logger = require('../lib/logger')
const { helpHeader } = require('../lib/help')

module.exports = signout

async function signout (argv) {
  if (argv.help) {
    printHelp()
    return
  }

  setTokens({ session: ' ', refreshToken: ' ' })
}

function printHelp () {
  helpHeader()

  logger([{ text: `ncm-cli signout`, style: ['bold'] }])
  logger()
}
