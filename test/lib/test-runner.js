const { test } = require('tap')
const tapeCluster = require('tape-cluster')
const graphql = require('graphql')
const express = require('express')
const expressGraphql = require('express-graphql')
const path = require('path')
const exec = require('child_process').exec

const NCM_BIN = path.join(__dirname, '..', '..', 'bin', 'ncm-cli.js')

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

const mockData = {
  packages: [
    npmPkg
  ]
}

NCMTestRunner.test = buildTester()

module.exports = NCMTestRunner

function NCMTestRunner(opts) {
  this.app = express()

  this.httpServer = null
  this.port = -1
}

NCMTestRunner.prototype.bootstrap = function bootstrap(cb) {
  var self = this
  const api = new NCMAPI(mockData)
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


  this.app.use('/', expressGraphql({
    schema: schema, 
    rootValue: api,
    graphiql: true
  }))

  this.httpServer = this.app.listen(0, function () {
    var addr = self.httpServer.address()
    self.port = addr.port
    cb()
  })
}

NCMTestRunner.prototype.exec = function _exec(cmd, cb) {
  let execCmd = 'NCM_API=http://localhost:' + this.port + 
    ' node ' + NCM_BIN + ' ' + cmd + ' --color=16m'
  exec(execCmd, {
    env: Object.assign({ FORCE_COLOR: 3 }, process.env)
  }, cb)
}

NCMTestRunner.prototype.close = function close(cb) {
  this.httpServer.close(cb)
}

function NCMAPI(mockData) {
  this.mockData = mockData;
}

NCMAPI.prototype.packageVersion = function packageVersion(params) {
  let modules = this.mockData.packages.filter(function findPackage(p) {
    return p.name === params.name &&
      p.version === params.version
  })

  if (modules.length === 0) {
    return null;
  } else if (modules.length === 1) {
    return modules[0]
  } else {
    throw new Error("duplicate module : " + name + "@" + version)
  }
}

// TODO: refactor to use `tape` instead of `tap.test`
function buildTester() {
  let tapeClusterRunner = tapeCluster(test, NCMTestRunner)
  /*  because tap is more overengineered then tape we have to do a workaround 
      here to avoid `t.end()` being called multiple times :(
  */
  return function tester(testName, options, fn) {
    if (!fn && typeof options === 'function') {
        fn = options;
        options = {};
    }

    if (!fn) {
        return testFn(testName);
    }

    tapeClusterRunner(testName, options, function onAssert(cluster, assert) {
      // We have to do this call end only once workaround monkey patch to 
      // work around tap being implemented in a complicated way.

      // The alternative would be to create a pass-through `assert` instance
      // that pass all methods through except it passes the end call through
      // differently ...
      let once = false
      let _end = assert.end
      assert.end = function onlyOnce() {
        if (once) {
          return
        }
        once = true
        _end.apply(assert, arguments)
      }
      fn(cluster, assert)
    })
  }
}