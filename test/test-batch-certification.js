#!/usr/bin/env node

/**
 * Test script to validate batched certification fixes
 * This script tests certifying a large set of packages using the ncm-ng adapter
 * with the new batching and improved concurrency handling
 */

const path = require('path')
const fs = require('fs')
const ncmNgAdapter = require('../lib/ncm-ng-adapter')

// Create log directory if it doesn't exist
const logDir = path.join(__dirname, 'logs')
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true })
}

// Set up logging to a file
const logFile = path.join(logDir, `batch-test-${Date.now()}.log`)
const originalConsoleLog = console.log
const originalConsoleError = console.error

const logStream = fs.createWriteStream(logFile, { flags: 'a' })

// Override console.log and console.error to write to log file
console.log = function () {
  const args = Array.from(arguments)
  const message = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg).join(' ')
  logStream.write(`[LOG] ${message}\n`)
  originalConsoleLog.apply(console, arguments)
}

console.error = function () {
  const args = Array.from(arguments)
  const message = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg).join(' ')
  logStream.write(`[ERROR] ${message}\n`)
  originalConsoleError.apply(console, arguments)
}

// Enable debug logging
process.env.NCM_CLI_DEBUG = 'true'
process.env.NCM_CLI_LOG_DIR = logDir

console.log(`Logs will be written to: ${logFile}`)

// Directory to test - self-certification of ncm-cli
const testDir = path.resolve(__dirname, '..')
console.log(`Testing with directory: ${testDir}`)

// Function to read package.json and get all dependencies
function getAllDependencies (dir) {
  try {
    const pkgJsonPath = path.join(dir, 'package.json')
    console.log(`Reading package.json from: ${pkgJsonPath}`)

    if (!fs.existsSync(pkgJsonPath)) {
      throw new Error('package.json not found')
    }

    const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'))
    const deps = { ...pkgJson.dependencies, ...pkgJson.devDependencies }

    console.log(`Found ${Object.keys(deps).length} dependencies`)

    // Convert dependencies to array of { name, version } objects
    const packages = []
    for (const [name, version] of Object.entries(deps)) {
      // Clean up version string (remove ^, ~, etc.)
      const cleanVersion = version.replace(/[\^~>=<]/g, '')
      packages.push({ name, version: cleanVersion })
    }

    return packages
  } catch (err) {
    console.error('Error reading dependencies:', err)
    return []
  }
}

async function runTest () {
  try {
    console.log('Starting test for batched certification...')

    // Get dependencies to certify
    const packages = getAllDependencies(testDir)
    console.log(`Will certify ${packages.length} packages with batching`)

    // Set start time
    const startTime = Date.now()

    // Run certification with the adapter
    const results = await ncmNgAdapter.certifyPackages(packages, { dir: testDir })

    // Calculate time taken
    const timeTaken = (Date.now() - startTime) / 1000

    console.log('\n=== Certification Results ===')
    console.log(`Total packages processed: ${packages.length}`)
    console.log(`Results received: ${results.length}`)
    console.log(`Time taken: ${timeTaken.toFixed(2)} seconds`)

    // Calculate summary stats
    const withScores = results.filter(r => r.scores && r.scores.length > 0).length
    const withErrors = results.filter(r => r.error).length

    console.log('\n=== Results Breakdown ===')
    console.log(`Packages with scores: ${withScores} (${((withScores / results.length) * 100).toFixed(1)}%)`)
    console.log(`Packages with errors: ${withErrors} (${((withErrors / results.length) * 100).toFixed(1)}%)`)

    // Print first 5 successful results
    console.log('\n=== Sample Successful Results ===')
    const successResults = results.filter(r => r.scores && r.scores.length > 0).slice(0, 5)
    for (const res of successResults) {
      console.log(`${res.name}@${res.version}: ${res.scores.length} scores`)
    }

    // Print first 5 error results
    console.log('\n=== Sample Error Results ===')
    const errorResults = results.filter(r => r.error).slice(0, 5)
    for (const res of errorResults) {
      console.log(`${res.name}@${res.version}: ${res.error}`)
    }

    console.log('\nTest completed successfully!')
    return true
  } catch (err) {
    console.error('Test failed with error:', err)
    return false
  }
}

runTest()
  .then(success => {
    process.exit(success ? 0 : 1)
  })
  .catch(err => {
    console.error('Uncaught error in test:', err)
    process.exit(1)
  })
