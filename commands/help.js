'use strict'

const logger = require('../lib/logger')
const { helpHeader } = require('../lib/help')

module.exports = help

async function help () {
  helpHeader()

  logger([{ text: 'Commands:', style: ['bold'] }])
  logger([{ text: `ncm-cli help`, style: [] }])
  logger([{ text: `ncm-cli orgs`, style: [] }])
  logger([{ text: `ncm-cli signin [options]`, style: [] }])
  logger([{ text: `ncm-cli signout`, style: [] }])
  logger([{ text: `ncm-cli config [command]`, style: [] }])
  logger([{ text: `ncm-cli policy [command] [options]`, style: [] }])
  logger([{ text: `ncm-cli verify [options]`, style: [] }])
  logger([{ text: `ncm-cli watch [options]`, style: [] }])
  logger()

  logger([{ text: 'Options:', style: ['bold'] }])
  logger([{ text: `--help`, style: [] }])
  logger([{ text: `--google, -G`, style: [] }])
  logger([{ text: `--github, -g`, style: [] }])
  logger([{ text: `--dir, -d`, style: [] }])
  logger([{ text: `--report, -r`, style: [] }])
  logger([{ text: `--json, -j`, style: [] }])
  logger([{ text: `--output, -o`, style: [] }])
  logger([{ text: `--certified, -C`, style: [] }])
  logger([{ text: `--production, -p`, style: [] }])
  logger([{ text: `--version, -v`, style: [] }])
  logger()
}
