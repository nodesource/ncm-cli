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
    t.ok(/37 .+packages checked/.test(stdout))
    t.ok(/handlebars @ 4.0.5/.test(stdout))
    t.notOk(/has-flag @ 3.0.0/.test(stdout))

    const out = stdout.toString()
    t.ok(/2 noncompliant modules found/.test(out))
    t.ok(/4 security vulnerabilities found/.test(out))
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
    t.ok(/2 noncompliant modules found/.test(out))
    t.ok(/left-pad @ 1.3.0/.test(out))
    t.ok(/ms @ 0.7.1/.test(out))
    t.ok(/WTFPL/.test(out))
    t.ok(/UNKNOWN/.test(out))
    t.ok(/4 security vulnerabilities found/.test(out))
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
    t.ok(/2 noncompliant modules found/.test(out))
    t.ok(/left-pad @ 1.3.0/.test(out))
    t.ok(/WTFPL/.test(out))
    t.ok(/4 security vulnerabilities found/.test(out))
    t.end()
  })
)

test('report --filter=compliance output', (t) => {
  const cmd = `node ${NCM_BIN} report ${MOCK_PROJECT} ` +
    '--filter=compliance --color=16m'
  exec(cmd, {
    env: Object.assign({ FORCE_COLOR: 3 }, process.env)
  }, (err, stdout, stderr) => {
    t.equal(err.code, 1)
    t.notOk(stderr)
    t.matchSnapshot(stdout, 'report-output-compliance')

    const out = stdout.toString()
    t.ok(/2 noncompliant modules found/.test(out))
    t.ok(/left-pad @ 1.3.0/.test(out))
    t.ok(/ms @ 0.7.1/.test(out))
    t.ok(/WTFPL/.test(out))
    t.ok(/UNKNOWN/.test(out))
    t.ok(/4 security vulnerabilities found/.test(out))
    t.end()
  })
})

test('report --security output', (t) =>
  exec(`node ${NCM_BIN} report ${MOCK_PROJECT} --security --color=16m`, {
    env: Object.assign({ FORCE_COLOR: 3 }, process.env)
  }, (err, stdout, stderr) => {
    t.equal(err.code, 1)
    t.notOk(stderr)
    t.matchSnapshot(stdout, 'report-output-security')

    const out = stdout.toString()
    t.ok(/2 noncompliant modules found/.test(out))
    t.ok(/4 security vulnerabilities found/.test(out))
    t.ok(/handlebars @ 4.0.5/.test(out))
    t.ok(/ms @ 0.7.1/.test(out))
    t.ok(/brace-expansion @ 1.1.2/.test(out))
    t.ok(/debug @ 2.2.0/.test(out))
    t.ok(/1H/.test(out))
    t.ok(/1M/.test(out))
    t.ok(/1L/.test(out))
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
    t.ok(/2 noncompliant modules found/.test(out))
    t.ok(/4 security vulnerabilities found/.test(out))
    t.ok(/handlebars @ 4.0.5/.test(out))
    t.ok(/1H/.test(out))
    t.end()
  })
)

test('report --filter=security output', (t) =>
  exec(`node ${NCM_BIN} report ${MOCK_PROJECT} --filter=security --color=16m`, {
    env: Object.assign({ FORCE_COLOR: 3 }, process.env)
  }, (err, stdout, stderr) => {
    t.equal(err.code, 1)
    t.notOk(stderr)
    t.matchSnapshot(stdout, 'report-output-security')

    const out = stdout.toString()
    t.ok(/2 noncompliant modules found/.test(out))
    t.ok(/4 security vulnerabilities found/.test(out))
    t.ok(/handlebars @ 4.0.5/.test(out))
    t.ok(/ms @ 0.7.1/.test(out))
    t.ok(/brace-expansion @ 1.1.2/.test(out))
    t.ok(/debug @ 2.2.0/.test(out))
    t.ok(/1H/.test(out))
    t.ok(/1M/.test(out))
    t.ok(/1L/.test(out))
    t.end()
  })
)

test('report --filter=high --security output', (t) => {
  let cmd = `node ${NCM_BIN} report ${MOCK_PROJECT} ` +
    `--filter=high --security --color=16m`
  exec(cmd, {
    env: Object.assign({ FORCE_COLOR: 3 }, process.env)
  }, (err, stdout, stderr) => {
    t.equal(err.code, 1)
    t.notOk(stderr)
    t.matchSnapshot(stdout, 'report-output-high-security')

    const out = stdout.toString()
    t.ok(/2 noncompliant modules found/.test(out))
    t.ok(/4 security vulnerabilities found/.test(out))
    t.ok(/handlebars @ 4.0.5/.test(out))
    t.notOk(/ms @ 0.7.1/.test(out))
    t.notOk(/brace-expansion @ 1.1.2/.test(out))
    t.notOk(/debug @ 2.2.0/.test(out))
    t.ok(/1H/.test(out))
    t.notOk(/1M/.test(out))
    t.notOk(/1L/.test(out))
    t.end()
  })
})

test('report --filter=high output', (t) => {
  let cmd = `node ${NCM_BIN} report ${MOCK_PROJECT} ` +
    `--filter=high --color=16m`
  exec(cmd, {
    env: Object.assign({ FORCE_COLOR: 3 }, process.env)
  }, (err, stdout, stderr) => {
    t.equal(err.code, 1)
    t.notOk(stderr)
    t.matchSnapshot(stdout, 'report-output-high-security')

    const out = stdout.toString()
    t.ok(/2 noncompliant modules found/.test(out))
    t.ok(/4 security vulnerabilities found/.test(out))
    t.ok(/handlebars @ 4.0.5/.test(out))
    t.notOk(/ms @ 0.7.1/.test(out))
    t.notOk(/brace-expansion @ 1.1.2/.test(out))
    t.notOk(/debug @ 2.2.0/.test(out))
    t.ok(/1H/.test(out))
    t.notOk(/1M/.test(out))
    t.notOk(/1L/.test(out))
    t.end()
  })
})

test('report --filter=h output', (t) => {
  let cmd = `node ${NCM_BIN} report ${MOCK_PROJECT} ` +
    `--filter=h --color=16m`
  exec(cmd, {
    env: Object.assign({ FORCE_COLOR: 3 }, process.env)
  }, (err, stdout, stderr) => {
    t.equal(err.code, 1)
    t.notOk(stderr)
    t.matchSnapshot(stdout, 'report-output-high-security')

    const out = stdout.toString()
    t.ok(/2 noncompliant modules found/.test(out))
    t.ok(/4 security vulnerabilities found/.test(out))
    t.ok(/handlebars @ 4.0.5/.test(out))
    t.notOk(/ms @ 0.7.1/.test(out))
    t.notOk(/brace-expansion @ 1.1.2/.test(out))
    t.notOk(/debug @ 2.2.0/.test(out))
    t.ok(/1H/.test(out))
    t.notOk(/1M/.test(out))
    t.notOk(/1L/.test(out))
    t.end()
  })
})

test('report --filter=high,security output', (t) => {
  let cmd = `node ${NCM_BIN} report ${MOCK_PROJECT} ` +
    `--filter=high,security --color=16m`
  exec(cmd, {
    env: Object.assign({ FORCE_COLOR: 3 }, process.env)
  }, (err, stdout, stderr) => {
    t.equal(err.code, 1)
    t.notOk(stderr)
    t.matchSnapshot(stdout, 'report-output-high-security')

    const out = stdout.toString()
    t.ok(/2 noncompliant modules found/.test(out))
    t.ok(/4 security vulnerabilities found/.test(out))
    t.ok(/handlebars @ 4.0.5/.test(out))
    t.notOk(/ms @ 0.7.1/.test(out))
    t.notOk(/brace-expansion @ 1.1.2/.test(out))
    t.notOk(/debug @ 2.2.0/.test(out))
    t.ok(/1H/.test(out))
    t.notOk(/1M/.test(out))
    t.notOk(/1L/.test(out))
    t.end()
  })
})

test('report --filter=medium --security output', (t) => {
  let cmd = `node ${NCM_BIN} report ${MOCK_PROJECT} ` +
    `--filter=medium --security --color=16m`
  exec(cmd, {
    env: Object.assign({ FORCE_COLOR: 3 }, process.env)
  }, (err, stdout, stderr) => {
    t.equal(err.code, 1)
    t.notOk(stderr)
    t.matchSnapshot(stdout, 'report-output-med-security')

    const out = stdout.toString()
    t.ok(/2 noncompliant modules found/.test(out))
    t.ok(/4 security vulnerabilities found/.test(out))
    t.ok(/handlebars @ 4.0.5/.test(out))
    t.notOk(/ms @ 0.7.1/.test(out))
    t.ok(/brace-expansion @ 1.1.2/.test(out))
    t.notOk(/debug @ 2.2.0/.test(out))
    t.ok(/1H/.test(out))
    t.ok(/1M/.test(out))
    t.notOk(/1L/.test(out))
    t.end()
  })
})

test('report --filter=m --security output', (t) => {
  let cmd = `node ${NCM_BIN} report ${MOCK_PROJECT} ` +
    `--filter=m --security --color=16m`
  exec(cmd, {
    env: Object.assign({ FORCE_COLOR: 3 }, process.env)
  }, (err, stdout, stderr) => {
    t.equal(err.code, 1)
    t.notOk(stderr)
    t.matchSnapshot(stdout, 'report-output-med-security')

    const out = stdout.toString()
    t.ok(/2 noncompliant modules found/.test(out))
    t.ok(/4 security vulnerabilities found/.test(out))
    t.ok(/handlebars @ 4.0.5/.test(out))
    t.notOk(/ms @ 0.7.1/.test(out))
    t.ok(/brace-expansion @ 1.1.2/.test(out))
    t.notOk(/debug @ 2.2.0/.test(out))
    t.ok(/1H/.test(out))
    t.ok(/1M/.test(out))
    t.notOk(/1L/.test(out))
    t.end()
  })
})

test('report --filter=low --security output', (t) => {
  let cmd = `node ${NCM_BIN} report ${MOCK_PROJECT} ` +
    `--filter=low --security --color=16m`
  exec(cmd, {
    env: Object.assign({ FORCE_COLOR: 3 }, process.env)
  }, (err, stdout, stderr) => {
    t.equal(err.code, 1)
    t.notOk(stderr)
    t.matchSnapshot(stdout, 'report-output-med-security')

    const out = stdout.toString()
    t.ok(/2 noncompliant modules found/.test(out))
    t.ok(/4 security vulnerabilities found/.test(out))
    t.ok(/handlebars @ 4.0.5/.test(out))
    t.ok(/ms @ 0.7.1/.test(out))
    t.ok(/brace-expansion @ 1.1.2/.test(out))
    t.ok(/debug @ 2.2.0/.test(out))
    t.ok(/1H/.test(out))
    t.ok(/1M/.test(out))
    t.ok(/1L/.test(out))
    t.end()
  })
})

test('report --filter=l --security output', (t) => {
  let cmd = `node ${NCM_BIN} report ${MOCK_PROJECT} ` +
    `--filter=l --security --color=16m`
  exec(cmd, {
    env: Object.assign({ FORCE_COLOR: 3 }, process.env)
  }, (err, stdout, stderr) => {
    t.equal(err.code, 1)
    t.notOk(stderr)
    t.matchSnapshot(stdout, 'report-output-med-security')

    const out = stdout.toString()
    t.ok(/2 noncompliant modules found/.test(out))
    t.ok(/4 security vulnerabilities found/.test(out))
    t.ok(/handlebars @ 4.0.5/.test(out))
    t.ok(/ms @ 0.7.1/.test(out))
    t.ok(/brace-expansion @ 1.1.2/.test(out))
    t.ok(/debug @ 2.2.0/.test(out))
    t.ok(/1H/.test(out))
    t.ok(/1M/.test(out))
    t.ok(/1L/.test(out))
    t.end()
  })
})

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
