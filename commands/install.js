'use strict'

// In order to work around windows shell issues...
const spawn = require('cross-spawn')
const { getValue } = require('../lib/config')
const { queryReadline, reversedSplit } = require('../lib/util')
const details = require('./details')
const {
  COLORS,
  line,
  failure
} = require('../lib/ncm-style')
const { helpHeader } = require('../lib/help')
const chalk = require('chalk')
const L = console.log
const E = console.error

module.exports = install
module.exports.optionsList = optionsList

async function install (argv, arg1, arg2, arg3) {
  const childArgv = Array.from(process.argv.slice(3))
  let name
  let version
  if (!arg1) {
    printHelp()
    process.exitCode = 1
    return
  } else if (arg1.lastIndexOf('@') > 0 && !arg2 && !arg3) {
    childArgv.splice(childArgv.indexOf(arg1), 1)
    ;[name, version] = reversedSplit(arg1, /@(?!$)/)
  } else if (arg2 === '@' && arg3) {
    name = arg1
    version = arg3
    childArgv.splice(childArgv.indexOf(arg1), 1)
    childArgv.splice(childArgv.indexOf(arg2), 1)
    childArgv.splice(childArgv.indexOf(arg3), 1)
  } else if (arg1) {
    name = arg1
    version = arg2 || 'latest'
    childArgv.splice(childArgv.indexOf(arg1), 1)
    if (arg2) childArgv.splice(childArgv.indexOf(arg2), 1)
  } else {
    printHelp()
    process.exitCode = 1
    return
  }

  await details(argv, arg1, arg2, arg3)

  const good = process.exitCode === 0 || process.exitCode === undefined

  const confirm = good ? `${COLORS.green} (Y/n)` : `${COLORS.red} (y/N)`

  L(line('|➔', chalk`Install this module? {${confirm}}`, COLORS.yellow))
  L()

  let choice
  if (argv.force) {
    choice = 'y'
  } else if (process.stdin.isTTY) {
    choice = (await queryReadline(chalk`{${COLORS.light1} > }`)).trim().toLowerCase()
  } else {
    choice = good ? 'y' : 'n'
  }

  if ((good && choice === '') || choice === 'y') {
    const args = [getValue('installCmd'), `${name}@${version}`, ...childArgv]
    const bin = getValue('installBin')

    L()
    L(chalk`Running: {${COLORS.teal} ${bin} ${args.join(' ')}}`)
    L()

    const cp = spawn(bin, args, { stdio: 'inherit' })
    cp.on('error', error => {
      E()
      E(chalk`{COLORS.red ${error}}`)
      E()
    })
    cp.on('exit', code => {
      process.exitCode = code
    })
  } else {
    L()
    L(failure(chalk`Did {bold not} install ${name}@${version}`))
    L()
  }
}

function printHelp () {
  helpHeader(
    'install',
    chalk`{${COLORS.light1} ncm} {${COLORS.yellow} install} {${COLORS.teal} <module\{@version\}> [options] [npm options]}`,
    'ncm install <module{@version}> [options] [npm options]',
    chalk`
Runs and displays {${COLORS.light1} "ncm details <module\{@version\}>"} with an interactive confirmation prompt.
If confirmed, attempts to run {${COLORS.light1} "npm install <module\{@version\}>"} with any additional options provided.

{italic The config keys {${COLORS.yellow} installBin} and {${COLORS.yellow} installCmd} can adjust this to work with other package installers if necessary.}
    `
  )

  L(optionsList())
  L()
}

function optionsList () {
  return chalk`
{${COLORS.light1} ncm} {${COLORS.yellow} install} {${COLORS.teal} <module\{@version\}> [npm options]}
{${COLORS.light1} ncm} {${COLORS.yellow} i} {${COLORS.teal} <module\{@version\}> [npm options]}
  {${COLORS.teal} -d, --dir} {white Directory to check for dependency path}
  `.trim()
}
