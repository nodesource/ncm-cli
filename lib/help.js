'use strict'

const {
  header,
  rawBox
} = require('./ncm-style')
const L = console.log

module.exports = {
  helpHeader
}

function helpHeader (cmd, usage, usageRaw) {
  L()
  L(header(`NCM CLI Help: ncm ${cmd}`))
  L()
  L('Usage:')
  L(rawBox(usage, usageRaw.length || usage.length))
  L()
}
