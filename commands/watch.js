'use strict'

const { displayHelp } = require('../lib/help')

module.exports = watch

function watch (argv) {
  let help = (argv['_'] && argv['_'][1] === 'help') || argv.help

  if (help) {
    displayHelp('watch')
    return true
  }

  // stub
  return true
}
