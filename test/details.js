'use strict'

const NCMTestRunner = require('./lib/test-runner.js')

NCMTestRunner.test('details output matches snapshot', (runner, t) => {
  runner.exec('details npm @ 6.8.0', (err, stdout, stderr) => {
    t.equal(err.code, 1)
    t.equal(stderr, '')
    t.matchSnapshot(stdout, 'details-output')
    t.ok(/npm @ 6.8.0/.test(stdout))
    t.ok(/No Security Vulnerabilities/.test(stdout))
    t.ok(/Noncompliant license: Artistic-2.0/.test(stdout))

    t.end()
  })
})

NCMTestRunner.test('details dir output matches snapshot', (runner, t) => {
  runner.exec('details chalk@2.4.2 --dir ./test/fixtures/mock-project', (err, stdout, stderr) => {
    t.equal(err.code, 1)
    t.equal(stderr, '')
    t.matchSnapshot(stdout, 'details-output-dir')
    t.ok(/chalk @ 2.4.2/.test(stdout))

    t.end()
  })
})
