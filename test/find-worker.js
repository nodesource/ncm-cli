#!/usr/bin/env node
'use strict'

const fs = require('fs')
const path = require('path')

console.log('Searching for ncm-ng worker module...')

// Try to locate ncm-ng installation
let ncmNgModule = null
let ncmNgPath = null

// Array of possible module names
const moduleNames = ['ncm-ng', '@ns-private/ncm-ng']

// Try to find and load the module using each name
for (const moduleName of moduleNames) {
  try {
    console.log(`Attempting to load ${moduleName}...`)
    ncmNgModule = require(moduleName)
    console.log(`Successfully loaded ${moduleName}`)

    try {
      ncmNgPath = path.dirname(require.resolve(moduleName))
      console.log(`Found module path: ${ncmNgPath}`)
      break
    } catch (err) {
      console.log(`Error resolving path for ${moduleName}: ${err.message}`)
    }
  } catch (err) {
    console.log(`Error loading ${moduleName}: ${err.message}`)
  }
}

// Check for relative path from current directory
if (!ncmNgPath) {
  const relativePaths = ['../../ncm-ng', '../ncm-ng', './ncm-ng']

  for (const relativePath of relativePaths) {
    const fullPath = path.resolve(__dirname, relativePath)
    console.log(`Checking ${fullPath}...`)

    if (fs.existsSync(fullPath)) {
      console.log(`Found ncm-ng at ${fullPath}`)
      ncmNgPath = fullPath
      break
    }
  }
}

if (!ncmNgPath) {
  console.log('Failed to find ncm-ng module path')
  process.exit(1)
}

// Search for worker file in potential subdirectories
const possibleWorkerPaths = [
  path.join(ncmNgPath, 'lib', 'parallel', 'ncm-worker.js'),
  path.join(ncmNgPath, 'src', 'parallel', 'ncm-worker.js'),
  path.join(ncmNgPath, 'dist', 'parallel', 'ncm-worker.js'),
  path.join(ncmNgPath, 'dist', 'lib', 'parallel', 'ncm-worker.js')
]

console.log('\nSearching for worker module in possible paths:')
for (const workerPath of possibleWorkerPaths) {
  console.log(`Checking ${workerPath}...`)

  if (fs.existsSync(workerPath)) {
    console.log(`Found worker module at ${workerPath}`)

    // Try to load the worker module
    try {
      const workerModule = require(workerPath)
      console.log('Successfully loaded worker module')
      console.log('Worker module exports:', Object.keys(workerModule))

      if (typeof workerModule.certify === 'function') {
        console.log('Worker has certify function!')
      } else {
        console.log('Worker does not have certify function')
      }
    } catch (err) {
      console.log(`Error loading worker module: ${err.message}`)
    }
  }
}

// If we get here and haven't found the worker, check the entire ncm-ng directory structure
console.log('\nFallback: Scanning entire ncm-ng directory for worker files...')

function findFilesWithPattern (startPath, pattern) {
  if (!fs.existsSync(startPath)) {
    return []
  }

  const results = []
  const files = fs.readdirSync(startPath)

  for (const file of files) {
    const filePath = path.join(startPath, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      results.push(...findFilesWithPattern(filePath, pattern))
    } else if (file.match(pattern)) {
      results.push(filePath)
    }
  }

  return results
}

const workerFiles = findFilesWithPattern(ncmNgPath, /worker\.js$/)
console.log(`Found ${workerFiles.length} potential worker files:`)
workerFiles.forEach(file => console.log(`- ${file}`))
