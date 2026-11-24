'use strict'

// Only import what we need, avoid unused imports
const { NCMTestRunner } = require('./lib/test-runner.js')

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
