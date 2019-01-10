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

module.exports = config

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
  helpHeader()

  logger([{ text: 'ncm-cli config', style: ['bold'] }])
  logger([{ text: `ncm-cli config set`, style: [] }])
  logger([{ text: `ncm-cli config get`, style: [] }])
  logger([{ text: `ncm-cli config del`, style: [] }])
  logger([{ text: `ncm-cli config list`, style: [] }])
  logger([{ text: `ncm-cli config reset`, style: [] }])
  logger()
}
