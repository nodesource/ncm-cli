'use strict'

module.exports = longReport

const shortReport = require('./short')
const {
  moduleList,
  W
} = require('./util')
const { divider } = require('../ncm-style')

function longReport (report, dir) {
  shortReport(report, dir)

  /* Divider */
  console.log(divider(W[0] + W[1] + W[2] + W[3] + 7))
  console.log()

  moduleList(report)
}
