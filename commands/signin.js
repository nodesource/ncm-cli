#!/usr/bin/env node

'use strict'

const { makeRequest, handleError } = require('../lib/tools')
const config = require('../lib/config')
const logger = require('../lib/logger')

const HOSTNAME = 'api.nodesource.com'

module.exports = signin

function signin(argv, options) {
    let args = argv['_'] || null
    let SSO = 
        (argv['G'] ? 'google' : null) ||
        (argv['g'] ? 'github' : null) ||
        null

    if (args && args.length == 3) {
        let email = (args[1].length > 0 ? args[1] : null)
        let password = (args[1].length > 0 ? args[2] : null)

        if(email && password) {
            emailAuth(JSON.stringify({ email, password }))
        }
    }

    if (SSO) {
        getUrlSSO(SSO)
    }

    return true
}

function emailAuth(usrInfo) {
    console.log(usrInfo)

    const options = {
        method: 'POST',
        hostname: HOSTNAME,
        path: `/accounts/auth/login`,
        headers: { 'Content-Type': 'application/json' },
        body: usrInfo
    }

    makeRequest(options, onSession)
}

function getUrlSSO(sso) {

    const options = {
        method: 'GET',
        hostname: HOSTNAME,
        path: `/accounts/auth/social-signin-url?source=${sso}`,
    }

    makeRequest(options, retrieveSession)
}

function retrieveSession(err, { url, nonce }) {

    if(err) console.error(err)

    logger([{ text: 'NCM-CLI:', style: 'ncm' }])
    logger([{ text: 'Please open the following URL in your browser: ', style: 'main' }])
    logger()
    logger([{ text: url, style: 'main' }])
    logger()

    const options = {
        method: 'GET',
        hostname: `api.nodesource.com`,
        path: `/accounts/auth/retrieve-session?nonce=${nonce}`
    }

    makeRequest(options, onSession)
}

function onSession(err, data) {

    if(err) { 
        handleError(err)
        return
    }

    if(!data['session'] || !data['refreshToken'] ) {
        console.log(JSON.stringify(data))
        handleError({ message: 'Invalid login details' })
        return
    }

    fetchUserDetails()

    config.setTokens(data)

    logger([{ text: 'Login Successful', style: 'success' }])
    logger()
}

function fetchUserDetails() {

    let { session, refreshToken } = config.getTokens()

    const options = {
        method: 'GET',
        hostname: HOSTNAME,
        path: `/accounts/user/details`,
        headers: {
            Authorization: `Bearer ${session}`
        }
    }

    makeRequest(options, setDetails)

}

function refreshSession() {
    const options = {
        method: 'GET',
        hostname: HOSTNAME,
        path: `/accounts/auth/refresh`,
        headers: {
            'Authorization': `Bearer ${refreshToken}`
        }
    }

    makeRequest(options, handleError)
}

function setDetails(err, data) {
    if(err) handleError(err)

    //stub
}