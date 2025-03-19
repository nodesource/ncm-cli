module.exports = {
  // AVA settings
  files: ['test/*.js'], // Only include the main test files, not helper files in subdirectories
  concurrency: 5, // Similar to tap's -J flag
  environmentVariables: {
    FORCE_COLOR: '3',
    NODE_ENV: 'testing'
  },
  verbose: true,
  timeout: '2m', // Generous timeout for tests
  snapshotDir: 'tap-snapshots', // Use existing snapshot directory for compatibility
  // Exclude helper files from test/lib directory
  ignoredByWatcher: [
    'test/lib/**/*.js'
  ]
}
