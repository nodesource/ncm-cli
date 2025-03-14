'use strict'

// Import only what we need, avoid unused imports
const { NCMTestRunner } = require('./lib/test-runner.js')
const path = require('path')

const XDG_CONFIG_HOME = path.join(__dirname, '.tmp')

NCMTestRunner.createTest('install output matches snapshot', async (runner, t) => {
  // First part - config set
  const MOCK_INSTALL_BIN = path.join('test', 'lib', 'install-mock-bin.js')

  const { stdout: stdout1, stderr: stderr1 } = await runner.execP(
    `config set installBin ${MOCK_INSTALL_BIN}`,
    { XDG_CONFIG_HOME }
  )

  t.is(stderr1, '')
  t.snapshot(stdout1)

  const out1 = stdout1.toString()
  t.regex(out1, /<installBin> has been set to:\n.+install-mock-bin\.js/)

  {
    const { stdout, stderr } = await runner.execP(
      'install npm @ 6.8.0 --force',
      { XDG_CONFIG_HOME }
    )

    t.is(stderr, '')
    t.regex(stdout, /[NCM::SECURITY]/)

    const out = stdout.toString()
    // Split output into lines and find the SUBCOMMAND ARGS line
    const lines = out.split('\n')
    const subcommandLine = lines.find(line => line.includes('SUBCOMMAND ARGS:'))
    t.truthy(subcommandLine, 'Should find SUBCOMMAND ARGS line')
    // Remove ANSI color codes for comparison
    const cleanLine = subcommandLine?.replace(/\[\d+m/g, '')
    t.regex(cleanLine, /SUBCOMMAND ARGS: \[ 'install', 'npm@6.8.0', '--force' \]/, 'Should have correct command arguments')
  }
})
