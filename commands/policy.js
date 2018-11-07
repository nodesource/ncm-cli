#!/usr/bin/env node

'use strict'

const { graphql, handleError } = require('../lib/tools')
const config = require('../lib/config')

const NCM_API = 'https://api.nodesource.com/ncm2/api/v1'

const managePolicySet = (argv) => {

    let action = (argv['_'][1] ? argv['_'][1].toLowerCase() : null)

    let entries = []
    argv['_'].forEach((pkg, ind) => {
        if(ind > 1 && pkg.includes('@')) {
            entries.push({ name: pkg.split('@')[0], version: pkg.split('@')[1] })
        } else if (ind > 1) {
            console.log(`Please specify a version to whitelist for pkg: ${pkg}`)
        }
    })
    
    switch(action) {
        case "add":
            modifyWhitelistEntries(action, entries)
            break;
        case "del":
            break;
        default:
            getWhitelist()
            break;
    }

    return true
}

const getWhitelist = async() => {

    let token = config.modifyState({ '_': ['config', 'get', 'token'] })
    let orgId = config.modifyState({ '_': ['config', 'get', 'org'] })

    if(!token || !orgId) handleError('No valid token or org id!')

    let options = {
        token: token,
        url: NCM_API
    }

    let query = queries.get

    let vars = { orgId }

    const data = await graphql(options, query, vars)

    console.log(JSON.stringify(data))
}

const getPackageData = async({ pkg, version }) => {

    let token = config.modifyState(['get', 'token'])

    if(!token) handleError('No valid token!')

    let options = {
        token: token,
        url: NCM_API
    }

    let query = queries.package

    let vars = { pkg }

    let data
    if(options && query && vars) data = await graphql(options, query, vars)
 
    console.log(JSON.stringify(data ? data : handleError("graphql parameters unmet")))
}

const modifyWhitelistEntries = async(action, entries) => {

    let { token, org, policy } = config.getFields(['token', 'org', 'policy'])

    if(!token) handleError('No valid token!')

    let options = {
        token: token,
        url: NCM_API
    }

    let query
    switch(action) {
        case "add":
            query = queries.add
            break;
        case "delete":
            query = queries.delete
        default:
            break;
    }

    let vars = { org, policy, entries }

    let data
    if(options && query && vars) data = await graphql(options, query, vars)

    console.log(JSON.stringify(data ? data : { error: "graphql parameters unmet"}))
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
        `query($orgId: String!) {
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

module.exports = {
    getWhitelist: getWhitelist,
    modifyWhitelistEntries: modifyWhitelistEntries,
    managePolicySet: managePolicySet,
}

