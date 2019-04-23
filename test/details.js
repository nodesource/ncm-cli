'use strict'

const NCMTestRunner = require('./lib/test-runner.js')

NCMTestRunner.test('details output matches snapshot', (runner, t) => {
  runner.exec('details npm @ 6.8.0', (err, stdout, stderr) => {
    t.equal(err.code, 1)
    t.equal(stderr, '')
    t.matchSnapshot(stdout, 'details-output')
    t.match(stdout, /npm @ 6.8.0/)
    t.match(stdout, /No Security Vulnerabilities/)
    t.match(stdout, /Noncompliant license: Artistic-2.0/)

    t.end()
  })
})

NCMTestRunner.test('details dir output matches snapshot', (runner, t) => {
  runner.exec('details chalk@2.4.2 --dir ./test/fixtures/mock-project', (err, stdout, stderr) => {
    t.equal(err.code, 1)
    t.equal(stderr, '')
    t.matchSnapshot(stdout, 'details-output-dir')
    t.match(stdout, /chalk @ 2.4.2/)

    t.end()
  })
})
