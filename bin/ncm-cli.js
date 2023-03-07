#!/usr/bin/env node

'use strict'

function handleError(err){
  console.error(err)
  process.exit(1)
}

process.on('unhandledRejection', handleError)

const parseArgs = require('minimist')
const pkg = require('../package.json')

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
      version: 'v',
      json: 'j'
    }
  })
  

  if(argv.dir && typeof argv.dir !== 'string'){
    handleError('ERR_INVALID_ARG_TYPE: --dir or -d must to be a string')
  }

  let [command = 'help', ...subargs] = argv._
  if (!Object.keys(commands).includes(command)) {
    command = 'help'
  }

  if (argv.version) {
    console.log(pkg.version)
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
