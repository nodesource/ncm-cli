'use strict'

const { exec } = require('child_process')
const path = require('path')
const { test } = require('tap')

const NCM_BIN = path.join(__dirname, '..', 'bin', 'ncm-cli.js')
const MOCK_PROJECT = '--dir=./test/fixtures/mock-project'

test('report output matches snapshot', (t) =>
  exec(`node ${NCM_BIN} report ${MOCK_PROJECT} --color=16m`, {
    env: Object.assign({ FORCE_COLOR: 3 }, process.env)
  }, (err, stdout, stderr) => {
    t.equal(err.code, 1)
    t.notOk(stderr)
    t.matchSnapshot(stdout, 'report-output')
    t.ok(/mock-project Report/.test(stdout))
    t.ok(/8 .+packages checked/.test(stdout))
    t.ok(/chalk @ 2.4.2/.test(stdout))
    t.notOk(/has-flag @ 3.0.0/.test(stdout))

    const out = stdout.toString()
    t.ok(/1 noncompliant modules found/.test(out))
    t.ok(/0 security vulnerabilities found/.test(out))
    t.end()
  })
)

test('report --compliance output', (t) =>
  exec(`node ${NCM_BIN} report --compliance --color=16m`, {
    env: Object.assign({ FORCE_COLOR: 3 }, process.env)
  }, (err, stdout, stderr) => {
    t.equal(err.code, 1)
    t.notOk(stderr)
    t.matchSnapshot(stdout, 'report-output-compliance')

    const out = stdout.toString()
    t.ok(/3 noncompliant modules found/.test(out))
    t.ok(/spdx-exceptions @ 2.2.0/.test(out))
    t.ok(/spdx-license-ids @ 3.0.2/.test(out))
    t.ok(/tweetnacl @ 0.14.5/.test(out))
    t.ok(/CC-BY-3.0/.test(out))
    t.ok(/CC0-1.0/.test(out))
    t.ok(/0 security vulnerabilities found/.test(out))
    t.end()
  })
)

test('report output matches snapshot', (t) =>
  exec(`node ${NCM_BIN} report --long ${MOCK_PROJECT} --color=16m`, {
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
