'use strict'

const { setTokens } = require('../lib/config')
const { helpHeader } = require('../lib/help')
const { COLORS } = require('../lib/ncm-style')
const chalk = require('chalk')
const L = console.log

module.exports = signout
module.exports.optionsList = optionsList

async function signout (argv) {
  if (argv.help) {
    printHelp()
    return
  }

  setTokens({ session: ' ', refreshToken: ' ' })
}

function printHelp () {
  helpHeader(
    'signout',
    chalk`ncm {${COLORS.yellow} signout}`,
    'ncm signout'
  )

  L(optionsList())
  L()
}

function optionsList () {
  return chalk`
{${COLORS.light1} ncm} {${COLORS.yellow} signout}
  `.trim()
}
