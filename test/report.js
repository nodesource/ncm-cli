'use strict'

const TestRunner = require('./lib/test-runner.js')
const MOCK_PROJECT = '--dir=./test/fixtures/mock-project'

TestRunner.test('report output matches snapshot', (runner, t) =>
  runner.exec(`report ${MOCK_PROJECT}`, (err, stdout, stderr) => {
    t.equal(err.code, 1)
    t.equal(stderr, '')
    t.matchSnapshot(stdout, 'report-output')
    t.match(stdout, /mock-project Report/)
    t.match(stdout, /36 .+packages checked/)
    t.match(stdout, /handlebars @ 4.0.5/)
    t.notMatch(stdout, /has-flag @ 3.0.0/)
    t.match(stdout, /2 noncompliant modules found/)
    t.match(stdout, /3 security vulnerabilities found/)
    t.end()
  })
)

TestRunner.test('report is default command', (runner, t) =>
  runner.exec(`${MOCK_PROJECT}`, (err, stdout, stderr) => {
    t.equal(err.code, 1)
    t.equal(stderr, '')
    t.matchSnapshot(stdout, 'report-output')
    t.match(stdout, /mock-project Report/)
    t.match(stdout, /36 .+packages checked/)
    t.match(stdout, /handlebars @ 4.0.5/)
    t.notMatch(stdout, /has-flag @ 3.0.0/)
    t.match(stdout, /2 noncompliant modules found/)
    t.match(stdout, /3 security vulnerabilities found/)
    t.end()
  })
)

TestRunner.test('report --compliance output', (runner, t) =>
  runner.exec(`report ${MOCK_PROJECT} --compliance`,
    (err, stdout, stderr) => {
      t.equal(err.code, 1)
      t.equal(stderr, '')
      t.matchSnapshot(stdout, 'report-output-compliance')

      const out = stdout.toString()
      t.match(out, /2 noncompliant modules found/)
      t.match(out, /left-pad @ 1.3.0/)
      t.match(out, /ms @ 0.7.1/)
      t.match(out, /WTFPL/)
      t.match(out, /UNKNOWN/)
      t.match(out, /3 security vulnerabilities found/)
      t.end()
    })
)

TestRunner.test('report -c output', (runner, t) =>
  runner.exec(`report ${MOCK_PROJECT} -c`, (err, stdout, stderr) => {
    t.equal(err.code, 1)
    t.equal(stderr, '')
    t.matchSnapshot(stdout, 'report-output-compliance')

    const out = stdout.toString()
    t.match(out, /2 noncompliant modules found/)
    t.match(out, /left-pad @ 1.3.0/)
    t.match(out, /WTFPL/)
    t.match(out, /3 security vulnerabilities found/)
    t.end()
  })
)

TestRunner.test('report --filter=compliance output', (runner, t) => {
  const cmd = `report ${MOCK_PROJECT} --filter=compliance`
  runner.exec(cmd, (err, stdout, stderr) => {
    t.equal(err.code, 1)
    t.equal(stderr, '')
    t.matchSnapshot(stdout, 'report-output-compliance')

    const out = stdout.toString()
    t.match(out, /2 noncompliant modules found/)
    t.match(out, /left-pad @ 1.3.0/)
    t.match(out, /ms @ 0.7.1/)
    t.match(out, /WTFPL/)
    t.match(out, /UNKNOWN/)
    t.match(out, /3 security vulnerabilities found/)
    t.end()
  })
})

TestRunner.test('report --security output', (runner, t) =>
  runner.exec(`report ${MOCK_PROJECT} --security`, (err, stdout, stderr) => {
    t.equal(err.code, 1)
    t.equal(stderr, '')
    t.matchSnapshot(stdout, 'report-output-security')

    const out = stdout.toString()
    t.match(out, /2 noncompliant modules found/)
    t.match(out, /3 security vulnerabilities found/)
    t.match(out, /handlebars @ 4.0.5/)
    t.match(out, /ms @ 0.7.1/)
    t.match(out, /brace-expansion @ 1.1.2/)
    t.match(out, /debug @ 2.2.0/)
    t.match(out, /1H/)
    t.match(out, /1M/)
    t.match(out, /1L/)
    t.end()
  })
)

TestRunner.test('report -s output', (runner, t) =>
  runner.exec(`report ${MOCK_PROJECT} -s`, (err, stdout, stderr) => {
    t.equal(err.code, 1)
    t.equal(stderr, '')
    t.matchSnapshot(stdout, 'report-output-security')

    const out = stdout.toString()
    t.match(out, /2 noncompliant modules found/)
    t.match(out, /3 security vulnerabilities found/)
    t.match(out, /handlebars @ 4.0.5/)
    t.match(out, /1H/)
    t.end()
  })
)

TestRunner.test('report --filter=security output', (runner, t) =>
  runner.exec(`report ${MOCK_PROJECT} --filter=security`,
    (err, stdout, stderr) => {
      t.equal(err.code, 1)
      t.equal(stderr, '')
      t.matchSnapshot(stdout, 'report-output-security')

      const out = stdout.toString()
      t.match(out, /2 noncompliant modules found/)
      t.match(out, /3 security vulnerabilities found/)
      t.match(out, /handlebars @ 4.0.5/)
      t.match(out, /ms @ 0.7.1/)
      t.match(out, /brace-expansion @ 1.1.2/)
      t.match(out, /debug @ 2.2.0/)
      t.match(out, /1H/)
      t.match(out, /1M/)
      t.match(out, /1L/)
      t.end()
    })
)

TestRunner.test('report --filter=high --security output', (runner, t) => {
  let cmd = `report ${MOCK_PROJECT} --filter=high --security`
  runner.exec(cmd, (err, stdout, stderr) => {
    t.equal(err.code, 1)
    t.equal(stderr, '')
    t.matchSnapshot(stdout, 'report-output-high-security')

    const out = stdout.toString()
    t.match(out, /2 noncompliant modules found/)
    t.match(out, /3 security vulnerabilities found/)
    t.match(out, /handlebars @ 4.0.5/)
    t.notMatch(out, /ms @ 0.7.1/)
    t.notMatch(out, /brace-expansion @ 1.1.2/)
    t.notMatch(out, /debug @ 2.2.0/)
    t.match(out, /1H/)
    t.notMatch(out, /1M/)
    t.notMatch(out, /1L/)
    t.end()
  })
})

TestRunner.test('report --filter=high output', (runner, t) => {
  let cmd = `report ${MOCK_PROJECT} --filter=high`
  runner.exec(cmd, (err, stdout, stderr) => {
    t.equal(err.code, 1)
    t.equal(stderr, '')
    t.matchSnapshot(stdout, 'report-output-high-security')

    const out = stdout.toString()
    t.match(out, /2 noncompliant modules found/)
    t.match(out, /3 security vulnerabilities found/)
    t.match(out, /handlebars @ 4.0.5/)
    t.notMatch(out, /ms @ 0.7.1/)
    t.notMatch(out, /brace-expansion @ 1.1.2/)
    t.notMatch(out, /debug @ 2.2.0/)
    t.match(out, /1H/)
    t.notMatch(out, /1M/)
    t.notMatch(out, /1L/)
    t.end()
  })
})

TestRunner.test('report --filter=h output', (runner, t) => {
  let cmd = `report ${MOCK_PROJECT} --filter=h --color=16m`
  runner.exec(cmd, (err, stdout, stderr) => {
    t.equal(err.code, 1)
    t.equal(stderr, '')
    t.matchSnapshot(stdout, 'report-output-high-security')

    const out = stdout.toString()
    t.match(out, /2 noncompliant modules found/)
    t.match(out, /3 security vulnerabilities found/)
    t.match(out, /handlebars @ 4.0.5/)
    t.notMatch(out, /ms @ 0.7.1/)
    t.notMatch(out, /brace-expansion @ 1.1.2/)
    t.notMatch(out, /debug @ 2.2.0/)
    t.match(out, /1H/)
    t.notMatch(out, /1M/)
    t.notMatch(out, /1L/)
    t.end()
  })
})

TestRunner.test('report --filter=high,security output', (runner, t) => {
  let cmd = `report ${MOCK_PROJECT} --filter=high,security`
  runner.exec(cmd, (err, stdout, stderr) => {
    t.equal(err.code, 1)
    t.equal(stderr, '')
    t.matchSnapshot(stdout, 'report-output-high-security')

    const out = stdout.toString()
    t.match(out, /2 noncompliant modules found/)
    t.match(out, /3 security vulnerabilities found/)
    t.match(out, /handlebars @ 4.0.5/)
    t.notMatch(out, /ms @ 0.7.1/)
    t.notMatch(out, /brace-expansion @ 1.1.2/)
    t.notMatch(out, /debug @ 2.2.0/)
    t.match(out, /1H/)
    t.notMatch(out, /1M/)
    t.notMatch(out, /1L/)
    t.end()
  })
})

TestRunner.test('report --filter=medium --security output', (runner, t) => {
  let cmd = `report ${MOCK_PROJECT} --filter=medium --security`
  runner.exec(cmd, (err, stdout, stderr) => {
    t.equal(err.code, 1)
    t.equal(stderr, '')
    t.matchSnapshot(stdout, 'report-output-med-security')

    const out = stdout.toString()
    t.match(out, /2 noncompliant modules found/)
    t.match(out, /3 security vulnerabilities found/)
    t.match(out, /handlebars @ 4.0.5/)
    t.notMatch(out, /ms @ 0.7.1/)
    t.match(out, /brace-expansion @ 1.1.2/)
    t.notMatch(out, /debug @ 2.2.0/)
    t.match(out, /1H/)
    t.match(out, /1M/)
    t.notMatch(out, /1L/)
    t.end()
  })
})

TestRunner.test('report --filter=m --security output', (runner, t) => {
  let cmd = `report ${MOCK_PROJECT} --filter=m --security`
  runner.exec(cmd, (err, stdout, stderr) => {
    t.equal(err.code, 1)
    t.equal(stderr, '')
    t.matchSnapshot(stdout, 'report-output-med-security')

    const out = stdout.toString()
    t.match(out, /2 noncompliant modules found/)
    t.match(out, /3 security vulnerabilities found/)
    t.match(out, /handlebars @ 4.0.5/)
    t.notMatch(out, /ms @ 0.7.1/)
    t.match(out, /brace-expansion @ 1.1.2/)
    t.notMatch(out, /debug @ 2.2.0/)
    t.match(out, /1H/)
    t.match(out, /1M/)
    t.notMatch(out, /1L/)
    t.end()
  })
})

TestRunner.test('report --filter=low --security output', (runner, t) => {
  let cmd = `report ${MOCK_PROJECT} --filter=low --security`
  runner.exec(cmd, (err, stdout, stderr) => {
    t.equal(err.code, 1)
    t.equal(stderr, '')
    t.matchSnapshot(stdout, 'report-output-med-security')

    const out = stdout.toString()
    t.match(out, /2 noncompliant modules found/)
    t.match(out, /3 security vulnerabilities found/)
    t.match(out, /handlebars @ 4.0.5/)
    t.match(out, /ms @ 0.7.1/)
    t.match(out, /brace-expansion @ 1.1.2/)
    t.match(out, /debug @ 2.2.0/)
    t.match(out, /1H/)
    t.match(out, /1M/)
    t.match(out, /1L/)
    t.end()
  })
})

TestRunner.test('report --filter=l --security output', (runner, t) => {
  let cmd = `report ${MOCK_PROJECT} --filter=l --security`
  runner.exec(cmd, (err, stdout, stderr) => {
    t.equal(err.code, 1)
    t.equal(stderr, '')
    t.matchSnapshot(stdout, 'report-output-med-security')

    const out = stdout.toString()
    t.match(out, /2 noncompliant modules found/)
    t.match(out, /3 security vulnerabilities found/)
    t.match(out, /handlebars @ 4.0.5/)
    t.match(out, /ms @ 0.7.1/)
    t.match(out, /brace-expansion @ 1.1.2/)
    t.match(out, /debug @ 2.2.0/)
    t.match(out, /1H/)
    t.match(out, /1M/)
    t.match(out, /1L/)
    t.end()
  })
})

TestRunner.test('report output matches snapshot', (runner, t) =>
  runner.exec(`report --long ${MOCK_PROJECT}`, (err, stdout, stderr) => {
    t.equal(err.code, 1)
    t.equal(stderr, '')
    t.matchSnapshot(stdout, 'long-report-output')
    t.match(stdout, /mock-project Report/)
    t.match(stdout, /has-flag @ 3.0.0/)
    t.end()
  })
)
