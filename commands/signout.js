#!/usr/bin/env node

'use strict'

const { setTokens } = require('../lib/config')
const { displayHelp } = require('../lib/tools')

module.exports = signout

function signout (argv) {

    let help = (argv['_'] && argv['_'][1] == 'help') || argv.help

    if(help)  { 
        displayHelp('signout')
        return true
    }

    setTokens({ session: ' ', refreshToken: ' '})
    return true
}
