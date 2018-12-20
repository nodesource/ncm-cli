'use strict'

const { displayHelp } = require('../lib/help')

module.exports = watch

function watch (argv) {
  const help = argv.help || argv._[1] === 'help'

  if (help) {
    displayHelp('watch')
    return true
  }

  // stub
  return true
}
