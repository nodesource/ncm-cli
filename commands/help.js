'use strict'

const {
  COLORS,
  header,
  tooltip,
  rawBox
} = require('../lib/ncm-style')
const chalk = require('chalk')
const L = console.log

module.exports = help
module.exports.optionsList = optionsList

const commandNames = [
  'report',
  'details',
  'install',
  'whitelist',
  'signin',
  'signout',
  'orgs',
  'config'
]

const commands = commandNames.map(name => {
  return require(`./${name}`)
})

async function help (_, arg1) {
  // Support for "ncm help <command>"
  const cmdIdx = commandNames.indexOf(arg1)
  if (cmdIdx > -1) {
    commands[cmdIdx]({ help: true })
    return
  }

  L()
  L(header('NodeSource Certified Modules CLI Help'))
  L()

  L('Usage:')
  L(chalk`
  ${rawBox(
    chalk`{${COLORS.light1} ncm} {${COLORS.yellow} <command>} {${COLORS.teal} [options]}`,
    'ncm <command> [options]'.length
  )}

  {${COLORS.teal} -h, --help}    {white Display help for any command OR this message}
  {${COLORS.teal} -v, --version} {white Print ncm CLI version}
  `.trim())

  L()

  for (const command of commands) {
    L(command.optionsList())
    L()
  }

  L(tooltip('For more information on a specific command, run "ncm <command> --help".'))
  L()
}

function optionsList () {
  return chalk`
{${COLORS.light1} ncm} {${COLORS.yellow} help} {italic (this message)}
  `.trim()
}
