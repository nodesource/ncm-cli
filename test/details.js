'use strict'

// const leakedHandles = require('leaked-handles')

const { exec } = require('child_process')
const path = require('path')
const { test } = require('tap')
const graphql = require('graphql')
const express = require('express')
const expressGraphql = require('express-graphql')

const NCM_BIN = path.join(__dirname, '..', 'bin', 'ncm-cli.js')

function buildGraphQLServer() {
  const npmPkg = {
    name: 'npm',
    version: '6.8.0',
    published: true,
    publishedAt: '2019-02-13T23:19:36.131Z',
    description: 'a package manager for JavaScript',
    author: 'audrey.e',
    maintainers: [ 'audrey.e', 'fharper', 'iarna', 'isaacs', 'zkat' ],
    keywords: [ 'install', 'modules', 'package manager', 'package.json' ],
    scores:
    [ { group: 'quality',
       name: 'has-scm-info',
       pass: true,
       severity: 'NONE',
       title:
        'This package version has a git repository at git+https://github.com/npm/cli.git .',
       data: null },
     { group: 'quality',
       name: 'scm-tagged-versions',
       pass: true,
       severity: 'NONE',
       title: 'This package has 100% tagged non-prelease versions in git.',
       data: null },
     { group: 'compliance',
       name: 'license',
       pass: false,
       severity: 'MEDIUM',
       title:
        'This package version license is unacceptable: "Artistic-2.0"',
       data: { spdx: 'Artistic-2.0' } },
     { group: 'quality',
       name: 'readme-exists',
       pass: true,
       severity: 'NONE',
       title: 'This package version has a README file.',
       data: null },
     { group: 'quality',
       name: 'readme-size',
       pass: true,
       severity: 'NONE',
       title: 'This package version has a README file of 4.7 kB.',
       data: null },
     { group: 'risk',
       name: 'has-install-scripts',
       pass: true,
       severity: 'NONE',
       title: 'This package version does not have install scripts.',
       data: null },
     { group: 'risk',
       name: 'has-gyp-file',
       pass: true,
       severity: 'NONE',
       title: 'This package version does not have a Gyp build file.',
       data: null },
     { group: 'risk',
       name: 'uses-deprecated-node-apis',
       pass: true,
       severity: 'NONE',
       title:
        'This package version does not use any deprecated Node APIs.',
       data: null },
     { group: 'risk',
       name: 'has-unsafe-regexps',
       pass: true,
       severity: 'NONE',
       title:
        'This package version does not have unsafe regular expressions.',
       data: null },
     { group: 'risk',
       name: 'deprecated',
       pass: true,
       severity: 'NONE',
       title: 'This package version is not deprecated.',
       data: null },
     { group: 'quality',
       name: 'disk-usage-expanded-size',
       pass: false,
       severity: 'CRITICAL',
       title: 'This package version\'s size on disk is 32.0 MB.',
       data: null },
     { group: 'quality',
       name: 'disk-usage-file-count',
       pass: false,
       severity: 'MEDIUM',
       title: 'This package has 4,028 file(s).',
       data: null },
     { group: 'quality',
       name: 'disk-usage-dir-count',
       pass: false,
       severity: 'MEDIUM',
       title: 'This package has 900 dir(s).',
       data: null },
     { group: 'risk',
       name: 'missing-strict-mode',
       pass: true,
       severity: 'NONE',
       title: 'This package version always uses strict mode.',
       data: null },
     { group: 'risk',
       name: 'has-abandoned-promises',
       pass: true,
       severity: 'NONE',
       title: 'This package version finalizes all detectable promises.',
       data: null },
     { group: 'risk',
       name: 'uses-eval',
       pass: true,
       severity: 'NONE',
       title: 'This package version does not use eval() or implied eval.',
       data: null },
     { group: 'risk',
       name: 'has-lost-callback-errs',
       pass: true,
       severity: 'NONE',
       title: 'This package version handles all callback errors.',
       data: null } ] 
  }

  const db = {
    packages: [
      npmPkg
    ]
  }
  const schema = graphql.buildSchema(`
    scalar JSON
    type Package {
      name: String
      versions: [PackageVersion]
    }
    enum Severity {
      NONE
      LOW
      MEDIUM
      HIGH
      CRITICAL
    }
    type Score {
      group: String!
      name: String!
      pass: Boolean!
      severity: Severity!
      title: String!
      data:  JSON
    }
    type PackageVersion {
      name: String
      version: String
      published: Boolean
      publishedAt: String
      description: String
      author: String
      maintainers: [String!]!
      keywords: [String!]!
      scores: [Score!]!
    }
    type Query {
      packages: [Package]
      package(name: String): Package
      packageVersion(name: String, version: String!): PackageVersion
    }
  `)
  const rootValue = {
    packages: () => db.packages,
    package: name => db.packages.filter(pkg => pkg.name === name),
    packageVersion: (parameters) => {
      let modules = db.packages.filter(function findPackage(p) {
        return p.name === parameters.name &&
          p.version === parameters.version
      })

      if (modules.length === 0) {
        return null;
      } else if (modules.length === 1) {
        return modules[0]
      } else {
        throw new Error("duplicate module : " + name + "@" + version)
      }
    }
  }
  const app = express()
  app.use('*', function log(req, res, next) {
    // console.log('got inbound request', {
    //   url: req.originalUrl,
    //   method: req.method,
    //   body: req.body
    // })
    next()
  })
  app.use('/', expressGraphql({ schema, rootValue, graphiql: true }))
  return app.listen(4000)
}

test('details output matches snapshot', (t) => {
  const cmd = `NCM_API=http://localhost:4000 node ${NCM_BIN} ` +
    `details npm@6.8.0 --color=16m`
  const httpServer = buildGraphQLServer()
  exec(cmd, {
    env: Object.assign({ FORCE_COLOR: 3 }, process.env)
  }, (err, stdout, stderr) => {
    t.equal(err.code, 1)
    t.notOk(stderr)
    t.matchSnapshot(stdout, 'details-output')
    t.ok(/npm @ 6.8.0/.test(stdout))
    t.ok(/No Security Vulnerabilities/.test(stdout))
    t.ok(/Noncompliant license: Artistic-2.0/.test(stdout))

    httpServer.close()
    t.end()
  })
})
