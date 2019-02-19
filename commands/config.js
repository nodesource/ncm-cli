'use strict'

const {
  getValue,
  setValue,
  delValue,
  resetState
} = require('../lib/config')
const logger = require('../lib/logger')
const { handleError } = require('../lib/util')
const { helpHeader } = require('../lib/help')
const { COLORS } = require('../lib/ncm-style')
const chalk = require('chalk')
const L = console.log

module.exports = config
module.exports.optionsList = optionsList

const userAccess = [
  'token',
  'org'
]

async function config (argv, action, key, value) {
  if (argv.help) {
    printHelp()
    return
  } else if (!action || !key || !value) {
    printHelp()
    process.exitCode = 1
    return
  }

  switch (action) {
    case 'set':
      let setErr = setValue(key, value)
      if (setErr) {
        handleError(setErr)
      } else {
        logger([{ text: 'NCM-CLI', style: 'ncm' }])
        logger([{ text: `<${key}> `, style: 'success' }, { text: `has been set to:`, style: [] }])
        logger([{ text: `${value}`, style: [] }])
        logger()
      }
      break
    case 'get':
      let { err, val } = getValue(key)
      if (err) {
        handleError(err)
      } else {
        logger([{ text: 'NCM-CLI', style: 'ncm' }])
        logger([{ text: `<${key}>:`, style: 'success' }])
        logger([{ text: `${val || ''}`, style: [] }])
        logger()
      }
      break
    case 'del':
      let delErr = delValue(key)
      if (delErr) {
        handleError(delErr)
      } else {
        logger([{ text: 'NCM-CLI', style: 'ncm' }])
        logger([{ text: `<${key}>:`, style: 'success' }])
        logger([{ text: `${value || ''}`, style: [] }])
        logger()
      }
      break
    case 'reset':
      resetState()

      logger([{ text: 'NCM-CLI', style: 'ncm' }])
      logger([{ text: `Config reset successful.`, style: 'success' }])
      logger()
      break
    case 'list':
      for (let key of userAccess) {
        let { err, val } = getValue(key)
        if (err) continue
        logger([{ text: `<${key}> `, style: 'success' }, { text: `${val}`, style: [] }])
      }
      logger()
      break
    default:
      printHelp()
      process.exitCode = 1
      break
  }
}

function printHelp () {
  helpHeader(
    'config',
    chalk`ncm {${COLORS.yellow} config} {${COLORS.teal} <action>}`,
    'ncm config <action>'
  )

  L(optionsList())
  L()
}

function optionsList () {
  return chalk`
{${COLORS.light1} ncm} {${COLORS.yellow} config list}
{${COLORS.light1} ncm} {${COLORS.yellow} config reset}
{${COLORS.light1} ncm} {${COLORS.yellow} config del} {${COLORS.teal} <key>}
{${COLORS.light1} ncm} {${COLORS.yellow} config get} {${COLORS.teal} <key>}
{${COLORS.light1} ncm} {${COLORS.yellow} config set} {${COLORS.teal} <key> <value>}
  `.trim()
}
