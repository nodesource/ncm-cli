'use strict'

const { 
    getValue,
    setValue,
    delValue,
    resetState 
} = require('../lib/config')
const logger = require('../lib/logger')
const { handleError } = require('../lib/tools')

module.exports = config

const userAccess = [
    'token',
    'org',
    'orgId',
    'policy',
    'policyId'
]

function config(argv) {

    let action = (argv['_'][1] ? argv['_'][1].toLowerCase() : null)

    if(!action) {
        handleError('Config::NoAction')
        return true
    }

    let key = (argv['_'][2] ? argv['_'][2].toLowerCase() : null),
        value = (argv['_'][3] ? argv['_'][3] : null)

    logger([{ text: 'NCM-CLI', style: 'ncm' }])
    switch (action) {
        case "set":
            let setErr = setValue(key, value)
            if(setErr) {
                handleError(setErr)
            } else {
                logger([{ text: `<${key}> `, style: 'success' },{ text: `has been set to:`, style: [] }])
                logger([{ text: `${value}`, style: [] }])
                logger()
            }
            break
        case "get":
            let { err, val } = getValue(key)
            if(err) {
                handleError(err)
            } else {
                logger([{ text: `<${key}>:`, style: 'success' }])
                logger([{ text: `${val ? val : ''}`, style: [] }])
                logger()
            }
            break
        case "del":
            let delErr = delValue(key)
            if(delErr) {
                handleError(delErr)
            } else {
                logger([{ text: `<${key}>:`, style: 'success' }])
                logger([{ text: `${value ? value : ''}`, style: [] }])
                logger()
            }
            break
        case "reset":
            resetState()
            
            logger([{ text: `Config reset successful.`, style: 'success' }])
            logger()
            break
        case "list":
            let list = prepareList()
            for(let key in list) {
                logger([{ text: `<${key}> `, style: 'success' }, { text: `${list[key]}`, style: [] }])
            }
            logger()
            break
    }   
    return true
}

const prepareList = () => {
    let l = new Set()

    for(let ind in userAccess) {
        let { err, val } = getValue(userAccess[ind])
        if(!err) l[userAccess[ind]] = val
    }

    return l
}
