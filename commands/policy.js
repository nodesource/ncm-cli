#!/usr/bin/env node

'use strict'

const { graphql, handleError } = require('../lib/tools')
const { getValue, api } = require('../lib/config')
const logger = require('../lib/logger')

module.exports = policy

function policy(argv) {

    let action = (argv['_'][1] ? argv['_'][1].toLowerCase() : null)

    switch(action) {
        case "add" || "del":
            modifyWhitelistEntries(action, parseEntries(argv))
            break
        case "get":
            getWhitelist()
            break
        default:
            getWhitelist()
            break
    }
    return true
}

const modifyWhitelistEntries = async(action, entries) => {

    let token = getValue('token'),
        policy = getValue('policy'),
        org = getValue('org')

    if(!token) { 
        handleError('Policy::NoToken')
        return
    }
    if(!org) {
        handleError('Policy::NoOrg')
        return
    }
    if(!policy) {
        handleError('Policy::NoPolicy')
        return
    }
    if(entries.isEmpty) {
        handleError('Policy::NoValidEntries')
        return
    }

    let options = {
        token: token,
        url: `https://${api}/ncm2/api/v1`
    }

    let query = queries[action]
    let vars = { org, policy, entries }

    await graphql(options, query, vars)
    .then(madeModifications)
    .catch(catchErrors)
}

const getWhitelist = async() => {

    let token = getValue('token'),
        policy = getValue('policy'),
        org = getValue('org')

    if(!token) { 
        handleError('Policy::NoToken')
        return
    }
    if(!org) {
        handleError('Policy::NoOrg')
        return
    }
    if(!policy) {
        handleError('Policy::NoPolicy')
        return
    }

    let options = {
        token: token,
        url: `https://${api}/ncm2/api/v1`
    }

    let query = queries['get']
    let vars = { org }

    await graphql(options, query, vars)
    .then(gotWhitelist)
    .catch(catchErrors)
}

const parseEntries = (argv) => {

    let entries = []

    argv['_'].forEach((pkg, ind) => {
        if(ind > 1 && pkg.includes('@')) {
            entries.push({ name: pkg.split('@')[0], version: pkg.split('@')[1] })
        } 
        else if (ind > 1) {
            logger([{ text: 'Unable to determine package: ', style: [] },{ text: `${pkg}`, style: 'error'} ])
        }
    })

    return entries
}

const gotWhitelist = () => {

}

const madeModifications = () => {

}

const catchErrors = (err) => {
    err.response.code ? err = err.response.code : null
    handleError(err)
}

const queries = {
    add:
        `mutation {
            addWhitelistEntries(
                organizationId: $org
                policyId: $policy
                whitelistEntries: [
                    $entries
                ]
            ){
                name
                version
            }
        }`,
    delete:
        `mutation {
            deleteWhitelistEntries(
                    organizationId: $org
                    policyId: $policy
                    whitelistEntries: [
                    $entries
                ]
            ){
                name
                version
            }
        }`,
    get: 
        `query($org: String!) {
            policies(organizationId: $org) {
                whitelist {
                    name
                    version
                }
            }
        }`,
    package:
        `{
            package(name: $package) {
                name
                versions {
                    name
                    version
                    score
                    results {
                        name
                        severity
                        test
                        pass
                        value
                    }
                    vulnerabilities {
                        id
                        title
                        semver {
                            vulnerable
                        }
                        severity
                    }
                }
            }
        }`
}
