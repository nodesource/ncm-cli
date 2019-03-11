'use strict'

module.exports = shortReport

const summary = require('./summary')
const { moduleList, SEVERITY_RMAP } = require('./util')

const {
  COLORS,
  tooltip
} = require('../ncm-style')
const chalk = require('chalk')
const L = console.log

function shortReport (report, whitelist, dir, argv) {
  summary(report, dir)

  if (whitelist.length > 0) {
    L(chalk`  {${COLORS.yellow} !} ${whitelist.length} used modules whitelisted`)
    L('    ' + tooltip('Run `ncm whitelist --list` for a list'))
    L()
  }

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
    const filterOptions = {
      filterCompliance: filterCompliance,
      filterSecurity: filterSecurity,
      filterLevel: filterLevel
    }

    const filterFormat = formatFilterOptions(filterOptions)
    if (whitelist.length > 0) {
      moduleList(
        whitelist,
        `Whitelisted Filtered Modules (${filterFormat})`,
        filterOptions
      )

      moduleList(
        report,
        `Non-whitelisted Filtered Modules (${filterFormat})`,
        filterOptions
      )
    } else {
      moduleList(
        report,
        `Filtered Modules (${filterFormat})`,
        filterOptions
      )
    }
  } else {
    moduleList(report.slice(0, 5), 'Top 5: Highest Risk Modules')
  }
}

function formatFilterOptions (filterOptions) {
  let str = '--filter='
  if (filterOptions.filterCompliance) {
    str += 'compliance,'
  }
  if (filterOptions.filterSecurity) {
    str += 'security,'
  }
  if (filterOptions.filterLevel) {
    str += SEVERITY_RMAP[filterOptions.filterLevel] + ','
  }
  if (str[str.length - 1] === ',') {
    str = str.slice(0, str.length - 1)
  }
  return str
}
