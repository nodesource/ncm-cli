'use strict'

const { exec } = require('child_process')
const path = require('path')
const { test } = require('tap')

const NCM_BIN = path.join(__dirname, '..', 'bin', 'ncm-cli.js')

test('report output matches snapshot', (t) =>
  exec(`node ${NCM_BIN} report --dir=./test/fixtures/mock-project --color=16m`, {
    env: Object.assign({ FORCE_COLOR: 3 }, process.env)
  }, (err, stdout, stderr) => {
    t.equal(err.code, 1)
    t.notOk(stderr)
    t.matchSnapshot(stdout, 'report-output')
    t.ok(/mock-project Report/.test(stdout))
    t.ok(/8 .+packages checked/.test(stdout))
    t.notOk(/has-flag @ 3.0.0/.test(stdout))
    t.end()
  })
)

test('report output matches snapshot', (t) =>
  exec(`node ${NCM_BIN} report --long --dir=./test/fixtures/mock-project --color=16m`, {
    env: Object.assign({ FORCE_COLOR: 3 }, process.env)
  }, (err, stdout, stderr) => {
    t.equal(err.code, 1)
    t.notOk(stderr)
    t.matchSnapshot(stdout, 'long-report-output')
    t.ok(/mock-project Report/.test(stdout))
    t.ok(/has-flag @ 3.0.0/.test(stdout))
    t.end()
  })
)
