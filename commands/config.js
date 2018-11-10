'use strict'

const { 
    getValue,
    setValue,
    delValue,
    resetState 
} = require('../lib/config')
const logger = require('../lib/logger')

module.exports = config

const userAccess = [
    'token',
    'org',
    'policy'
]

function config(argv) {

    let action = (argv['_'][1] ? argv['_'][1].toLowerCase() : null)

    if(!action) console.error('No action specified')

    let key = (argv['_'][2] ? argv['_'][2].toLowerCase() : null),
        value = (argv['_'][3] ? argv['_'][3] : null)

    logger([{ text: 'NCM-CLI', style: 'ncm' }])
    switch (action) {
        case "set":
            let setErr = setValue(key, value)
            if(setErr) {
                logger([{ text: `Could not set `, style: [] }, { text: `<${key}>`, style: 'error' }])
                logger()
            } else {
                logger([{ text: `<${key}> `, style: 'success' },{ text: `has been set to:`, style: [] }])
                logger([{ text: `${value}`, style: [] }])
                logger()
            }
            break
        case "get":
            let getErr, val = getValue(key)
            if(getErr) {
                logger([{ text: `Could not get `, style: [] }, { text: `<${key}>`, style: 'error' }])
                logger()
            } else {
                logger([{ text: `<${key}>:`, style: 'success' }])
                logger([{ text: `${val ? val : ''}`, style: [] }])
                logger()
            }
            break
        case "del":
            let delErr = delValue(key)
            if(delErr) {
                logger([{ text: `Could not delete `, style: [] }, { text: `<${key}>`, style: 'error' }])
                logger()
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
        let getErr, val = getValue(userAccess[ind])
        if(val) l[userAccess[ind]] = val
    }

    return l
}