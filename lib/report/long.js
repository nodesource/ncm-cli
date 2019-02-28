'use strict'

module.exports = longReport

const summary = require('./summary')
const { moduleList } = require('./util')

function longReport (report, dir) {
  summary(report, dir)

  moduleList(report, 'Modules')
}
