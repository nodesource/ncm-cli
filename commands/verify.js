#!/usr/bin/env node

'use strict'

const analyze = require('ncm-analyze-tree')
const config = require('../lib/config')
const { scoreReport, handleError } = require('../lib/tools')

module.exports = verify

function verify(argv) {

    let { json, output, dir, report } = argv 
    let tokens = config.getTokens()

    crawl(tokens, dir)
    .then(({ scores, failures }) => {
        if(report) scoreReport(scores)
        if(json) null
        if(output) null
    })
    .catch(handleError)

    return true
}


const crawl = async({ session }, dir) => {

    // start position logic
    if(!dir) dir = __dirname + '/..'

    const f = new Set()
    const r = new Set()

    const data = await analyze({
        dir: dir,
        token: session
    })

    for (const pkg of data) {
        r[pkg.name] = { name: pkg.name, version: pkg.version, score: pkg.score }
        pkg.results.forEach(result => {
            if(!result.pass) {
                f[pkg.name] ? f[pkg.name].push(result) : f[pkg.name] = [result]
            }
        })
    }

    return { scores: r, failures: f }
}