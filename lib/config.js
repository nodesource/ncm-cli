'use strict'

const Configstore = require('configstore')
const pkg = require('../package.json')
const conf = new Configstore(pkg.name)

const api = 'api.nodesource.com'

const keys = {
  token: ' ',
  refreshToken: ' ',
  org: 'default',
  orgId: '1',
  policy: ' ',
  policyId: ' '
}

module.exports = {
  setValue: setValue,
  getValue: getValue,
  delValue: delValue,
  resetState: resetState,
  setTokens: setTokens,
  getTokens: getTokens,
  api,
  keyNames: Object.keys(keys)
}

const validateState = () => {
  for (let key in keys) {
    if (!conf.get(key)) conf.set(key, keys[key])
  }
}

function setValue (key, value) {
  validateState()

  if (!keys[key]) {
    throw new Error(`Attempted to set invalid config key "${key}"`)
  }
  conf.set(key, value)
}

function getValue (key) {
  validateState()

  if (!keys[key]) {
    throw new Error(`Attempted to get invalid config key "${key}"`)
  }

  return conf.get(key)
}

function delValue (key) {
  validateState()

  if (!keys[key]) {
    throw new Error(`Attempted to delete invalid config key "${key}"`)
  }

  conf.set(key, keys[key])
}

function resetState () {
  validateState()

  for (let key in keys) {
    conf.set(key, keys[key])
  }
}

function setTokens ({ session, refreshToken }) {
  validateState()

  conf.set('token', session)
  conf.set('refreshToken', refreshToken)
}

function getTokens () {
  validateState()

  return {
    session: conf.get('token'),
    refreshToken: conf.get('refreshToken')
  }
}
