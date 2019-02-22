'use strict'

const {
  W,
  moduleList
} = require('./util')
const {
  COLORS,
  tooltip,
  divider
} = require('../ncm-style')
const L = console.log

const chalk = require('chalk')

module.exports = whitelistReport

function whitelistReport (report) {
  L()
  L(chalk`${report.length} {${COLORS.light1} modules total}`)

  if (report.length === 0) {
    L()
    L(tooltip(`Run \`ncm-cli whitelist --add <pkg-name>@<ver>\` to add a package to the whitelist.`))
    L()
  } else {
    /* Divider */
    L()
    L(divider(W[0] + W[1] + W[2] + W[3] + 7))
    L()

    /* todo: what to do if unpublished */
    moduleList(report, true)
    L(tooltip(`Run \`ncm-cli whitelist --remove <pkg-name>@<ver>\` to remove a package from the whitelist.`))
    L()
  }
}
