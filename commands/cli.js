'use strict'

const signin = require('./signin')
const signout = require('./signout')
const policy = require('./policy')
const verify = require('./verify')
const watch = require('./watch')
const config = require('./config')

const commands = {
    config: [
        'config',
        'NCM-cli configuration management',
        (yargs) => {
            yargs
            .command(
                'set',
                'Set a configuration option',
                (yargs) => { 
                    yargs
                    .usage('usage: $0 config set <key> <value>')
            })
            .command(
                'get',
                'Get a configuration option',
                (yargs) => {
                    yargs
                    .usage('usage: $0 config get <key>')
                }
            )
            .command(
                ['del', 'delete'],
                'description',
                (yargs) => {
                    yargs
                    .usage('usage: $0 config del <key>')
                }
            )
            .command(
                'reset',
                'description',
                (yargs) => {
                    yargs
                    .usage('usage: $0 config reset')
                }
            )
            .check(config)
        }
    ],
    signin: [
        ['signin', 'login', 's'], 
        'Signin to NCM-cli',
        (yargs) => {
            yargs
            .usage('usage: $0 signin <username> <password> [options]')
            .options({
                google: { alias: 'G', describe: 'Google SSO' },
                github: { alias: 'g', describe: 'GitHub SSO' }
            })
            .check(signin)
        }
    ],
    signout: [
        ['signout', 'logout', 'o'],
        'Signout of NCM-cli',
        (yargs) => {
            yargs
            .usage('usage: $0 signout')
            .check(signout)
        }
    ],
    policy: [
        ['policy', 'p'],
        'Display the policy set for the organization',
        (yargs) => {
            yargs
            .command(
                'add',
                'Add a package to the current policy whitelist',
                (yargs) => yargs.usage('usage: $0 policy add <pkg>@<version>')
            )
            .command(
                'del',
                'Delete a package to the current policy whitelist',
                (yargs) => yargs.usage('usage: $0 policy del <pkg>@<version>')
            )
            .command(
                'get',
                'Get the current policy whitelist',
                (yargs) => yargs.usage('usage: $0 policy get')
            )
            .check(policy.managePolicySet)
        }
    ],
    verify: [
        ['verify', 'v'],
        'Verify that all packages in the tree are certified',
        (yargs) => {
            yargs
            .check(verify)
        }
    ],
    watch: [
        ['watch', 'w'],
        'Watches directory for changes',
        (yargs) => {
            yargs
            .check(watch)
        }
    ]
}

const options = {
    certified: { 
        alias: 'C',
        describe: 'Shows only certified packages' 
    },
    dir: {
        alias: 'd',
        describe: 'Specify the directory to run a score report' 
    },
    json: { 
        alias: 'j',
        describe: 'Formats the score report in JSON' 
    },
    output: { 
        describe: 'Outputs score report to a file' 
    },
    production: {
        alias: 'prod',
        describe: 'Only verifies production modules' 
    },
    report: {
        alias: 'r',
        describe: 'Print a score report when verifying a package tree'
    }
}

module.exports = { 
    commands: commands,
    options: options 
}

// var argv = yargs
//     .usage('usage: $0 [command] [options]')
//     .command(
//         'config',
//         'NCM-cli configuration management',
//         (yargs) => {
//             argv = yargs
//             .command(
//                 'set',
//                 'Set a configuration option',
//                 (yargs) => { 
//                     argv = yargs
//                     .usage('usage: $0 config set <key> <value>')
//             })
//             .command(
//                 'get',
//                 'Get a configuration option',
//                 (yargs) => {
//                     argv = yargs
//                     .usage('usage: $0 config get <key>')
//                 }
//             )
//             .command(
//                 ['del', 'delete'],
//                 'description',
//                 (yargs) => {
//                     argv = yargs
//                     .usage('usage: $0 config del <key>')
//                 }
//             )
//             .command(
//                 'reset',
//                 'description',
//                 (yargs) => {
//                     argv = yargs
//                     .usage('usage: $0 config reset')
//                 }
//             )
//             .check((argv, options) => {
//                 let cmd = argv['_'] || null
//                 if(cmd && config.configCommands.includes(cmd[1])) {
//                     config.modifyState(argv)
//                     return true
//                 } else {
//                     return false
//                 }
                
//             })
//         }
//     )
//     .command(
//         ['signin', 'login', 's'], 
//         'Signin to NCM-cli',
//         (yargs) => {
//             argv = yargs
//             .usage('usage: $0 signin <username> <password> [options]')
//             .options({
//                 google: { alias: 'G', describe: 'Google SSO' },
//                 github: { alias: 'g', describe: 'GitHub SSO' }
//             })
//             .check(signin)
//         }
//     )
//     .command(
//         ['signout', 'logout', 'o'],
//         'Signout of NCM-cli',
//         (yargs) => {
//             argv = yargs
//             .usage('usage: $0 signout')
//             .check(signout)
//         }
//     )
//     .command(
//         ['policy', 'p'],
//         'Display the policy set for the organization',
//         (yargs) => {
//             argv = yargs
//             .command(
//                 'add',
//                 'Add a package to the current policy whitelist',
//                 (yargs) => yargs.usage('usage: $0 policy add <pkg>@<version>')
//             )
//             .command(
//                 'del',
//                 'Delete a package to the current policy whitelist',
//                 (yargs) => yargs.usage('usage: $0 policy del <pkg>@<version>')
//             )
//             .command(
//                 'get',
//                 'Get the current policy whitelist',
//                 (yargs) => yargs.usage('usage: $0 policy get')
//             )
//             .check(policy.managePolicySet)
//         }
//     )
//     .command(
//         ['verify', 'v'],
//         'Verify that all packages in the tree are certified',
//         (yargs) => {
//             argv = yargs
//             .check(verify)
//         }
//     )
//     .command(
//         ['watch', 'w'],
//         'Watches directory for changes',
//         (yargs) => {
//             argv = yargs
//         }
//     )
//     .options({
//         certified: { 
//             alias: 'C',
//             describe: 'Shows only certified packages' 
//         },
//         dir: {
//             alias: 'd',
//             describe: 'Specify the directory to run a score report' 
//         },
//         json: { 
//             alias: 'j',
//             describe: 'Formats the score report in JSON' 
//         },
//         output: { 
//             describe: 'Outputs score report to a file' 
//         },
//         production: {
//             alias: 'prod',
//             describe: 'Only verifies production modules' 
//         },
//         report: {
//             alias: 'r',
//             describe: 'Print a score report when verifying a package tree'
//         }
//     })
//     .help()
//     .argv