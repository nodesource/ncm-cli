'use strict'

const { exec } = require('child_process')
const path = require('path')
const { test } = require('tap')

const NCM_BIN = path.join(__dirname, '..', 'bin', 'ncm-cli.js')

test('help output matches help snapshot', (t) =>
  exec(`node ${NCM_BIN} help --color=16m`, {
    env: Object.assign({ FORCE_COLOR: 3 }, process.env)
  }, (err, stdout, stderr) => {
    t.equal(err, null)
    t.equal(stderr, '')
    t.matchSnapshot(stdout, 'help-output')
    t.match(stdout, /NodeSource Certified Modules CLI Help/)
    t.match(stdout, /Usage:/)
    t.end()
  })
)
