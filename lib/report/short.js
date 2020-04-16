'use strict'

module.exports = shortReport

const summary = require('./summary')
const { moduleList } = require('./util')

function shortReport (report, dir) {
  summary(report, dir)

  moduleList(report.slice(0, 5), 'Top 5: Highest Risk Modules')
}
