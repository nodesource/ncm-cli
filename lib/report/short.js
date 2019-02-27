'use strict'

module.exports = shortReport

const summary = require('./summary')
const { moduleList } = require('./util')

function shortReport (report, dir, argv) {
  summary(report, dir)

  const filterCompliance = argv ? !!argv.compliance : false

  if (filterCompliance) {
    moduleList(report, null, {
      filterCompliance: filterCompliance
    })
  } else {
    moduleList(report.slice(0, 5), 'Top 5: Highest Risk Modules')
  }
}
