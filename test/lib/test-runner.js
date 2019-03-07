const { test } = require('tap')
const tapeCluster = require('tape-cluster')
const graphql = require('graphql')
const express = require('express')
const expressGraphql = require('express-graphql')
const path = require('path')
const exec = require('child_process').exec

const mockPackages = require('./mock-packages.js')
const NCM_BIN = path.join(__dirname, '..', '..', 'bin', 'ncm-cli.js')

NCMTestRunner.test = buildTester()

module.exports = NCMTestRunner

function NCMTestRunner(opts) {
  this.app = express()

  this.httpServer = null
  this.port = -1
}

NCMTestRunner.prototype.bootstrap = function bootstrap(cb) {
  var self = this
  const api = new NCMAPI({
    packages: mockPackages
  })
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
    input PackageVersionInput {
      name: String
      version: String
    }
    type Query {
      packageVersions(
        packageVersions: [PackageVersionInput!]!
      ): [PackageVersion!]!
      packageVersion(name: String, version: String!): PackageVersion
    }
  `)

  this.app.use('*', function (req, res, next) {
    // console.log('req', {
    //   method: req.method,
    //   url: req.originalUrl,
    //   body: req.body
    // })
    next()
  })

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
  let execCmd = 'NCM_TOKEN=token NCM_API=http://localhost:' + 
    this.port + ' node ' + NCM_BIN + ' ' + cmd + ' --color=16m'
  // console.log('execCmd', execCmd)
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

NCMAPI.prototype.packageVersions = function packageVersions(params) {
  let versions = params.packageVersions

  let modules = this.mockData.packages.filter(function findPackage(p) {
    return versions.some(function (v) {
      return p.name === v.name && p.version === v.version
    })
  })
  return modules
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