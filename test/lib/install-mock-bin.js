#!/usr/bin/env node

'use strict'

process.argv.slice(2).forEach(arg => {
  if (arg.includes('@')) {
    console.log('[NCM::SECURITY] Scanning npm dependency substitution vulnerabilities...')
    console.log(`[NCM::SECURITY] Verifying the package '${arg.split('@')[0]}'`)
  }
})

// Filter out color argument for test output
const args = process.argv.slice(2).filter(arg => !arg.startsWith('--color='))
// Format args as a string array for consistent test output
const formattedArgs = args.map(arg => `'${arg}'`)
console.log('SUBCOMMAND ARGS: [', formattedArgs.join(', '), ']')
