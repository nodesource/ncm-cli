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
