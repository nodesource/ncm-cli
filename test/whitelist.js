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
    t.match(out, /Package\(s\) added successfully./)
  }
  {
    const { stdout, stderr } = await runner.execP(
      `whitelist --list`,
      { env: Object.assign({ FORCE_COLOR: 3 }, process.env) }
    )
    t.equal(stderr, '')
    t.matchSnapshot(stdout, 'list-added-output')

    const out = stdout.toString()
    t.match(out, /debug @ 2.2.0/)
    t.match(out, /ansi-styles @ 3.2.1/)
  }
  {
    const { stdout, stderr } = await runner.execP(
      `whitelist --remove ansi-styles@3.2.1`,
      { env: Object.assign({ FORCE_COLOR: 3 }, process.env) }
    )
    t.equal(stderr, '')
    t.matchSnapshot(stdout, 'remove-output')

    const out = stdout.toString()
    t.match(out, /Package\(s\) removed successfully/)
  }
  {
    const { stdout, stderr } = await runner.execP(
      `whitelist --list`,
      { env: Object.assign({ FORCE_COLOR: 3 }, process.env) }
    )
    t.equal(stderr, '')
    t.matchSnapshot(stdout, 'list-removed-output')

    const out = stdout.toString()
    t.match(out, /debug @ 2.2.0/)
    t.notMatch(out, /ansi-styles @ 3.2.1/)
  }
})
