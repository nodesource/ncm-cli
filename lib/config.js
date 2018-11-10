#!/usr/bin/env node

'use strict'

const Configstore = require('configstore')
const pkg = require('../package.json')
const conf = new Configstore(pkg.name)

const api = 'api.nodesource.com'

const keys = {
    token: ' ',
    refreshToken: ' ',
    org: ' ',
    orgId: ' ',
    policy: ' ',
    policyId: ' ',
    apiVer: 'v1'
}

module.exports = {
    setValue: setValue,
    getValue: getValue,
    delValue: delValue,
    resetState: resetState,
    setTokens: setTokens,
    getTokens: getTokens,
    api
}

const validateState = () => {

    for(let key in keys) {
        if(!conf.get(key)) conf.set(key, keys[key])
    }

}

function setValue(key, value) {

    validateState()
    
    if(keys[key]) conf.set(key, value)
    else return 'Config::SetInvalidField'

    return null
}

function getValue(key) {
    validateState()

    if(keys[key]) { 
        return { err: null, val: conf.get(key) }
    }
    else { 
        return { err: 'Config::GetInvalidField', val: null }
    }
}

function delValue(key) {
    validateState()

    if(keys[key]) conf.set(key, keys[key])
    else return 'Config::DelInvalidField'
}

function resetState() {
    validateState()

    for(let key in keys) {
        conf.set(key, keys[key])
    }
}

function setTokens({ session, refreshToken }) {
    validateState()

    conf.set('token', session)
    conf.set('refreshToken', refreshToken)
}

function getTokens() {
    validateState()

    return { 
        session: conf.get('token'), 
        refreshToken: conf.get('refreshToken') 
    }

}
