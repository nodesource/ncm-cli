'use strict'

const {
  getValue,
  setValue,
  delValue,
  resetState
} = require('../lib/config')
const logger = require('../lib/logger')
const { handleError } = require('../lib/util')
const { displayHelp } = require('../lib/help')

module.exports = config

const userAccess = [
  'token',
  'org'
]

function config (argv) {
  const help = argv.help || argv._[1] === 'help'

  if (help) {
    displayHelp('config')
    return true
  }

  const [ action, key, value ] = argv._.slice(1)

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
      displayHelp('config')
      break
  }
  return true
}
