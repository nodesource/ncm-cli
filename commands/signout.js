#!/usr/bin/env node

'use strict'

const config = require('../lib/config')

module.exports = signout

function signout (argv) {
    config.setTokens({ session: '', refreshToken: ''})
}