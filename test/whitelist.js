'use strict'

const { NCMTestRunner } = require('./lib/test-runner.js')

NCMTestRunner.createTest('whitelist updates properly', async (runner, t) => {
  {
    const { stdout, stderr } = await runner.execP(
      'whitelist --add ansi-styles@3.2.1',
      { env: Object.assign({ FORCE_COLOR: 3 }, process.env) }
    )
    t.is(stderr, '')
    t.snapshot(stdout, 'add-output')

    const out = stdout.toString()
    t.regex(out, /Package\(s\) added successfully./)
  }
  {
    const { stdout, stderr } = await runner.execP(
      'whitelist --list',
      { env: Object.assign({ FORCE_COLOR: 3 }, process.env) }
    )
    t.is(stderr, '')
    t.snapshot(stdout, 'list-added-output')

    const out = stdout.toString()
    t.regex(out, /debug @ 2.2.0/)
    t.regex(out, /ansi-styles @ 3.2.1/)
  }
  {
    const { stdout, stderr } = await runner.execP(
      'whitelist --remove ansi-styles@3.2.1',
      { env: Object.assign({ FORCE_COLOR: 3 }, process.env) }
    )
    t.is(stderr, '')
    t.snapshot(stdout, 'remove-output')

    const out = stdout.toString()
    t.regex(out, /Package\(s\) removed successfully/)
  }
  {
    const { stdout, stderr } = await runner.execP(
      'whitelist --list',
      { env: Object.assign({ FORCE_COLOR: 3 }, process.env) }
    )
    t.is(stderr, '')
    t.snapshot(stdout, 'list-removed-output')

    const out = stdout.toString()
    t.regex(out, /debug @ 2.2.0/)
    t.notRegex(out, /ansi-styles @ 3.2.1/)
  }
})
