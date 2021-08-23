'use strict'

const scores = {
  'readme-exists': -20,
  'readme-size': -10,
  'disk-usage-expanded-size': -15,
  'disk-usage-file-count': -10,
  'disk-usage-dir-count': -10,
  'has-scm-info': -10,
  'scm-tagged-versions': -10,
  'has-install-scripts': -25,
  'has-gyp-file': -20,
  'uses-eval': -20,
  'uses-dynamic-require': -20,
  'missing-strict-mode': -20,
  'has-unsafe-regexps': -50,
  'uses-deprecated-node-apis': -40,
  'has-lost-callback-errs': -30,
  'has-abandoned-promises': -10,
  'has-callback-in-async-function': -25,
  'has-async-without-await': -25,
  license: -100,
  deprecated: -100
}

function calcSev (sev) {
  switch (sev) {
    case 'NONE':
      return 0
    case 'LOW':
      return -10
    case 'MEDIUM':
      return -25
    case 'HIGH':
      return -50
    case 'CRITICAL':
      return -85
    default:
      return 0
  }
}

function score (pkgScores = [], maxSeverity) {
  if (maxSeverity === 4) return 0
  let totalScore = 100
  let sevScore = 0
  pkgScores.forEach(({ pass, group, severity, name }) => {
    switch (group) {
      case 'security':
        sevScore = calcSev(severity)
        if (sevScore !== 0) sevScore += -100
        break
      case 'risk':
        sevScore += calcSev(severity) * 2
        break
      case 'compliance':
        sevScore += calcSev(severity)
        break
    }

    // Quality scores do not affect a package’s risk level
    // https://docs.nodesource.com/ncmv2/docs#quality-severity
    if (!pass && group !== 'quality') {
      sevScore += scores[name] || 0
    }
  })
  totalScore += sevScore
  return Math.max(totalScore, 0)
}

module.exports = score
