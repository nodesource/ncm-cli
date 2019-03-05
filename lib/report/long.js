'use strict'

module.exports = longReport

const summary = require('./summary')
const { moduleList } = require('./util')

function longReport (report, whitelist, dir) {
  summary(report, dir)

  if (whitelist.length > 0) {
    moduleList(whitelist, 'Whitelisted Modules')

    moduleList(report, 'Non-whitelisted Modules')
  } else {
    moduleList(report, 'Modules')
  }
}
