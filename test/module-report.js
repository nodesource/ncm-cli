'use strict'

const test = require('ava').default

// Intercept console.log before loading moduleReport because it caches console.log.
let captured = null
const originalLog = console.log
console.log = (...args) => {
  if (captured !== null) {
    captured.push(args.join(' '))
  } else {
    originalLog(...args)
  }
}

const moduleReport = require('../lib/report/module')

// Strip ANSI escape codes so assertions match rendered text cleanly.
// eslint-disable-next-line no-control-regex
const ANSI_RE = /\u001b\[[0-9;]*m/g

function renderWithVulnerability (vuln) {
  const score = {
    group: 'security',
    name: 'vulnerability',
    pass: false,
    severity: vuln.severity || 'HIGH',
    title: vuln.title || 'Test Vulnerability',
    data: vuln.data
  }
  const report = {
    name: 'test-pkg',
    version: '1.0.0',
    scores: [score],
    failures: [score],
    license: { pass: true, data: { spdx: 'MIT' } },
    requirePaths: []
  }

  captured = []
  try {
    moduleReport(report)
    return captured.join('\n').replace(ANSI_RE, '')
  } finally {
    captured = null
  }
}

test.serial('moduleReport links GHSA advisories to GitHub', t => {
  const out = renderWithVulnerability({
    severity: 'CRITICAL',
    title: 'Prototype Pollution (CVE-2021-44906)',
    data: {
      id: 'GHSA-xvch-5gv4-984h',
      vulnerable: ['<1.2.6']
    }
  })

  t.regex(out, /Versions <1\.2\.6 \(Source: GitHub\)/)
  t.regex(out, /\|➔ https:\/\/github\.com\/advisories\/GHSA-xvch-5gv4-984h/)
  t.notRegex(out, /snyk\.io/)
  t.notRegex(out, /Synk/)
})

test.serial('moduleReport links SNYK-* advisories to Snyk', t => {
  const out = renderWithVulnerability({
    title: 'Prototype Pollution',
    data: {
      id: 'SNYK-JS-HANDLEBARS-173692',
      vulnerable: ['<4.0.13']
    }
  })

  t.regex(out, /Versions <4\.0\.13 \(Source: Snyk\)/)
  t.regex(out, /\|➔ https:\/\/snyk\.io\/vuln\/SNYK-JS-HANDLEBARS-173692/)
  t.notRegex(out, /Synk/)
})

test.serial('moduleReport links npm:* advisories to Snyk', t => {
  const out = renderWithVulnerability({
    title: 'Regular Expression Denial of Service (ReDoS)',
    data: {
      id: 'npm:debug:20170905',
      vulnerable: ['>=1.0.0 <2.6.9', '>=3.0.0 <3.1.0']
    }
  })

  t.regex(out, /Versions >=1\.0\.0 <2\.6\.9 >=3\.0\.0 <3\.1\.0 \(Source: Snyk\)/)
  t.regex(out, /\|➔ https:\/\/snyk\.io\/vuln\/npm:debug:20170905/)
  t.notRegex(out, /Synk/)
})

test.serial('moduleReport omits link and source for unknown advisory ids', t => {
  const out = renderWithVulnerability({
    title: 'Prototype Pollution',
    data: {
      id: 'CVE-2021-44906',
      vulnerable: ['<1.2.6']
    }
  })

  t.regex(out, /^Versions <1\.2\.6$/m)
  t.notRegex(out, /Source:/)
  t.notRegex(out, /\|➔/)
})

test.serial('moduleReport uses data.source when id is neither GHSA nor Snyk', t => {
  const out = renderWithVulnerability({
    title: 'Prototype Pollution',
    data: {
      id: 'OSV-2021-1234',
      source: 'OSV',
      vulnerable: ['<1.2.6']
    }
  })

  t.regex(out, /^Versions <1\.2\.6 \(Source: OSV\)$/m)
  t.notRegex(out, /\|➔/)
})

test.serial('moduleReport omits link and source when advisory id is missing', t => {
  const out = renderWithVulnerability({
    title: 'Prototype Pollution',
    data: {
      vulnerable: ['<1.2.6']
    }
  })

  t.regex(out, /^Versions <1\.2\.6$/m)
  t.notRegex(out, /Source:/)
  t.notRegex(out, /\|➔/)
})
