'use strict'

const TestRunner = require('./lib/test-runner.js')
const MOCK_PROJECT = '--dir=./test/fixtures/mock-project'

TestRunner.test('report output matches snapshot', (runner, t) =>
  runner.exec(`report ${MOCK_PROJECT}`, (err, stdout, stderr) => {
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

TestRunner.test('report --compliance output', (runner, t) =>
  runner.exec(`report ${MOCK_PROJECT} --compliance`, 
    (err, stdout, stderr) => {
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

TestRunner.test('report -c output', (runner, t) =>
  runner.exec(`report ${MOCK_PROJECT} -c`, (err, stdout, stderr) => {
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

TestRunner.test('report --filter=compliance output', (runner, t) => {
  const cmd = `report ${MOCK_PROJECT} --filter=compliance`
  runner.exec(cmd, (err, stdout, stderr) => {
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

TestRunner.test('report --security output', (runner, t) =>
  runner.exec(`report ${MOCK_PROJECT} --security`, (err, stdout, stderr) => {
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

TestRunner.test('report -s output', (runner, t) =>
  runner.exec(`report ${MOCK_PROJECT} -s`, (err, stdout, stderr) => {
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

TestRunner.test('report --filter=security output', (runner, t) =>
  runner.exec(`report ${MOCK_PROJECT} --filter=security`,
    (err, stdout, stderr) => {
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

TestRunner.test('report --filter=high --security output', (runner, t) => {
  let cmd = `report ${MOCK_PROJECT} --filter=high --security`
  runner.exec(cmd, (err, stdout, stderr) => {
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

TestRunner.test('report --filter=high output', (runner, t) => {
  let cmd = `report ${MOCK_PROJECT} --filter=high`
  runner.exec(cmd, (err, stdout, stderr) => {
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

TestRunner.test('report --filter=h output', (runner, t) => {
  let cmd = `report ${MOCK_PROJECT} --filter=h --color=16m`
  runner.exec(cmd, (err, stdout, stderr) => {
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

TestRunner.test('report --filter=high,security output', (runner, t) => {
  let cmd = `report ${MOCK_PROJECT} --filter=high,security`
  runner.exec(cmd, (err, stdout, stderr) => {
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

TestRunner.test('report --filter=medium --security output', (runner, t) => {
  let cmd = `report ${MOCK_PROJECT} --filter=medium --security`
  runner.exec(cmd, (err, stdout, stderr) => {
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

TestRunner.test('report --filter=m --security output', (runner, t) => {
  let cmd = `report ${MOCK_PROJECT} --filter=m --security`
  runner.exec(cmd, (err, stdout, stderr) => {
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

TestRunner.test('report --filter=low --security output', (runner, t) => {
  let cmd = `report ${MOCK_PROJECT} --filter=low --security`
  runner.exec(cmd, (err, stdout, stderr) => {
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

TestRunner.test('report --filter=l --security output', (runner, t) => {
  let cmd = `report ${MOCK_PROJECT} --filter=l --security`
  runner.exec(cmd, (err, stdout, stderr) => {
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

TestRunner.test('report output matches snapshot', (runner, t) =>
  runner.exec(`report --long ${MOCK_PROJECT}`, (err, stdout, stderr) => {
    t.equal(err.code, 1)
    t.notOk(stderr)
    t.matchSnapshot(stdout, 'long-report-output')
    t.ok(/mock-project Report/.test(stdout))
    t.ok(/has-flag @ 3.0.0/.test(stdout))
    t.end()
  })
)
