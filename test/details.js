'use strict'

const fs = require('fs')
const os = require('os')
const path = require('path')
const { execFile } = require('child_process')

// Only import what we need, avoid unused imports
const { NCMTestRunner } = require('./lib/test-runner.js')
const NCM_BIN = path.join(__dirname, '..', 'bin', 'ncm-cli.js')

NCMTestRunner.createTest('details answers when the API refuses NCM_TOKEN, without asking NodeSource Accounts', (runner, t) => {
  const configHome = fs.mkdtempSync(path.join(os.tmpdir(), 'ncm-cli-config-'))
  const env = { ...process.env, ...runner.env, NCM_TOKEN: 'refused-token', XDG_CONFIG_HOME: configHome }
  return new Promise(/** @type {(resolve: any) => void} */ (resolve) => {
    // The timeout stops a run that retries forever.
    execFile(process.execPath, [NCM_BIN, 'details', 'npm', '@', '6.8.0', '--color=16m'], { env, timeout: 8000 }, (err, stdout, stderr) => {
      fs.rmSync(configHome, { recursive: true, force: true })
      t.is(err?.code, 1)
      t.is(stderr, '')
      t.regex(stdout, /npm @ 6.8.0/)
      t.deepEqual(runner.accountsCalls, [])
      resolve()
    })
  })
})

// Use the new createTest helper function to create tests with the runner
NCMTestRunner.createTest('details output matches snapshot', (runner, t) => {
  return new Promise(/** @type {(resolve: any) => void} */ (resolve) => {
    runner.exec('details npm @ 6.8.0', (err, stdout, stderr) => {
      t.is(err?.code, 1)
      t.is(stderr, '')
      t.snapshot(stdout)
      t.regex(stdout, /npm @ 6.8.0/)
      t.regex(stdout, /No Security Vulnerabilities/)
      t.regex(stdout, /Noncompliant license: Artistic-2.0/)

      resolve()
    })
  })
})

NCMTestRunner.createTest('details dir output matches snapshot', (runner, t) => {
  return new Promise(/** @type {(resolve: any) => void} */ (resolve) => {
    runner.exec('details chalk@2.4.2 --dir ./test/fixtures/mock-project', (err, stdout, stderr) => {
      t.is(err?.code, 1)
      t.is(stderr, '')
      t.snapshot(stdout)
      t.regex(stdout, /chalk @ 2.4.2/)

      resolve()
    })
  })
})
