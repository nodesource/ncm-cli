'use strict'

const chalk = require('chalk')
const semver = require('semver')

const {
  COLORS,
  divider
} = require('../ncm-style')
const L = console.log

const SEVERITY_RMAP = [
  'NONE',
  'LOW',
  'MEDIUM',
  'HIGH',
  'CRITICAL'
]
const W = [
  40, // Module Name
  12, // Risk Score
  23, // License
  15 // Security
]

const SEVERITY_COLOR = {
  CRITICAL: COLORS.red,
  HIGH: COLORS.orange,
  MEDIUM: COLORS.yellow,
  LOW: COLORS.light1,
  NONE: COLORS.base
}

module.exports = {
  W,
  SEVERITY_RMAP,
  SEVERITY_COLOR,
  severityMeter,
  severityText,
  severityTextLabel,
  shortVulnerabilityList,
  moduleList,
  moduleSort,
  summaryInfo,
  filterVulns,
  filterReport,
  parseFilterOptions,
  formatFilterOptions
}

function filterReport (report, options) {
  const out = []

  if (!options.filterCompliance &&
    !options.filterSecurity &&
    options.filterLevel === 0
  ) {
    return report
  }

  const minimumSeverity = options.filterLevel
  for (const pkg of report) {
    const hasComplianceFailure = pkg.scores.some(
      s => s.group === 'compliance' && !s.pass
    )
    if (options.filterCompliance && !hasComplianceFailure) {
      continue
    }
    if (options.filterSecurity || options.filterLevel > 0) {
      if (!pkg.failures) {
        continue
      }

      const hasSecurityFailure = pkg.failures.some(
        f => f.group === 'security' &&
          SEVERITY_RMAP.indexOf(f.severity) >= minimumSeverity
      )
      if (!hasSecurityFailure) {
        continue
      }
    }

    out.push(pkg)
  }

  return out
}

function moduleList (report, title, options) {
  L(divider(W[0] + W[1] + W[2] + W[3] + 7, '─'))
  L(chalk`{${COLORS.light1}   ${title}}`)
  L(divider(W[0] + W[1] + W[2] + W[3] + 7))

  report = moduleSort(report)
  if (options) {
    report = filterReport(report, options)
    if (report.length === 0) {
      return
    }
  }

  /* Module List */
  L(chalk`{${COLORS.light1}   Module Name${' '.repeat(W[0] - 9)}Risk${' '.repeat(W[1] - 3)}License${' '.repeat(W[2] - 6)}Security}`)
  L(chalk`{${COLORS.light1} ┌──${'─'.repeat(W[0])}┬${'─'.repeat(W[1])}┬${'─'.repeat(W[2])}┬${'─'.repeat(W[3])}┐}`)

  report.forEach((pkg, ind) => {
    const version = String(pkg.version)
    /* Module Name */
    let mod = pkg.name + ' @ ' + version
    // truncate name text to fit within column
    const sliceLen = W[0] - 4 - version.length
    if (mod.length + 3 > W[0]) mod = `${pkg.name.slice(0, sliceLen)}… @ ${version}`

    if (pkg.published) {
      let license = pkg.license &&
                    pkg.license.data &&
                    pkg.license.data.spdx
        ? pkg.license.data.spdx
        : 'UNKNOWN'

      // truncate license text to fit within column
      if (license.length + 3 > W[2]) license = license.slice(0, W[2] - 4) + '…'

      const licenseBadge = pkg.license && pkg.license.pass
        ? chalk`{${COLORS.green} ✓}`
        : chalk`{${COLORS.red} X}`

      /* security badge */
      const vulns = filterVulns(pkg.failures)
      const securityBadges = [
        vulns.reduce((a, b) => a + b, 0) === 0
          ? chalk`{${COLORS.green} ✓} 0` : chalk`{${COLORS.red} X} `,
        vulns[3] > 0 ? chalk`{${COLORS.red} ${vulns[3]}C} ` : '',
        vulns[2] > 0 ? chalk`{${COLORS.orange} ${vulns[2]}H} ` : '',
        vulns[1] > 0 ? chalk`{${COLORS.yellow} ${vulns[1]}M} ` : '',
        vulns[0] > 0 ? chalk`{${COLORS.light1} ${vulns[0]}L} ` : ''
      ]

      /* risk badge */
      const riskMeter = severityMeter(SEVERITY_RMAP[pkg.maxSeverity])
      const riskLabel = severityTextLabel(SEVERITY_RMAP[pkg.maxSeverity])
      const riskBadge = riskMeter + ' ' + riskLabel

      /* printing */
      L(
        // module label with left and right bar
        chalk`{${COLORS.light1} │} ${mod} ${' '.repeat(W[0] - mod.length)}{${COLORS.light1} │} ` +

        // risk badge with right bar
        riskBadge + chalk`${' '.repeat(W[1] - 10)}{${COLORS.light1} │} ` +

        // license badge with right bar
        licenseBadge + chalk` ${license}${' '.repeat(W[2] - license.length - 3)}{${COLORS.light1} │} ` +

        // security badge with right bar
        securityBadges.join('') + chalk`${' '.repeat(W[3] - 2 - securityBadges.filter(x => x !== '').length * 2)}{${COLORS.light1} │}`
      )
    } else {
      /* printing */
      L(
        // module label with left and right bar
        chalk`{${COLORS.light1} │} ${mod} ${' '.repeat(W[0] - mod.length)}{${COLORS.light1} │} ` +

        // spacing with right bar
        chalk`${' '.repeat(W[1] - 1)}{${COLORS.light1} │}` +

        // spacing with right bar
        chalk`${' '.repeat(W[2])}{${COLORS.light1} │}` +

        // spacing with right bar
        chalk`${' '.repeat(W[3])}{${COLORS.light1} │}`
      )
    }

    /* Cell Divider */
    if (ind === report.length - 1) {
      L(chalk`{${COLORS.light1} └──${'─'.repeat(W[0])}┴${'─'.repeat(W[1])}┴${'─'.repeat(W[2])}┴${'─'.repeat(W[3])}┘}`)
    }
    // } else if (dividers) {
    //   L(chalk`{${COLORS.light1} ├──${'─'.repeat(W[0])}┼${'─'.repeat(W[1])}┼${'─'.repeat(W[2])}┼${'─'.repeat(W[3])}┤}`)
    // }
  })
}

function shortVulnerabilityList (report) {
  const netSecurity = {
    LOW: 0,
    MEDIUM: 0,
    HIGH: 0,
    CRITICAL: 0,
    AFFECTED: new Set()
  }

  for (const pkg of report) {
    for (const failure of pkg.failures || []) {
      if (failure.group === 'security') {
        netSecurity[failure.severity]++
        netSecurity.AFFECTED.add(pkg.name)
      }
    }
  }

  const vulnerabilityCount = netSecurity.CRITICAL + netSecurity.HIGH + netSecurity.MEDIUM + netSecurity.LOW
  const securityBadge = vulnerabilityCount > 0 ? `${COLORS.red} !` : `${COLORS.green} ✓`
  if (netSecurity.AFFECTED.size > 0) {
    L(chalk`  {${securityBadge}} ${vulnerabilityCount} security vulnerabilities found across ${netSecurity.AFFECTED.size} modules`)
  } else {
    L(chalk`  {${securityBadge}} ${vulnerabilityCount} security vulnerabilities found`)
  }
  L(chalk`    {${COLORS.red} C} ${netSecurity.CRITICAL} critical severity`)
  L(chalk`    {${COLORS.orange} H} ${netSecurity.HIGH} high severity`)
  L(chalk`    {${COLORS.yellow} M} ${netSecurity.MEDIUM} medium severity`)
  L(chalk`    {${COLORS.light1} L} ${netSecurity.LOW} low severity`)

  return vulnerabilityCount
}

function moduleSort (report) {
  report.sort((a, b) => {
    if (a.maxSeverity > b.maxSeverity) return -1
    if (b.maxSeverity > a.maxSeverity) return 1
    if (a.name < b.name) return -1
    if (b.name < a.name) return 1
    return semver.compare(a.version, b.version)
  })
  return report
}

function severityMeter (severity) {
  const risk = SEVERITY_RMAP.indexOf(severity)

  return [
    chalk`{${SEVERITY_COLOR[severity]} ${'|'.repeat(risk)}}`,
    chalk`{${COLORS.base} ${'|'.repeat(4 - risk)}}`
  ].join('')
}

function severityText (severity) {
  const formatted = severity[0].toUpperCase() + severity.slice(1).toLowerCase()
  return chalk`{${SEVERITY_COLOR[severity]} ${formatted}}`
}

function severityTextLabel (severity) {
  const severityLabel = {
    CRITICAL: 'Crit',
    HIGH: 'High',
    MEDIUM: 'Med ',
    LOW: 'Low ',
    NONE: 'None'
  }
  const color = severity === 'NONE' ? COLORS.base : COLORS.light1
  return chalk`{${color} ${severityLabel[severity]}}`
}

function summaryInfo (report) {
  const riskCount = [0, 0, 0, 0, 0]
  let insecureModules = 0
  let complianceCount = 0
  let securityCount = 0

  for (const pkg of report) {
    let insecure = false
    let pkgMaxSeverity = 0
    for (const score of pkg.scores) {
      if (score.group === 'quality') continue
      if (score.group === 'compliance' && !score.pass) complianceCount++
      if (score.group === 'security' && !score.pass) {
        securityCount++
        insecure = true
      }
      const scoreIndex = SEVERITY_RMAP.indexOf(score.severity)
      pkgMaxSeverity = scoreIndex > pkgMaxSeverity ? scoreIndex : pkgMaxSeverity
    }
    riskCount[pkgMaxSeverity]++
    if (insecure) insecureModules++
  }

  return { riskCount, insecureModules, complianceCount, securityCount }
}

function filterVulns (failures) {
  const vulns = [0, 0, 0, 0]
  for (const { group, severity } of failures) {
    if (group === 'security') {
      if (severity === 'CRITICAL') vulns[3]++
      if (severity === 'HIGH') vulns[2]++
      if (severity === 'MEDIUM') vulns[1]++
      if (severity === 'LOW') vulns[0]++
    }
  }

  return vulns
}

function parseFilterOptions (argv) {
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

  const filterOptions = {
    filterCompliance: filterCompliance,
    filterSecurity: filterSecurity,
    filterLevel: filterLevel
  }

  return filterOptions
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
