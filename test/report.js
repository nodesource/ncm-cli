'use strict'

// Import the correct test runner class
const { NCMTestRunner } = require('./lib/test-runner.js')
const MOCK_PROJECT = '--dir=./test/fixtures/mock-project'
const POISONED_PROJECT = '--dir=./test/fixtures/poisoned-project'

NCMTestRunner.createTest('report output matches snapshot', (runner, t) => {
  return new Promise(/** @type {(resolve: any) => void} */ (resolve) => {
    runner.exec(`report ${MOCK_PROJECT}`, (err, stdout, stderr) => {
      t.is(err.code, 1)
      t.is(stderr, '')
      t.snapshot(stdout, 'report-output')
      t.regex(stdout, /mock-project Report/)
      t.regex(stdout, /36 .+packages checked/)
      t.regex(stdout, /handlebars @ 4.0.5/)
      t.notRegex(stdout, /has-flag @ 3.0.0/)
      t.regex(stdout, /2 noncompliant modules found/)
      t.regex(stdout, /3 security vulnerabilities found/)
      resolve()
    })
  })
})

NCMTestRunner.createTest('report --compliance output', (runner, t) => {
  return new Promise(/** @type {(resolve: any) => void} */ (resolve) => {
    runner.exec(`report ${MOCK_PROJECT} --compliance`,
      (err, stdout, stderr) => {
        t.is(err.code, 1)
        t.is(stderr, '')
        t.snapshot(stdout, 'report-output-compliance')

        const out = stdout.toString()
        t.regex(out, /2 noncompliant modules found/)
        t.regex(out, /left-pad @ 1.3.0/)
        t.regex(out, /ms @ 0.7.1/)
        t.regex(out, /WTFPL/)
        t.regex(out, /UNKNOWN/)
        t.regex(out, /3 security vulnerabilities found/)
        resolve()
      })
  })
})

NCMTestRunner.createTest('report -c output', (runner, t) => {
  return new Promise(/** @type {(resolve: any) => void} */ (resolve) => {
    runner.exec(`report ${MOCK_PROJECT} -c`, (err, stdout, stderr) => {
      t.is(err.code, 1)
      t.is(stderr, '')
      t.snapshot(stdout, 'report-output-compliance')

      const out = stdout.toString()
      t.regex(out, /2 noncompliant modules found/)
      t.regex(out, /left-pad @ 1.3.0/)
      t.regex(out, /WTFPL/)
      t.regex(out, /3 security vulnerabilities found/)
      resolve()
    })
  })
})

NCMTestRunner.createTest('report --filter=compliance output', (runner, t) => {
  return new Promise(/** @type {(resolve: any) => void} */ (resolve) => {
    const cmd = `report ${MOCK_PROJECT} --filter=compliance`
    runner.exec(cmd, (err, stdout, stderr) => {
      t.is(err.code, 1)
      t.is(stderr, '')
      t.snapshot(stdout, 'report-output-compliance')

      const out = stdout.toString()
      t.regex(out, /2 noncompliant modules found/)
      t.regex(out, /left-pad @ 1.3.0/)
      t.regex(out, /ms @ 0.7.1/)
      t.regex(out, /WTFPL/)
      t.regex(out, /UNKNOWN/)
      t.regex(out, /3 security vulnerabilities found/)
      resolve()
    })
  })
})

NCMTestRunner.createTest('report --security output', (runner, t) => {
  return new Promise(/** @type {(resolve: any) => void} */ (resolve) => {
    runner.exec(`report ${MOCK_PROJECT} --security`, (err, stdout, stderr) => {
      t.is(err.code, 1)
      t.is(stderr, '')
      t.snapshot(stdout, 'report-output-security')

      const out = stdout.toString()
      t.regex(out, /2 noncompliant modules found/)
      t.regex(out, /3 security vulnerabilities found/)
      t.regex(out, /handlebars @ 4.0.5/)
      t.regex(out, /ms @ 0.7.1/)
      t.regex(out, /brace-expansion @ 1.1.2/)
      t.regex(out, /debug @ 2.2.0/)
      t.regex(out, /1H/)
      t.regex(out, /1M/)
      t.regex(out, /1L/)
      resolve()
    })
  })
})

NCMTestRunner.createTest('report -s output', (runner, t) => {
  return new Promise(/** @type {(resolve: any) => void} */ (resolve) => {
    runner.exec(`report ${MOCK_PROJECT} -s`, (err, stdout, stderr) => {
      t.is(err.code, 1)
      t.is(stderr, '')
      t.snapshot(stdout, 'report-output-security')

      const out = stdout.toString()
      t.regex(out, /2 noncompliant modules found/)
      t.regex(out, /3 security vulnerabilities found/)
      t.regex(out, /handlebars @ 4.0.5/)
      t.regex(out, /1H/)
      resolve()
    })
  })
})

NCMTestRunner.createTest('report --filter=security output', (runner, t) => {
  return new Promise(/** @type {(resolve: any) => void} */ (resolve) => {
    runner.exec(`report ${MOCK_PROJECT} --filter=security`, (err, stdout, stderr) => {
      t.is(err.code, 1)
      t.is(stderr, '')
      t.snapshot(stdout, 'report-output-security')

      const out = stdout.toString()
      t.regex(out, /2 noncompliant modules found/)
      t.regex(out, /3 security vulnerabilities found/)
      t.regex(out, /handlebars @ 4.0.5/)
      t.regex(out, /ms @ 0.7.1/)
      t.regex(out, /brace-expansion @ 1.1.2/)
      t.regex(out, /debug @ 2.2.0/)
      t.regex(out, /1H/)
      t.regex(out, /1M/)
      t.regex(out, /1L/)
      resolve()
    })
  })
})

NCMTestRunner.createTest('report --filter=high --security output', (runner, t) => {
  return new Promise(/** @type {(resolve: any) => void} */ (resolve) => {
    const cmd = `report ${MOCK_PROJECT} --filter=high --security`
    runner.exec(cmd, (err, stdout, stderr) => {
      t.is(err.code, 1)
      t.is(stderr, '')
      t.snapshot(stdout, 'report-output-high-security')

      const out = stdout.toString()
      t.regex(out, /2 noncompliant modules found/)
      t.regex(out, /3 security vulnerabilities found/)
      t.regex(out, /handlebars @ 4.0.5/)
      t.notRegex(out, /ms @ 0.7.1/)
      t.notRegex(out, /brace-expansion @ 1.1.2/)
      t.notRegex(out, /debug @ 2.2.0/)
      t.regex(out, /1H/)
      t.notRegex(out, /1M/)
      t.notRegex(out, /1L/)
      resolve()
    })
  })
})

NCMTestRunner.createTest('report --filter=high output', (runner, t) => {
  return new Promise(/** @type {(resolve: any) => void} */ (resolve) => {
    const cmd = `report ${MOCK_PROJECT} --filter=high`
    runner.exec(cmd, (err, stdout, stderr) => {
      t.is(err.code, 1)
      t.is(stderr, '')
      t.snapshot(stdout, 'report-output-high-security')

      const out = stdout.toString()
      t.regex(out, /2 noncompliant modules found/)
      t.regex(out, /3 security vulnerabilities found/)
      t.regex(out, /handlebars @ 4.0.5/)
      t.notRegex(out, /ms @ 0.7.1/)
      t.notRegex(out, /brace-expansion @ 1.1.2/)
      t.notRegex(out, /debug @ 2.2.0/)
      t.regex(out, /1H/)
      t.notRegex(out, /1M/)
      t.notRegex(out, /1L/)
      resolve()
    })
  })
})

NCMTestRunner.createTest('report --filter=h output', (runner, t) => {
  return new Promise(/** @type {(resolve: any) => void} */ (resolve) => {
    const cmd = `report ${MOCK_PROJECT} --filter=h --color=16m`
    runner.exec(cmd, (err, stdout, stderr) => {
      t.is(err.code, 1)
      t.is(stderr, '')
      t.snapshot(stdout, 'report-output-high-security')

      const out = stdout.toString()
      t.regex(out, /2 noncompliant modules found/)
      t.regex(out, /3 security vulnerabilities found/)
      t.regex(out, /handlebars @ 4.0.5/)
      t.notRegex(out, /ms @ 0.7.1/)
      t.notRegex(out, /brace-expansion @ 1.1.2/)
      t.notRegex(out, /debug @ 2.2.0/)
      t.regex(out, /1H/)
      t.notRegex(out, /1M/)
      t.notRegex(out, /1L/)
      resolve()
    })
  })
})

NCMTestRunner.createTest('report --filter=high,security output', (runner, t) => {
  return new Promise(/** @type {(resolve: any) => void} */ (resolve) => {
    const cmd = `report ${MOCK_PROJECT} --filter=high,security`
    runner.exec(cmd, (err, stdout, stderr) => {
      t.is(err.code, 1)
      t.is(stderr, '')
      t.snapshot(stdout, 'report-output-high-security')

      const out = stdout.toString()
      t.regex(out, /2 noncompliant modules found/)
      t.regex(out, /3 security vulnerabilities found/)
      t.regex(out, /handlebars @ 4.0.5/)
      t.notRegex(out, /ms @ 0.7.1/)
      t.notRegex(out, /brace-expansion @ 1.1.2/)
      t.notRegex(out, /debug @ 2.2.0/)
      t.regex(out, /1H/)
      t.notRegex(out, /1M/)
      t.notRegex(out, /1L/)
      resolve()
    })
  })
})

NCMTestRunner.createTest('report --filter=medium --security output', (runner, t) => {
  return new Promise(/** @type {(resolve: any) => void} */ (resolve) => {
    const cmd = `report ${MOCK_PROJECT} --filter=medium --security`
    runner.exec(cmd, (err, stdout, stderr) => {
      t.is(err.code, 1)
      t.is(stderr, '')
      t.snapshot(stdout, 'report-output-med-security')

      const out = stdout.toString()
      t.regex(out, /2 noncompliant modules found/)
      t.regex(out, /3 security vulnerabilities found/)
      t.regex(out, /handlebars @ 4.0.5/)
      t.notRegex(out, /ms @ 0.7.1/)
      t.regex(out, /brace-expansion @ 1.1.2/)
      t.notRegex(out, /debug @ 2.2.0/)
      t.regex(out, /1H/)
      t.regex(out, /1M/)
      t.notRegex(out, /1L/)
      resolve()
    })
  })
})

NCMTestRunner.createTest('report --filter=m --security output', (runner, t) => {
  return new Promise(/** @type {(resolve: any) => void} */ (resolve) => {
    const cmd = `report ${MOCK_PROJECT} --filter=m --security`
    runner.exec(cmd, (err, stdout, stderr) => {
      t.is(err.code, 1)
      t.is(stderr, '')
      t.snapshot(stdout, 'report-output-med-security')

      const out = stdout.toString()
      t.regex(out, /2 noncompliant modules found/)
      t.regex(out, /3 security vulnerabilities found/)
      t.regex(out, /handlebars @ 4.0.5/)
      t.notRegex(out, /ms @ 0.7.1/)
      t.regex(out, /brace-expansion @ 1.1.2/)
      t.notRegex(out, /debug @ 2.2.0/)
      t.regex(out, /1H/)
      t.regex(out, /1M/)
      t.notRegex(out, /1L/)
      resolve()
    })
  })
})

NCMTestRunner.createTest('report --filter=low --security output', (runner, t) => {
  return new Promise(/** @type {(resolve: any) => void} */ (resolve) => {
    const cmd = `report ${MOCK_PROJECT} --filter=low --security`
    runner.exec(cmd, (err, stdout, stderr) => {
      t.is(err.code, 1)
      t.is(stderr, '')
      t.snapshot(stdout, 'report-output-med-security')

      const out = stdout.toString()
      t.regex(out, /2 noncompliant modules found/)
      t.regex(out, /3 security vulnerabilities found/)
      t.regex(out, /handlebars @ 4.0.5/)
      t.regex(out, /ms @ 0.7.1/)
      t.regex(out, /brace-expansion @ 1.1.2/)
      t.regex(out, /debug @ 2.2.0/)
      t.regex(out, /1H/)
      t.regex(out, /1M/)
      t.regex(out, /1L/)
      resolve()
    })
  })
})

NCMTestRunner.createTest('report --filter=l --security output', (runner, t) => {
  return new Promise(/** @type {(resolve: any) => void} */ (resolve) => {
    const cmd = `report ${MOCK_PROJECT} --filter=l --security`
    runner.exec(cmd, (err, stdout, stderr) => {
      t.is(err.code, 1)
      t.is(stderr, '')
      t.snapshot(stdout, 'report-output-med-security')

      const out = stdout.toString()
      t.regex(out, /2 noncompliant modules found/)
      t.regex(out, /3 security vulnerabilities found/)
      t.regex(out, /handlebars @ 4.0.5/)
      t.regex(out, /ms @ 0.7.1/)
      t.regex(out, /brace-expansion @ 1.1.2/)
      t.regex(out, /debug @ 2.2.0/)
      t.regex(out, /1H/)
      t.regex(out, /1M/)
      t.regex(out, /1L/)
      resolve()
    })
  })
})

NCMTestRunner.createTest('report --long output matches snapshot', (runner, t) => {
  return new Promise(/** @type {(resolve: any) => void} */ (resolve) => {
    runner.exec(`report --long ${MOCK_PROJECT}`, (err, stdout, stderr) => {
      t.is(err.code, 1)
      t.is(stderr, '')
      t.snapshot(stdout, 'long-report-output')
      t.regex(stdout, /mock-project Report/)
      t.regex(stdout, /has-flag @ 3.0.0/)
      resolve()
    })
  })
})

NCMTestRunner.createTest('report with poisoned project', (runner, t) => {
  return new Promise(/** @type {(resolve: any) => void} */ (resolve) => {
    const cmd = `report --long ${POISONED_PROJECT}`
    runner.exec(cmd, (err, stdout, stderr) => {
      t.is(err.code, 1)
      t.is(stderr, '')
      t.snapshot(stdout, 'long-report-poisoned-output')
      t.regex(stdout, /poisoned-project Report/)
      t.regex(stdout, /left-pad @ 1.3.0/)
      resolve()
    })
  })
})
