#!/usr/bin/env node

'use strict'

const { commands, options } = require('../commands/cli')

const yargs = require('yargs')

yargs /* eslint-disable-line no-unused-expressions */
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
