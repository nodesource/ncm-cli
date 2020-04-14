'use strict'

const {
  getValue,
  setValue,
  delValue,
  resetState,
  keyNames
} = require('../lib/config')
const { queryReadline } = require('../lib/util')
const { helpHeader } = require('../lib/help')
const {
  COLORS,
  failure,
  success,
  tooltip,
  box,
  formatError
} = require('../lib/ncm-style')
const chalk = require('chalk')
const L = console.log
const E = console.error

module.exports = config
module.exports.optionsList = optionsList

async function config (argv, action, key, value) {
  if (argv.help) {
    printHelp()
    return
  } else if (!action) {
    printHelp()
    process.exitCode = 1
    return
  }

  switch (action) {
    case 'set':
      if (!key || !value) {
        printHelp()
        process.exitCode = 1
        return
      }
      try {
        setValue(key, value)
      } catch (err) {
        E()
        E(formatError(`Attempted to set invalid config key "${key}"`, err))
        E()
      }
      L(success(`<${key}> has been set to:`))
      L(value)
      L()
      break

    case 'get': {
      if (!key) {
        printHelp()
        process.exitCode = 1
        return
      }
      let val
      try {
        val = getValue(key)
      } catch (err) {
        E()
        E(formatError(`Attempted to get invalid config key "${key}"`, err))
        E()
      }
      L(success(`<${key}> is:`))
      L(val)
      L()
      break
    }

    case 'del':
      if (!key) {
        printHelp()
        process.exitCode = 1
        return
      }
      try {
        delValue(key)
      } catch (err) {
        E()
        E(formatError(`Attempted to delete invalid config key "${key}"`, err))
        E()
      }
      L(success(`<${key}> was deleted`))
      L()
      break

    case 'reset': {
      resetState()

      L(box('!', 'Are you sure you want to reset all config? (y/N)', COLORS.orange))

      const answer = (await queryReadline(chalk`{${COLORS.light1} > }`)).trim()
      if (answer.toLowerCase() !== 'y') {
        L(failure('Did not reset any config.'))
        L()
        process.exitCode = 1
        return
      }
      L(success('All config was reset.'))
      L()
      break
    }

    case 'list': {
      const { unhide } = argv

      for (const key of keyNames) {
        let val = getValue(key)

        if (val.trim() === '') {
          val = chalk`{italic {${COLORS.light1} (empty)}}`
        } else if (/token/i.test(key) && !unhide) {
          val = chalk`{italic {${COLORS.light1} (${val.length} characters hidden)}}`
        }
        L(chalk`{${COLORS.teal} <${key}>} ${val}`)
      }
      if (!unhide) {
        L()
        L(tooltip('Run with --unhide to show hidden values.'))
      }
      L()
      break
    }

    default:
      printHelp()
      process.exitCode = 1
      break
  }
}

function printHelp () {
  helpHeader(
    'config',
    chalk`ncm {${COLORS.yellow} config} {${COLORS.teal} <action>}`,
    'ncm config <action>',
    `
Adjust ncm-cli configuration and local storage.
    `
  )

  L(extendedOptionsList())
  L()
}

function optionsList () {
  return chalk`
{${COLORS.light1} ncm} {${COLORS.yellow} config <action>} {${COLORS.teal} <key> <value>}
  `.trim()
}

function extendedOptionsList () {
  return chalk`
{${COLORS.light1} ncm} {${COLORS.yellow} config list}
{${COLORS.light1} ncm} {${COLORS.yellow} config reset}
{${COLORS.light1} ncm} {${COLORS.yellow} config del} {${COLORS.teal} <key>}
{${COLORS.light1} ncm} {${COLORS.yellow} config get} {${COLORS.teal} <key>}
{${COLORS.light1} ncm} {${COLORS.yellow} config set} {${COLORS.teal} <key> <value>}
  `.trim()
}
