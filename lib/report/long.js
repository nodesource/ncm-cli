'use strict'

module.exports = longReport

const shortReport = require('./short')
const {
  COLORS,
  moduleList,
  W
} = require('./util')
const chalk = require('chalk')

function longReport (report, dir) {
  shortReport(report, dir)

  /* Divider */
  console.log(chalk`{${COLORS.light1} ${'-'.repeat(W[0] + W[1] + W[2] + W[3] + 7)}}`)
  console.log()

  moduleList(report)
}
