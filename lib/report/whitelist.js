'use strict'

const { moduleList } = require('./util')
const {
  COLORS,
  tooltip
} = require('../ncm-style')
const L = console.log

const chalk = require('chalk')

module.exports = whitelistReport

function whitelistReport (report) {
  L()
  L(chalk`${report.length} {${COLORS.light1} modules total}`)

  if (report.length === 0) {
    L()
    L(tooltip('Run `ncm whitelist --add <pkg-name>@<ver>` to add a package to the whitelist.'))
    L()
  } else {
    /* todo: what to do if unpublished */
    moduleList(report, 'Whitelisted Modules')
    L(tooltip('Run `ncm whitelist --remove <pkg-name>@<ver>` to remove a package from the whitelist.'))
    L()
  }
}
