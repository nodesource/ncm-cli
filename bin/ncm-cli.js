#!/usr/bin/env node

'use strict'

process.on('unhandledRejection', function (err) {
  console.error(err)
  process.exit(1)
})

const parseArgs = require('minimist')
const updateNotifier = require('update-notifier')
const pkg = require('../package.json')
const fs = require('fs')

const commands = {
  config: require('../commands/config'),
  help: require('../commands/help'),
  i: require('../commands/install'),
  install: require('../commands/install'),
  orgs: require('../commands/orgs'),
  whitelist: require('../commands/whitelist'),
  signin: require('../commands/signin'),
  signout: require('../commands/signout'),
  report: require('../commands/report'),
  details: require('../commands/details')
}

async function main () {
  const argv = parseArgs(process.argv.slice(2), {
    alias: {
      dir: 'd',
      github: 'g',
      google: 'G',
      compliance: 'c',
      security: 's',
      help: 'h',
      long: 'l',
      org: 'O',
      report: 'r',
      version: 'v'
    }
  })

  let [ command = 'report', ...subargs ] = argv._
  if (!Object.keys(commands).includes(command)) {
    try {
      // alias `ncm DIR` to `ncm report DIR`
      fs.statSync(command)
      subargs.unshift(command)
      command = 'report'
    } catch (_) {
      command = 'help'
    }
  }

  if (argv.version) {
    console.log(pkg.version)
    return
  }

  await commands[command](argv, ...subargs)

  updateNotifier({ pkg }).notify()
}

// invoke main
if (require.main === module) {
  main().catch(err => {
    console.error(err)
    process.exitCode = 1
  })
}
