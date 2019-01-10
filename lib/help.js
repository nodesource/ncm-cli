'use strict'

const logger = require('./logger')

module.exports = {
  helpHeader
}

function helpHeader (cmd) {
  logger([{ text: 'ncm-cli - find unscored deps in a directory via \'npm list\'', style: 'ncm' }])
  logger([{ text: 'Usage: ncm-cli [command] [options]', style: [] }])
  logger()
}
