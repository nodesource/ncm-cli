#!/usr/bin/env node

'use strict'

const { commands, options } = require('../commands/cli')

var yargs = require('yargs')

yargs
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