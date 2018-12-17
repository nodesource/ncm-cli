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
  let help = (argv['_'] && argv['_'][1] === 'help') || argv.help

  if (help) {
    displayHelp('config')
    return true
  }

  let action = (argv['_'][1] ? argv['_'][1].toLowerCase() : null)

  let key = (argv['_'][2] ? argv['_'][2].toLowerCase() : null)
  let value = (argv['_'][3] ? argv['_'][3] : null)

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
      let list = prepareList()
      for (let key in list) {
        logger([{ text: `<${key}> `, style: 'success' }, { text: `${list[key]}`, style: [] }])
      }
      logger()
      break
    default:
      displayHelp('config')
      break
  }
  return true
}

const prepareList = () => {
  let l = new Set()

  for (let ind in userAccess) {
    let { err, val } = getValue(userAccess[ind])
    if (!err) l[userAccess[ind]] = val
  }

  return l
}
