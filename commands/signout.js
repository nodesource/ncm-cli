'use strict'

const { setTokens } = require('../lib/config')
const { displayHelp } = require('../lib/help')

module.exports = signout

function signout (argv) {
  const help = argv.help || argv._[1] === 'help'

  if (help) {
    displayHelp('signout')
    return true
  }

  setTokens({ session: ' ', refreshToken: ' ' })
  return true
}
