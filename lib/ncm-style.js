'use strict'

const util = require('util')
const chalk = require('chalk')

const COLORS = {
  light1: 'hex(\'#89a19d\')',
  base: 'hex(\'#4c5859\')',
  blue: 'hex(\'#4cb5ff\')',
  teal: 'hex(\'#66ccbb\')',
  green: 'hex(\'#5ac878\')',
  yellow: 'hex(\'#ffb726\')',
  orange: 'hex(\'#ff8b40\')',
  red: 'hex(\'#ff6040\')'
}

module.exports = {
  COLORS,

  // formatted printers
  header,
  line,
  failure,
  success,
  action,
  prompt,
  tooltip,
  divider,
  box,
  boxbox,
  rawBox,
  formatError
}

// Formatted printers
function header (text) {
  const { length } = text
  return chalk`
{${COLORS.light1} ╔══${'═'.repeat(length)}╗}
{${COLORS.light1} ║} {white ${text}} {${COLORS.light1} ║}
{${COLORS.light1} ╚══${'═'.repeat(length)}╝}
  `.trim()
}

function line (symbol, text, color = COLORS.light1) {
  return chalk`{${color} ${symbol}} ${text}`
}

function failure (text) {
  return line('X', text, COLORS.red)
}

function success (text) {
  return line('✓', text, COLORS.green)
}

function action (text) {
  return line('|➔', text, COLORS.yellow)
}

function prompt (text) {
  return line('?', text, COLORS.red)
}

function tooltip (text) {
  return chalk`{${COLORS.teal} |➔ ${text}}`
}

function divider (length) {
  return chalk`{${COLORS.light1} ${'-'.repeat(length)}}`
}

function box (symbol, text, color = COLORS.light1) {
  const length = symbol.length + text.length
  return chalk`
{${color} ┌──${'─'.repeat(length)}─┐}
{${color} │ ${symbol}} {white ${text}} {${color} │}
{${color} └──${'─'.repeat(length)}─┘}
  `.trim()
}

function boxbox (symbol, text, color = COLORS.light1, symbolLength) {
  return chalk`
{${color} ┌─${'─'.repeat(symbolLength || symbol.length)}─┬─${'─'.repeat(text.length)}─┐}
{${color} │ ${symbol} │} {white ${text}} {${color} │}
{${color} └─${'─'.repeat(symbolLength || symbol.length)}─┴─${'─'.repeat(text.length)}─┘}
  `.trim()
}

function rawBox (text, length, color = COLORS.light1) {
  return chalk`
{${color} ┌─${'─'.repeat(length)}─┐}
{${color} │} ${text} {${color} │}
{${color} └─${'─'.repeat(length)}─┘}
  `.trim()
}

function formatError (message, err) {
  if (process.env['NCM_DEV'] === 'true' && err) {
    if (err.code) {
      message = util.format(message, err.code, err)
    } else {
      message = util.format(message, err)
    }
  }
  return line('‼︎', chalk`{${COLORS.red} ${message}}`, COLORS.red)
}
