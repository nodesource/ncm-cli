'use strict'

module.exports = shortReport

const summary = require('./summary')
const { moduleList } = require('./util')

function shortReport (report, dir, argv) {
  summary(report, dir)

  let filterSecurity = argv ? !!argv.security : false
  let filterCompliance = argv ? !!argv.compliance : false

  if (argv.filter) {
    const segments = argv.filter.split(',')
      .map(s => s.trim())

    if (segments.indexOf('compliance') >= 0) {
      filterCompliance = true
    }
    if (segments.indexOf('security') >= 0) {
      filterSecurity = true
    }
  }

  if (filterCompliance || filterSecurity) {
    moduleList(report, null, {
      filterCompliance: filterCompliance,
      filterSecurity: filterSecurity
    })
  } else {
    moduleList(report.slice(0, 5), 'Top 5: Highest Risk Modules')
  }
}
