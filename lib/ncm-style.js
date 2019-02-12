'use strict'

const util = require('util')
const chalk = require('chalk')

// Colors
const light1 = 'hex(\'#89a19d\')'
const blue = 'hex(\'#4cb5ff\')'
const green = 'hex(\'#5ac878\')'
const yellow = 'hex(\'#ffb726\')'
const red = 'hex(\'#ff6040\')'
const teal = 'hex(\'#66ccbb\')'

module.exports = {
  // colors
  light1,
  blue,
  green,
  yellow,
  red,

  // formatted printers
  header,
  line,
  box,
  boxbox,
  formatError,
  tooltip,
  divider
}

// Formatted printers
function header (text) {
  const { length } = text
  return chalk`
{${light1} ╔══${'═'.repeat(length)}╗}
{${light1} ║} {white ${text}} {${light1} ║}
{${light1} ╚══${'═'.repeat(length)}╝}
  `.trim()
}

function line (symbol, text, color = light1) {
  return chalk`{${color} ${symbol}} ${text}`
}

function box (symbol, text, color = light1) {
  const { length } = text
  return chalk`
{${color} ┌───${'─'.repeat(length)}─┐}
{${color} │ ${symbol}} {white ${text}} {${color} │}
{${color} └───${'─'.repeat(length)}─┘}
  `.trim()
}

function boxbox (symbol, text, color = light1) {
  const { length } = text
  return chalk`
{${color} ┌───┬─${'─'.repeat(length)}─┐}
{${color} │ ${symbol} │} {white ${text}} {${color} │}
{${color} └───┴─${'─'.repeat(length)}─┘}
  `.trim()
}

function formatError (message, err) {
  if (process.env['NCM_DEV'] === 'true' && err) {
    message = util.format(message, err.message || err)
  }
  return line('‼︎', chalk`{${red} ${message}}`, red)
}

function tooltip (text) {
  return chalk`{${teal} |→ ${text}}`
}

function divider (length) {
  return chalk`{${light1} ${'-'.repeat(length)}}`
}
