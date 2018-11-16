#!/usr/bin/env node

'use strict'

const { makeRequest, handleError, handleReadline } = require('../lib/tools')
const { getValue, setValue, getTokens, setTokens, api } = require('../lib/config')
const logger = require('../lib/logger')

module.exports = signin

function signin(argv) {
    let args = argv['_'] || null
    let SSO = 
        (argv['G'] ? 'google' : null) ||
        (argv['g'] ? 'github' : null) ||
        null

    if (args && args.length == 3) {
        let email = (args[1].length > 0 ? args[1] : null)
        let password = (args[1].length > 0 ? args[2] : null)

        if(email && password) {
            try {
                emailAuth(JSON.stringify({ email, password }))
            } catch (err) {
                handleError('Signin::InvalidLoginCredentials')
            }
        }
    }

    if (SSO) {
        getUrlSSO(SSO)
    }

    return true
}

function emailAuth(usrInfo) {

    const options = {
        method: 'POST',
        hostname: api,
        path: `/accounts/auth/login`,
        headers: { 'Content-Type': 'application/json' },
        body: usrInfo
    }

    makeRequest(options, onSession)
}

function getUrlSSO(sso) {

    const options = {
        method: 'GET',
        hostname: api,
        path: `/accounts/auth/social-signin-url?source=${sso}`,
    }

    makeRequest(options, retrieveSession)
}

function retrieveSession(err, { url, nonce }) {

    if(err) {
        handleError('Signin::RetrieveSession')
    }


    logger([{ text: 'NCM-CLI:', style: 'ncm' }])
    logger([{ text: 'Please open the following URL in your browser: ', style: 'main' }])
    logger()
    logger([{ text: url, style: 'main' }])
    logger()

    const options = {
        method: 'GET',
        hostname: api,
        path: `/accounts/auth/retrieve-session?nonce=${nonce}`
    }

    makeRequest(options, onSession)
}

function onSession(err, data) {

    if(err) { 
        console.log(err)
        handleError('Signin::Generic')
        return
    }

    if(!data['session'] || !data['refreshToken'] ) {
        handleError('Signin::InvalidLoginCredentials')
        return
    }

    setTokens(data)

    fetchUserDetails()

    logger([{ text: 'Login Successful', style: 'success' }])
    logger()
}

function fetchUserDetails() {

    let { session } = getTokens()

    const options = {
        method: 'GET',
        hostname: api,
        path: `/accounts/user/details`,
        headers: {
            Authorization: `Bearer ${session}`
        }
    }

    makeRequest(options, setDetails)
}

function setDetails(err, data) {
    if(err) {
        handleError('Signin::FetchUserDetails')
        return
    }

    let orgs = data.orgs ? Object.keys(data.orgs) : null // array of orgs
    let { val: apiVer } = getValue('apiVer')
    let hasOrgs = orgs.length > 0

    if(!hasOrgs) {
        // user does not belong to any organizations: set orgId and policyId to personal configuration
        setValue('org', 'default')
        setValue('orgId', '1')
        setValue('policy', 'personal')
        setValue('policyId', 'default')

        handleError('Signin::NoOrgs')
    }


    // only supported version, currently
    if(hasOrgs && apiVer == 'v1') {
        let orgId = orgs[0]
        let org = data.orgs[orgId].name

        logger([
            { text: 'You belong to the organization: ', style: [] },
            { text: org, style: 'success' }
        ])
        logger([
            { text: 'Would you like to use the organiztion policy set? (y/n)', style: [] }
        ])

        handleReadline('', (choice) => {

            choice = choice.trim()
            choice = choice.toLowerCase()

            if(choice == 'n' || choice == 'no') {
                setValue('org', 'default')
                setValue('orgId', '1')
            }
            if(choice == 'y' || choice == 'yes'){
                setValue('org', org)
                setValue('orgId', orgId)
            }
        })
    }

    // to come soon, allowing for mutliple orgs
    if(hasOrgs && apiVer == 'v2') {
        let orgSet = new Set()
    
        const templateList = []
        for(let ind in orgs) {
            orgSet[data.orgs[orgs[ind]].name] = orgs[ind]
            templateList.push({ text: `${data.orgs[orgs[ind]].name}    `, style: ['bold'] })
        }
    
        logger([{ text: 'Select an organization to set as default', style: [] }])
        logger(templateList)
    
        // todo: de-turdification
        handleReadline('', readChoice)
    
        const readChoice = (choice) => {
            choice = choice.trim()
            if(orgSet[choice]) {
                setValue('org', choice)
                setValue('orgId', orgSet[choice])
            }
        }
    }
}