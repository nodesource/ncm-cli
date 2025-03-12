'use strict'

const NCMTestRunner = require('./lib/test-runner.js')

// A polyfill for Node.js EE#once().
const once = require('events.once')

const { spawn } = require('child_process')
const path = require('path')

NCMTestRunner.test('api requests respect ENV proxy settings', async (runner, t) => {
  const proc = spawn(
    process.execPath,
    [
      path.join(__dirname, 'lib', 'http-proxy-bin.js'),
      `http://localhost:${runner.port}`, // The mock server address
      0 // Autodecide the proxy port
    ],
    {
      // Make an ipc 'message' channel separate from stdio
      stdio: ['pipe', 'pipe', 'pipe', 'ipc']
    }
  )

  if (process.env.NCM_DEV === true) {
    proc.stdout.pipe(process.stdout)
    proc.stderr.pipe(process.stderr)
  }

  proc.on('error', err => {
    proc.kill()
    t.fail('Proxy server emitted an error!', err)
  })

  // Have the proxy server ipc us its port
  const [procPort] = await once(proc, 'message')

  try {
    await runner.execP('details npm @ 6.8.0', {
      http_proxy: `http://localhost:${procPort}`
    })
  } catch (err) {
    const { stdout, stderr } = err

    proc.kill()

    t.equal(err.code, 1)
    t.ok(stderr.includes('Failed to query NCM API'), 'Should show API query failure in stderr')
    t.ok(stderr.includes('Have you run `ncm signin`?'), 'Should prompt for signin in stderr')
    t.equal(stdout, '', 'stdout should be empty')

    t.end()
  }
})
