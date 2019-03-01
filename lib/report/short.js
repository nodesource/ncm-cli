'use strict'

module.exports = shortReport

const summary = require('./summary')
const { moduleList, SEVERITY_RMAP } = require('./util')

function shortReport (report, dir, argv) {
  summary(report, dir)

  let filterSecurity = argv ? !!argv.security : false
  let filterCompliance = argv ? !!argv.compliance : false
  let filterLevel = SEVERITY_RMAP.indexOf('NONE')

  if (argv.filter) {
    const segments = argv.filter.split(',')
      .map(s => s.trim().toLowerCase())

    if (segments.includes('compliance')) {
      filterCompliance = true
    }
    if (segments.includes('security')) {
      filterSecurity = true
    }
    if (segments.includes('c') || segments.includes('critical')) {
      filterLevel = SEVERITY_RMAP.indexOf('CRITICAL')
    }
    if (segments.includes('h') || segments.includes('high')) {
      filterLevel = SEVERITY_RMAP.indexOf('HIGH')
    }
    if (segments.includes('m') || segments.includes('medium')) {
      filterLevel = SEVERITY_RMAP.indexOf('MEDIUM')
    }
    if (segments.includes('l') || segments.includes('low')) {
      filterLevel = SEVERITY_RMAP.indexOf('LOW')
    }
  }

  if (filterCompliance || filterSecurity || filterLevel > 0) {
    moduleList(report, null, {
      filterCompliance: filterCompliance,
      filterSecurity: filterSecurity,
      filterLevel: filterLevel
    })
  } else {
    moduleList(report.slice(0, 5), 'Top 5: Highest Risk Modules')
  }
}
