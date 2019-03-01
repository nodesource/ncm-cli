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
    t.ok(/32 .+packages checked/.test(stdout))
    t.ok(/chalk @ 2.4.2/.test(stdout))
    t.notOk(/has-flag @ 3.0.0/.test(stdout))

    const out = stdout.toString()
    t.ok(/1 noncompliant modules found/.test(out))
    t.ok(/1 security vulnerabilities found/.test(out))
    t.end()
  })
)

test('report --compliance output', (t) =>
  exec(`node ${NCM_BIN} report ${MOCK_PROJECT} --compliance --color=16m`, {
    env: Object.assign({ FORCE_COLOR: 3 }, process.env)
  }, (err, stdout, stderr) => {
    t.equal(err.code, 1)
    t.notOk(stderr)
    t.matchSnapshot(stdout, 'report-output-compliance')

    const out = stdout.toString()
    t.ok(/1 noncompliant modules found/.test(out))
    t.ok(/left-pad @ 1.3.0/.test(out))
    t.ok(/WTFPL/.test(out))
    t.ok(/1 security vulnerabilities found/.test(out))
    t.end()
  })
)

test('report -c output', (t) =>
  exec(`node ${NCM_BIN} report ${MOCK_PROJECT} -c --color=16m`, {
    env: Object.assign({ FORCE_COLOR: 3 }, process.env)
  }, (err, stdout, stderr) => {
    t.equal(err.code, 1)
    t.notOk(stderr)
    t.matchSnapshot(stdout, 'report-output-compliance')

    const out = stdout.toString()
    t.ok(/1 noncompliant modules found/.test(out))
    t.ok(/left-pad @ 1.3.0/.test(out))
    t.ok(/WTFPL/.test(out))
    t.ok(/1 security vulnerabilities found/.test(out))
    t.end()
  })
)

test('report --security output', (t) =>
  exec(`node ${NCM_BIN} report ${MOCK_PROJECT} --security --color=16m`, {
    env: Object.assign({ FORCE_COLOR: 3 }, process.env)
  }, (err, stdout, stderr) => {
    t.equal(err.code, 1)
    t.notOk(stderr)
    t.matchSnapshot(stdout, 'report-output-security')

    const out = stdout.toString()
    t.ok(/1 noncompliant modules found/.test(out))
    t.ok(/1 security vulnerabilities found/.test(out))
    t.ok(/handlebars @ 4.0.5/.test(out))
    t.ok(/1H/.test(out))
    t.end()
  })
)

test('report -s output', (t) =>
  exec(`node ${NCM_BIN} report ${MOCK_PROJECT} -s --color=16m`, {
    env: Object.assign({ FORCE_COLOR: 3 }, process.env)
  }, (err, stdout, stderr) => {
    t.equal(err.code, 1)
    t.notOk(stderr)
    t.matchSnapshot(stdout, 'report-output-security')

    const out = stdout.toString()
    t.ok(/1 noncompliant modules found/.test(out))
    t.ok(/1 security vulnerabilities found/.test(out))
    t.ok(/handlebars @ 4.0.5/.test(out))
    t.ok(/1H/.test(out))
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
