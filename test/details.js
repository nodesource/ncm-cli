'use strict'

const { exec } = require('child_process')
const path = require('path')
const { test } = require('tap')

const NCM_BIN = path.join(__dirname, '..', 'bin', 'ncm-cli.js')

test('details output matches snapshot', (t) =>
  exec(`node ${NCM_BIN} details npm@6.8.0 --color=16m`, {
    env: Object.assign({ FORCE_COLOR: 3 }, process.env)
  }, (err, stdout, stderr) => {
    t.equal(err.code, 1)
    t.notOk(stderr)
    t.matchSnapshot(stdout, 'details-output')
    t.ok(/npm @ 6.8.0/.test(stdout))
    t.ok(/No Security Vulnerabilities/.test(stdout))
    t.ok(/Noncompliant license: Artistic-2.0/.test(stdout))
    t.end()
  })
)
