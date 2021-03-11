'use strict'

const NCMTestRunner = require('./lib/test-runner.js')
const path = require('path')

const XDG_CONFIG_HOME = path.join(__dirname, '.tmp')

NCMTestRunner.test('install output matches snapshot', async (runner, t) => {
  {
    const MOCK_INSTALL_BIN = path.join('test', 'lib', 'install-mock-bin.js')

    const { stdout, stderr } = await runner.execP(
      `config set installBin ${MOCK_INSTALL_BIN}`,
      { XDG_CONFIG_HOME }
    )

    t.equal(stderr, '')
    t.matchSnapshot(stdout, 'config-set-output')

    const out = stdout.toString()
    t.match(out, /<installBin> has been set to:\n.+install-mock-bin\.js/)
  }

  {
    const { stdout, stderr } = await runner.execP(
      'install npm @ 6.8.0 --force',
      { XDG_CONFIG_HOME }
    )

    t.equal(stderr, '')
    t.match(stdout, /[NCM::SECURITY]/)

    const out = stdout.toString()
    t.match(out, 'SUBCOMMAND ARGS: [ \'install\', \'npm@6.8.0\', \'--force\'')
  }
})
