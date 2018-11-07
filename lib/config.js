#!/usr/bin/env node

'use strict'

const Configstore = require('configstore')
const pkg = require('../package.json')
const conf = new Configstore(pkg.name)

const logger = require('./logger')

const keys = [
    'token',
    'org',
    'policy'
]

const commands = [
    'set',
    'get',
    'del',
    'reset',
    'list'
]

module.exports = {
    modifyState: modifyState,
    configCommands: commands,
    configKeys: keys,
    setTokens: setTokens,
    getTokens: getTokens,
    getFields: getFields
}

const validateState = () => {
    if(!conf.get('token')) conf.set('token', null)
    if(!conf.get('refreshToken')) conf.set('refreshToken', null)
    if(!conf.get('org')) conf.set('org', "default")
    if(!conf.get('policy')) conf.set('policy', "default")
}

const refreshState = ()  => {
    conf.set('token', null)
    conf.set('refreshToken', null)
    conf.set('org', "default")
    conf.set('policy', "default")
}

function modifyState(argv) {
    validateState()

    let action = (argv['_'][1] ? argv['_'][1].toLowerCase() : null)

    if(!action) console.error('No action specified')

    let key = (argv['_'][2] ? argv['_'][2].toLowerCase() : null),
        value = (argv['_'][3] ? argv['_'][3].toLowerCase() : null)

    switch (action) {
        case "set":
            if(key && value && keys.includes(key)) {

                conf.set(key,value)

                logger([{ text: 'NCM-CLI', style: 'ncm' }])
                logger([{ text: `<${key}> `, style: 'success' },{ text: `has been set to:`, style: [] }])
                logger([{ text: `${value}`, style: [] }])
                logger()

            } else {
                
                logger([{ text: 'NCM-CLI', style: 'ncm' }])
                logger([{ text: `Could not set `, style: [] }, { text: `<${key}>`, style: 'error' }])
                logger()
                
            }
            break;
        case "get":
            if(key && keys.includes(key)) { 
                let val = conf.get(key,value)

                logger([{ text: 'NCM-CLI', style: 'ncm' }])
                logger([{ text: `<${key}>:`, style: 'success' }])
                logger([{ text: `${value ? value : ''}`, style: [] }])
                logger()

                return val
            } else {

                logger([{ text: 'NCM-CLI', style: 'ncm' }])
                logger([{ text: `Could not get `, style: [] }, { text: `<${key}>`, style: 'error' }])
                logger()

            }
            break
        case "del":
            if(key && keys.includes(key)) {
                conf.set(key,null)

                logger([{ text: 'NCM-CLI', style: 'ncm' }])
                logger([{ text: `<${key}>:`, style: 'success' }])
                logger([{ text: `${value ? value : ''}`, style: [] }])
                logger()

            } else {

                logger([{ text: 'NCM-CLI', style: 'ncm' }])
                logger([{ text: `Could not delete `, style: [] }, { text: `<${key}>`, style: 'error' }])
                logger()

            }
            break

        case "reset":
            refreshState()
            
            logger([{ text: 'NCM-CLI', style: 'ncm' }])
            logger([{ text: `Config reset successful.`, style: 'success' }])
            logger()

            break

        case "list":

            logger([{ text: 'NCM-CLI', style: 'ncm' }])
            keys.forEach(key => {
                logger([{ text: `<${key}> `, style: 'success' }, { text: `${conf.get(key)}`, style: [] }])
            })
            logger()

            break
    }   
}

function getFields(fields) {
    let f = new Set()
    for(let field of fields) {
        if(keys.includes(field)) f[field] = conf.get(field)
    }
    return f
}

function setTokens({ session, refreshToken }) {
    conf.set('token', session)
    conf.set('refreshToken', refreshToken)
}

function getTokens() {
    return { 
        session: conf.get('token'), 
        refreshToken: conf.get('refreshToken') 
    }
}
