'use strict'

// Import the test runner class
const { NCMTestRunner } = require('./lib/test-runner.js')
const path = require('path')
const fs = require('fs')
const os = require('os')

// Create a temporary test project directory
const TEST_PROJECT_DIR = path.join(os.tmpdir(), 'ncm-cli-local-cert-test-' + Date.now())
const MOCK_PROJECT = `--dir=${TEST_PROJECT_DIR}`

// Function to create a test package.json
function setupTestProject() {
  // Create test directory if it doesn't exist
  if (!fs.existsSync(TEST_PROJECT_DIR)) {
    fs.mkdirSync(TEST_PROJECT_DIR, { recursive: true })
  }

  // Create a test package.json
  const packageJson = {
    name: 'ncm-cli-local-cert-test',
    version: '1.0.0',
    description: 'Test project for local certification',
    dependencies: {
      'lodash': '^4.17.21',
      'express': '^4.18.2',
      'chalk': '^4.1.2'
    }
  }

  // Write the package.json file
  fs.writeFileSync(
    path.join(TEST_PROJECT_DIR, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  )

  // Create mock node_modules structure for tests
  const nodeModulesDir = path.join(TEST_PROJECT_DIR, 'node_modules')
  if (!fs.existsSync(nodeModulesDir)) {
    fs.mkdirSync(nodeModulesDir, { recursive: true })
  }

  // Create mock dependency directories and package.json files
  const deps = ['lodash', 'express', 'chalk']
  deps.forEach(dep => {
    const depDir = path.join(nodeModulesDir, dep)
    fs.mkdirSync(depDir, { recursive: true })
    fs.writeFileSync(
      path.join(depDir, 'package.json'),
      JSON.stringify({
        name: dep,
        version: dep === 'lodash' ? '4.17.21' : (dep === 'express' ? '4.18.2' : '4.1.2'),
        license: 'MIT'
      }, null, 2)
    )
  })

  // Create .ncm-whitelist.json for local testing
  const whitelist = {
    "packages": [
      { "name": "lodash", "version": "4.17.21" }
    ]
  }

  fs.writeFileSync(
    path.join(TEST_PROJECT_DIR, '.ncm-whitelist.json'),
    JSON.stringify(whitelist, null, 2)
  )

  return TEST_PROJECT_DIR
}

// Clean up test project
function cleanupTestProject() {
  if (fs.existsSync(TEST_PROJECT_DIR)) {
    // Recursive delete function
    const deleteFolderRecursive = function(dir) {
      if (fs.existsSync(dir)) {
        fs.readdirSync(dir).forEach((file) => {
          const curPath = path.join(dir, file)
          if (fs.lstatSync(curPath).isDirectory()) {
            deleteFolderRecursive(curPath)
          } else {
            fs.unlinkSync(curPath)
          }
        })
        fs.rmdirSync(dir)
      }
    }
    
    try {
      deleteFolderRecursive(TEST_PROJECT_DIR)
    } catch (err) {
      console.error('Failed to clean up test project:', err)
    }
  }
}

// Setup test project before running tests
setupTestProject()

// Test that local certification works correctly with ncm-ng adapter
NCMTestRunner.createTest('local certification mode with ncm-ng adapter', (runner, t) => {
  return new Promise(/** @type {(resolve: any) => void} */ (resolve) => {
    runner.exec(`report ${MOCK_PROJECT} -l`, (err, stdout, stderr) => {
      // We expect the command to run successfully with local certification
      t.is(err, null, 'Command should complete successfully')
      t.is(stderr, '', 'Should not have stderr output')
      
      // Check for indicators of local certification
      t.regex(stdout, /ncm-cli-local-cert-test.*Report/, 'Should show the proper report title')
      t.regex(stdout, /packages checked/, 'Should check packages')
      
      // Check for MIT license indicator instead of specific checkmark character
      t.regex(stdout, /MIT/, 'MIT license should be present')
      
      // Check that risk level is displayed properly
      t.regex(stdout, /Low/, 'Risk level should be displayed')
      
      // Check that lodash is present in the report
      t.regex(stdout, /lodash/, 'Should include lodash in report')
      t.regex(stdout, /4\.17\.21/, 'Should include lodash version')
      
      resolve()
    })
  })
})

// Test that local certification with whitelist works correctly
NCMTestRunner.createTest('local certification respects local whitelist', (runner, t) => {
  return new Promise(/** @type {(resolve: any) => void} */ (resolve) => {
    // First validate that the whitelist was created correctly
    const whitelistPath = path.join(TEST_PROJECT_DIR, '.ncm-whitelist.json')
    if (fs.existsSync(whitelistPath)) {
      const whitelist = JSON.parse(fs.readFileSync(whitelistPath, 'utf8'))
      t.truthy(whitelist.packages && whitelist.packages.length > 0, 'Whitelist should have packages')
    }

    runner.exec(`report ${MOCK_PROJECT} -l`, (err, stdout, stderr) => {
      t.is(err, null, 'Command should complete successfully')
      t.is(stderr, '', 'Should not have stderr output')
      
      // Local mode should handle whitelisted packages properly
      t.regex(stdout, /lodash @ 4\.17\.21/, 'Should include whitelisted lodash in report')
      
      // Check compliance information is correct
      t.regex(stdout, /All modules compliant/, 'Should show all modules as compliant')
      
      resolve()
    })
  })
})

// Test license badge display
NCMTestRunner.createTest('license badge display for MIT licenses', (runner, t) => {
  return new Promise(/** @type {(resolve: any) => void} */ (resolve) => {
    runner.exec(`report ${MOCK_PROJECT} -l`, (err, stdout, stderr) => {
      t.is(err, null, 'Command should complete successfully')
      
      // Check for MIT licenses
      t.regex(stdout, /MIT/, 'MIT license should be present')
      
      // Make sure 'UNKNOWN' is not present for MIT licenses
      t.notRegex(stdout, /UNKNOWN/, 'Should not show UNKNOWN for MIT licenses')
      
      resolve()
    })
  })
})

// Test the risk badge display
NCMTestRunner.createTest('risk badge display in report', (runner, t) => {
  return new Promise(/** @type {(resolve: any) => void} */ (resolve) => {
    runner.exec(`report ${MOCK_PROJECT} -l`, (err, stdout, stderr) => {
      t.is(err, null, 'Command should complete successfully')
      
      // Risk level should be displayed
      t.regex(stdout, /Low/, 'Risk level should be displayed')
      
      // Should not show "None" risk level
      t.notRegex(stdout, /None/, 'Should not display "None" as a risk level')
      
      resolve()
    })
  })
})

// Clean up test project after all tests
process.on('exit', () => {
  cleanupTestProject()
})
