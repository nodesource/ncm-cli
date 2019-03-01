'use strict'

module.exports = shortReport

const summary = require('./summary')
const { moduleList } = require('./util')

function shortReport (report, dir, argv) {
  summary(report, dir)

  const filterCompliance = argv ? !!(argv.compliance || argv.c) : false
  const filterSecurity = argv ? !!(argv.security || argv.s) : false

  if (filterCompliance || filterSecurity) {
    moduleList(report, null, {
      filterCompliance: filterCompliance,
      filterSecurity: filterSecurity
    })
  } else {
    moduleList(report.slice(0, 5), 'Top 5: Highest Risk Modules')
  }
}
