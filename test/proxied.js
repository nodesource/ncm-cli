// Import the correct test runner class
const { NCMTestRunner } = require('./lib/test-runner.js')

// No longer need the once polyfill

const { spawn } = require('child_process')
const path = require('path')

NCMTestRunner.createTest('api requests respect ENV proxy settings', (runner, t) => {
  return new Promise(/** @type {(resolve: any) => void} */ (resolve) => {
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

    // Wait for the proxy to start and tell us which port it chose
    proc.on('message', async (procPort) => {
      // The proxy sends the port number directly

      try {
        // Run an API command through the proxy
        await runner.execP('report --dir=.', {
          http_proxy: `http://localhost:${procPort}`
        })
      } catch (err) {
        const { stdout, stderr } = err

        proc.kill()

        t.is(err.code, 1)
        // Behind a proxy the first API request fails today: lib/client-request.js
        // calls proxy-agent v6's module as a constructor, and v6 exports
        // { ProxyAgent }. `report` no longer asks NodeSource Accounts for the
        // user first, so the request that fails is the scoring one.
        t.regex(stderr, /Unable to analyze project/, 'Should show the analyze failure in stderr')
        t.notRegex(stderr, /ncm signin/, 'Should not prompt for signin')
        t.regex(stdout, /Report/, 'Should include Report text in stdout')

        resolve()
      }
    })
  })
})
