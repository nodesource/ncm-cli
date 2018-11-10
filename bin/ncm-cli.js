#!/usr/bin/env node

'use strict'

const { commands, options } = require('../commands/cli')

var yargs = require('yargs')

var argv = yargs
    .usage('usage: $0 [command] [options]')
    .command(...commands.config)
    .command(...commands.signin)
    .command(...commands.signout)
    .command(...commands.policy)
    .command(...commands.verify)
    .command(...commands.watch)
    .options(options)
    .help()
    .argv