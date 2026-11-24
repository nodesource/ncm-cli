'use strict'

const fs = require('fs')
const os = require('os')
const path = require('path')
const { execFile } = require('child_process')

// Only import what we need, avoid unused imports
const { NCMTestRunner } = require('./lib/test-runner.js')
const NCM_BIN = path.join(__dirname, '..', 'bin', 'ncm-cli.js')
// Far above a run on a loaded machine: the bound only has to stop a run that
// retries forever.
const SPAWN_TIMEOUT = 30000

// Runs `details npm @ 6.8.0` in a fresh config, with `ncmToken` as
// NCM_TOKEN, and checks it answers without asking the sign-in service.
function detailsInFreshConfig (runner, t, ncmToken) {
  t.timeout(SPAWN_TIMEOUT + 10000)
  const configHome = fs.mkdtempSync(path.join(os.tmpdir(), 'ncm-cli-config-'))
  const env = { ...process.env, ...runner.env, NCM_TOKEN: ncmToken, XDG_CONFIG_HOME: configHome }
  return new Promise(/** @type {(resolve: any) => void} */ (resolve) => {
    execFile(process.execPath, [NCM_BIN, 'details', 'npm', '@', '6.8.0', '--color=16m'], { env, timeout: SPAWN_TIMEOUT }, (err, stdout, stderr) => {
      fs.rmSync(configHome, { recursive: true, force: true })
      t.falsy(err?.killed, `details was stopped after ${SPAWN_TIMEOUT} ms`)
      t.is(err?.code, 1)
      t.is(stderr, '')
      t.regex(stdout, /npm @ 6.8.0/)
      t.deepEqual(runner.accountsCalls, [])
      resolve()
    })
  })
}

NCMTestRunner.createTest('details answers when the API refuses NCM_TOKEN, without asking the sign-in service', async (runner, t) => {
  await detailsInFreshConfig(runner, t, 'refused-token')
  // The refused token first, then the same request once more without one.
  t.deepEqual(runner.apiAuthorizations, ['Bearer refused-token', undefined])
})

NCMTestRunner.createTest('details sends no Authorization header without signing in or a token', async (runner, t) => {
  await detailsInFreshConfig(runner, t, '')
  t.deepEqual(runner.apiAuthorizations, [undefined])
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

NCMTestRunner.createTest('details links GHSA advisories to GitHub', (runner, t) => {
  return new Promise(/** @type {(resolve: any) => void} */ (resolve) => {
    runner.exec('details minimist@1.2.5', (err, stdout, stderr) => {
      t.is(err?.code, 1)
      t.is(stderr, '')
      t.regex(stdout, /minimist @ 1\.2\.5/)
      t.regex(stdout, /Versions <1\.2\.6 \(Source: GitHub\)/)
      t.regex(stdout, /https:\/\/github\.com\/advisories\/GHSA-xvch-5gv4-984h/)
      t.notRegex(stdout, /snyk\.io/)
      t.notRegex(stdout, /Synk/)

      resolve()
    })
  })
})

NCMTestRunner.createTest('details links SNYK advisories to Snyk', (runner, t) => {
  return new Promise(/** @type {(resolve: any) => void} */ (resolve) => {
    runner.exec('details handlebars@4.0.5', (err, stdout, stderr) => {
      t.is(err?.code, 1)
      t.is(stderr, '')
      t.regex(stdout, /handlebars @ 4\.0\.5/)
      t.regex(stdout, /Versions <4\.0\.13 \(Source: Snyk\)/)
      t.regex(stdout, /https:\/\/snyk\.io\/vuln\/SNYK-JS-HANDLEBARS-173692/)
      t.notRegex(stdout, /Synk/)

      resolve()
    })
  })
})

NCMTestRunner.createTest('details links legacy npm:* advisories to Snyk', (runner, t) => {
  return new Promise(/** @type {(resolve: any) => void} */ (resolve) => {
    runner.exec('details debug@2.2.0', (err, stdout, stderr) => {
      t.is(err?.code, 1)
      t.is(stderr, '')
      t.regex(stdout, /debug @ 2\.2\.0/)
      t.regex(stdout, /Versions >=1\.0\.0 <2\.6\.9 >=3\.0\.0 <3\.1\.0 \(Source: Snyk\)/)
      t.regex(stdout, /https:\/\/snyk\.io\/vuln\/npm:debug:20170905/)
      t.notRegex(stdout, /Synk/)

      resolve()
    })
  })
})
