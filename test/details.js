'use strict'

const NCMTestRunner = require('./lib/test-runner.js')

NCMTestRunner.test('details output matches snapshot', (runner, t) => {
  runner.exec('details npm@6.8.0', (err, stdout, stderr) => {
    t.equal(err.code, 1)
    t.notOk(stderr)
    t.matchSnapshot(stdout, 'details-output')
    t.ok(/npm @ 6.8.0/.test(stdout))
    t.ok(/No Security Vulnerabilities/.test(stdout))
    t.ok(/Noncompliant license: Artistic-2.0/.test(stdout))

    t.end()
  })
})
