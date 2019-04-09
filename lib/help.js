'use strict'

const {
  header,
  rawBox
} = require('./ncm-style')
const L = console.log

module.exports = {
  helpHeader
}

function helpHeader (cmd, usage, usageRaw, description) {
  L()
  L(header(`NCM CLI Help: ncm ${cmd}`))
  description ? L(description) : L()
  L('Usage:')
  L(rawBox(usage, usageRaw.length || usage.length))
  L()
}
