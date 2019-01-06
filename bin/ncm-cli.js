#!/usr/bin/env node

'use strict'

process.on('unhandledRejection', function (err) {
  console.error(err)
  process.exit(1)
})

const { commands, options } = require('../commands/cli')

const yargs = require('yargs')

yargs /* eslint-disable-line no-unused-expressions */
  .command(...commands.default)
  .command(...commands.config)
  .command(...commands.signin)
  .command(...commands.signout)
  .command(...commands.policy)
  .command(...commands.verify)
  .command(...commands.watch)
  .command(...commands.help)
  .options(options)
  .help(false)
  .argv
