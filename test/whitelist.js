'use strict'

const NCMTestRunner = require('./lib/test-runner.js')

NCMTestRunner.test('whitelist updates properly', async (runner, t) => {
  {
    const { stdout, stderr } = await runner.execP(
      `whitelist --add ansi-styles@3.2.1`,
      { env: Object.assign({ FORCE_COLOR: 3 }, process.env) }
    )
    t.equal(stderr, '')
    t.matchSnapshot(stdout, 'add-output')

    const out = stdout.toString()
    t.ok(/Package\(s\) added successfully./.test(out))
  }
  {
    const { stdout, stderr } = await runner.execP(
      `whitelist --list`,
      { env: Object.assign({ FORCE_COLOR: 3 }, process.env) }
    )
    t.equal(stderr, '')
    t.matchSnapshot(stdout, 'list-added-output')

    const out = stdout.toString()
    t.ok(/debug @ 2.2.0/.test(out))
    t.ok(/ansi-styles @ 3.2.1/.test(out))
  }
  {
    const { stdout, stderr } = await runner.execP(
      `whitelist --remove ansi-styles@3.2.1`,
      { env: Object.assign({ FORCE_COLOR: 3 }, process.env) }
    )
    t.equal(stderr, '')
    t.matchSnapshot(stdout, 'remove-output')

    const out = stdout.toString()
    t.ok(/Package\(s\) removed successfully/.test(out))
  }
  {
    const { stdout, stderr } = await runner.execP(
      `whitelist --list`,
      { env: Object.assign({ FORCE_COLOR: 3 }, process.env) }
    )
    t.equal(stderr, '')
    t.matchSnapshot(stdout, 'list-removed-output')

    const out = stdout.toString()
    t.ok(/debug @ 2.2.0/.test(out))
    t.notOk(/ansi-styles @ 3.2.1/.test(out))
  }
})
