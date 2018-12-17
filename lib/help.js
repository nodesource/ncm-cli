'use strict'

const logger = require('./logger')

module.exports = {
  displayHelp
}

function displayHelp (cmd) {
  logger([{ text: 'NCM-CLI', style: 'ncm' }])
  logger([{ text: 'usage: ncm-cli [command] [options]', style: [] }])
  logger()

  logger([{ text: 'Commands:', style: ['bold'] }])
  switch (cmd) {
    case 'config':
      logger([{ text: `ncm-cli config set`, style: [] }])
      logger([{ text: `ncm-cli config get`, style: [] }])
      logger([{ text: `ncm-cli config del`, style: [] }])
      logger([{ text: `ncm-cli config list`, style: [] }])
      logger([{ text: `ncm-cli config reset`, style: [] }])
      break
    case 'signin':
      logger([{ text: `ncm-cli signin [options]`, style: [] }])
      break
    case 'signout':
      logger([{ text: 'ncm-cli signout', style: [] }])
      break
    case 'policy':
      logger([{ text: `ncm-cli policy whitelist`, style: [] }])
      logger([{ text: `ncm-cli policy whitelist add <pkg-name>@<ver>`, style: [] }])
      logger([{ text: `ncm-cli policy whitelist del <pkg-name>@<ver>`, style: [] }])
      break
    case 'verify':
      logger([{ text: `ncm-cli verify [options]`, style: [] }])
      break
    case 'watch':
      logger([{ text: `ncm-cli watch [options]`, style: [] }])
      break
    case 'help':
      logger([{ text: `ncm-cli help`, style: [] }])
      logger([{ text: `ncm-cli signin [options]`, style: [] }])
      logger([{ text: `ncm-cli signout`, style: [] }])
      logger([{ text: `ncm-cli config [command]`, style: [] }])
      logger([{ text: `ncm-cli policy [command] [options]`, style: [] }])
      logger([{ text: `ncm-cli verify [options]`, style: [] }])
      logger([{ text: `ncm-cli watch [options]`, style: [] }])
  }
  logger()

  logger([{ text: 'Options:', style: ['bold'] }])
  logger([{ text: `--help`, style: [] }])
  switch (cmd) {
    case 'signin':
      logger([{ text: `--help`, style: [] }])
      logger([{ text: `--google, -G`, style: [] }])
      logger([{ text: `--github, -g`, style: [] }])
      break
    case 'verify':
      logger([{ text: `--dir, -d`, style: [] }])
      logger([{ text: `--report, -r`, style: [] }])
      logger([{ text: `--json, -j`, style: [] }])
      logger([{ text: `--output, -o`, style: [] }])
      logger([{ text: `--certified, -C`, style: [] }])
      logger([{ text: `--production, -p`, style: [] }])
      break
    case 'watch':
      logger([{ text: `--dir, -d`, style: [] }])
      break
    case 'help':
      logger([{ text: `--version, -v`, style: [] }])
  }
  logger()
}
