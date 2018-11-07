#!/usr/bin/env node

'use strict'

const logger = require('./logger')
const { GraphQLClient } = require('graphql-request')
const https = require('https')

module.exports = {
    makeRequest: makeRequest,
    graphql: graphql,
    scoreReport: scoreReport,
    handleError: handleError
}

function makeRequest(options, fn) {

    const { headers } = options || { 'Content-Type': 'application/json' }
    const reqOptions = Object.assign({}, options, { json: true, headers })

    var data = ''

    https.request(reqOptions, (res) => {
        res
        .on('data', (chunk) => data += chunk)
        .on('end', () => {
            try { fn(null, JSON.parse(data)) } 
            catch (err) { fn(err) }
        })
    })
    .on('error', (err) => {
        fn(err)
    })
    .end()
}

function graphql(options, query, vars) {
    if (typeof options === 'string') {
        options = { options }
    }

    const client = new GraphQLClient(options.url, {
        headers: {
            Authorization: `Bearer ${options.token}`
        }
    })

    return client.request(query, vars)
}

function scoreReport(report) {

    let width = 70

    const logggerBar = () => logger([{ text: `╟${'—'.repeat(width * 0.55)}┼${'—'.repeat(width * 0.25 - 1)}┼${'—'.repeat(width * 0.20 - 1)}╢`, style: 'table' }])
    const loggerTableHeader = () => logger([{ text: `╔${'═'.repeat(width * 0.55)}╤${'═'.repeat(width * 0.25 - 1)}╤${'═'.repeat(width * 0.20 - 1)}╗`, style: 'table' }])
    const loggerTableFooter = () => logger([{ text: `╚${'═'.repeat(width * 0.55)}╧${'═'.repeat(width * 0.25 - 1)}╧${'═'.repeat(width * 0.20 - 1)}╝`, style: 'table' }])
    const loggerTableTitle = () => logger([
        { text: `║`, style: 'table' },
        { text: `${' '.repeat(width * 0.05)}Package`, style: 'title' },
        { text: `${' '.repeat(Math.floor(width * 0.50 - 7))}|`, style: 'table' },
        { text: `${' '.repeat(width * 0.05)}Version`, style: 'title' },
        { text: `${' '.repeat(Math.floor(width * 0.20  - 8))}|`, style: 'table' },
        { text: `${' '.repeat(width * 0.05)}Score`, style: 'title' },
        { text: `${' '.repeat(Math.floor(width * 0.10 - 2))}║`, style: 'table' },
    ])
    const loggerPackageDetails = (pkg) => logger([
        { text: `║`, style: 'table' },
        { text: `${' '.repeat(width * 0.05)}${pkg.name}`, style: [] },
        { text: `${' '.repeat(Math.floor(width * 0.50 - (pkg.name.length)))}|`, style: 'table' },
        { text: `${' '.repeat(width * 0.05)}${pkg.version}`, style: [] },
        { text: `${' '.repeat(Math.floor(width * 0.20  - (pkg.version.length) - 1))}|`, style: 'table' },
        { text: `${' '.repeat(width * 0.05)}${pkg.score}`, style: pkg.score < 50 ? ['red', 'bold'] : [] },
        { text: `${' '.repeat(width * 0.10 + 3 - String(pkg.score).length)}║`, style: 'table' },
    ])

    logger([{ text: 'NCM-CLI', style: 'ncm' }])
    loggerTableHeader()
    loggerTableTitle()
    for(let pkg in report) {
        pkg = report[pkg]
        if(pkg.name.length > width * 0.40) pkg.name = `${pkg.name.slice(0, width * 40)}..`
        logggerBar()
        loggerPackageDetails(pkg)
    }
    loggerTableFooter()
}

function handleError(err) {
    logger([{ text: '\nError occurred -- todo\n', style: 'error'}])
}
