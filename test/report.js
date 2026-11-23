'use strict'

const fs = require('fs')
const os = require('os')
const path = require('path')
const { execFile } = require('child_process')

// Import the correct test runner class
const { NCMTestRunner } = require('./lib/test-runner.js')
const NCM_BIN = path.join(__dirname, '..', 'bin', 'ncm-cli.js')
const MOCK_PROJECT = '--dir=./test/fixtures/mock-project'
const POISONED_PROJECT = '--dir=./test/fixtures/poisoned-project'

NCMTestRunner.createTest('report output matches snapshot', (runner, t) => {
  return new Promise(/** @type {(resolve: any) => void} */ (resolve) => {
    runner.exec(`report ${MOCK_PROJECT}`, (err, stdout, stderr) => {
      t.is(err.code, 1)
      t.is(stderr, '')
      t.snapshot(stdout, 'report-output')
      t.regex(stdout, /mock-project Report/)
      t.regex(stdout, /81 .+packages checked/)
      // Top 5 is now dominated by license-failing packages (all at Crit);
      // verify the cert flow surfaces a license-failing SPDX in that list.
      t.regex(stdout, /AGPL-3\.0-only/)
      t.notRegex(stdout, /has-flag @ 3.0.0/)
      t.regex(stdout, /27 noncompliant modules found/)
      t.regex(stdout, /4 security vulnerabilities found/)
      // The mock org whitelists debug@2.2.0, but report no longer reads it.
      t.notRegex(stdout, /whitelisted/)
      t.deepEqual(runner.accountsCalls, [])
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
        t.regex(out, /27 noncompliant modules found/)
        t.regex(out, /left-pad @ 1.3.0/)
        t.notRegex(out, /ms @ 0.7.1/)
        t.regex(out, /WTFPL/)
        t.notRegex(out, /UNKNOWN/)
        t.regex(out, /4 security vulnerabilities found/)
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
      t.regex(out, /27 noncompliant modules found/)
      t.regex(out, /left-pad @ 1.3.0/)
      t.regex(out, /WTFPL/)
      t.regex(out, /4 security vulnerabilities found/)
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
      t.regex(out, /27 noncompliant modules found/)
      t.regex(out, /left-pad @ 1.3.0/)
      t.notRegex(out, /ms @ 0.7.1/)
      t.regex(out, /WTFPL/)
      t.notRegex(out, /UNKNOWN/)
      t.regex(out, /4 security vulnerabilities found/)
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
      t.regex(out, /27 noncompliant modules found/)
      t.regex(out, /4 security vulnerabilities found/)
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
      t.regex(out, /27 noncompliant modules found/)
      t.regex(out, /4 security vulnerabilities found/)
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
      t.regex(out, /27 noncompliant modules found/)
      t.regex(out, /4 security vulnerabilities found/)
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
      t.regex(out, /27 noncompliant modules found/)
      t.regex(out, /4 security vulnerabilities found/)
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
      t.regex(out, /27 noncompliant modules found/)
      t.regex(out, /4 security vulnerabilities found/)
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
      t.regex(out, /27 noncompliant modules found/)
      t.regex(out, /4 security vulnerabilities found/)
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
      t.regex(out, /27 noncompliant modules found/)
      t.regex(out, /4 security vulnerabilities found/)
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
      t.regex(out, /27 noncompliant modules found/)
      t.regex(out, /4 security vulnerabilities found/)
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
      t.regex(out, /27 noncompliant modules found/)
      t.regex(out, /4 security vulnerabilities found/)
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
      t.regex(out, /27 noncompliant modules found/)
      t.regex(out, /4 security vulnerabilities found/)
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
      t.regex(out, /27 noncompliant modules found/)
      t.regex(out, /4 security vulnerabilities found/)
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

// A `report` run takes about 2 s alone and about 8 s on a loaded machine
// running AVA's tests side by side. The bound only has to stop a run that
// retries forever.
const SPAWN_TIMEOUT = 30000

// Runs `report` on the mock project in a config of its own, holding `saved`
// as `ncm signin` would have left it, with `ncmToken` as NCM_TOKEN. Resolves
// to the outcome and the config as the run left it.
function reportWithConfig (runner, t, { saved = {}, ncmToken = '' } = {}) {
  t.timeout(SPAWN_TIMEOUT + 10000)
  const configHome = fs.mkdtempSync(path.join(os.tmpdir(), 'ncm-cli-config-'))
  const configFile = path.join(configHome, 'configstore', 'ncm-cli.json')
  fs.mkdirSync(path.dirname(configFile), { recursive: true })
  fs.writeFileSync(configFile, JSON.stringify(saved))
  const env = {
    ...process.env,
    ...runner.env,
    NCM_TOKEN: ncmToken,
    XDG_CONFIG_HOME: configHome
  }

  return new Promise(/** @type {(resolve: any) => void} */ (resolve) => {
    execFile(process.execPath, [NCM_BIN, 'report', MOCK_PROJECT, '--color=16m'], { env, timeout: SPAWN_TIMEOUT }, (err, stdout, stderr) => {
      const config = JSON.parse(fs.readFileSync(configFile, 'utf8'))
      fs.rmSync(configHome, { recursive: true, force: true })
      resolve({ err, stdout, stderr, config })
    })
  })
}

// The whole mock project was scored, and the sign-in service never asked.
function assertScoredWithoutAccounts (t, runner, { err, stdout, stderr }) {
  t.falsy(err && err.killed, `report was stopped after ${SPAWN_TIMEOUT} ms`)
  // 1 because the mock project has failing packages, as in the tests above.
  t.is(err && err.code, 1)
  t.is(stderr, '')
  t.regex(stdout, /81 .+packages checked/)
  t.regex(stdout, /27 noncompliant modules found/)
  t.regex(stdout, /4 security vulnerabilities found/)
  t.deepEqual(runner.accountsCalls, [])
}

NCMTestRunner.createTest('report scores a project without signing in or a token, and never calls the sign-in service', async (runner, t) => {
  // A fresh config, as after installing the CLI, with no NCM_TOKEN: nobody
  // ran `ncm signin`.
  assertScoredWithoutAccounts(t, runner, await reportWithConfig(runner, t))
})

NCMTestRunner.createTest('report scores a project when the API refuses a saved session, without asking the sign-in service for a new one', async (runner, t) => {
  // Signed in with `ncm signin` once; the session has since expired.
  const outcome = await reportWithConfig(runner, t, {
    saved: { token: 'refused-token', refreshToken: 'saved-refresh-token' }
  })
  assertScoredWithoutAccounts(t, runner, outcome)
  // Refreshing would also have used up the saved refresh token.
  t.is(outcome.config.refreshToken, 'saved-refresh-token')
})

NCMTestRunner.createTest('report scores a project when the API refuses NCM_TOKEN, instead of retrying it forever', async (runner, t) => {
  assertScoredWithoutAccounts(t, runner, await reportWithConfig(runner, t, { ncmToken: 'refused-token' }))
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
