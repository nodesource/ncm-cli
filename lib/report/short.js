'use strict'

module.exports = shortReport

const summary = require('./summary')
const {
  moduleList,
  parseFilterOptions,
  formatFilterOptions
} = require('./util')

const {
  COLORS,
  tooltip
} = require('../ncm-style')
const chalk = require('chalk')
const L = console.log

function shortReport (report, whitelist, dir, argv) {
  const filterOptions = parseFilterOptions(argv)

  summary(report, dir, filterOptions)

  if (whitelist.length > 0) {
    L(chalk`  {${COLORS.yellow} !} ${whitelist.length} used modules whitelisted`)
    L('    ' + tooltip('Run `ncm whitelist --list` for a list'))
    L()
  }

  if (filterOptions.filterCompliance || filterOptions.filterSecurity || filterOptions.filterLevel > 0) {
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
