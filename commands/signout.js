#!/usr/bin/env node

'use strict'

const { setTokens } = require('../lib/config')

module.exports = signout

function signout () {
    setTokens({ session: ' ', refreshToken: ' '})
    return true
}
