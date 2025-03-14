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
        // Now we know the actual error message, so update our assertions to match it
        t.regex(stderr, /Failed to fetch user info/, 'Should show user info fetch failure in stderr')
        t.regex(stderr, /Have you run `ncm signin`\?/, 'Should prompt for signin in stderr')
        t.regex(stdout, /Report/, 'Should include Report text in stdout')

        resolve()
      }
    })
  })
})
