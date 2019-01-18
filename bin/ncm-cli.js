#!/usr/bin/env node

'use strict'

process.on('unhandledRejection', function (err) {
  console.error(err)
  process.exit(1)
})

const parseArgs = require('minimist')

const commands = {
  config: require('../commands/config'),
  help: require('../commands/help'),
  orgs: require('../commands/orgs'),
  policy: require('../commands/policy'),
  signin: require('../commands/signin'),
  signout: require('../commands/signout'),
  verify: require('../commands/verify'),
  watch: require('../commands/watch')
}

async function main () {
  const argv = parseArgs(process.argv.slice(2), {
    alias: {
      dir: 'd',
      github: 'g',
      google: 'G',
      help: 'h',
      json: 'j',
      long: 'l',
      output: 'o',
      org: 'O',
      report: 'r',
      version: 'v'
    }
  })

  let [ command = 'help', ...subargs ] = argv._
  if (!Object.keys(commands).includes(command)) {
    command = 'help'
  }

  if (argv.version) {
    const { version } = require('../package.json')
    console.log(version)
    return
  }

  await commands[command](argv, ...subargs)
}

// invoke main
if (require.main === module) {
  main().catch(err => {
    console.error(err)
    process.exitCode = 1
  })
}
