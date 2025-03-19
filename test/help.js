'use strict'

const { exec } = require('child_process')
const path = require('path')
const test = require('ava').default

const NCM_BIN = path.join(__dirname, '..', 'bin', 'ncm-cli.js')

// Simple test that doesn't need the test runner
test('help output matches help snapshot', async t => {
  const { promisify } = require('util')
  const execPromise = promisify(exec)

  const { stdout, stderr } = await execPromise(`node ${NCM_BIN} help --color=16m`, {
    env: Object.assign({ FORCE_COLOR: 3 }, process.env)
  })

  t.is(stderr, '')
  t.snapshot(stdout) // Removed id parameter as AVA 5.x doesn't support it
  t.regex(stdout, /NodeSource Certified Modules CLI Help/)
  t.regex(stdout, /Usage:/)
})
