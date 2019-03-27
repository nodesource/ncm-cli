const { test } = require('tap')
const tapeCluster = require('tape-cluster')
const graphql = require('graphql')
const express = require('express')
const expressGraphql = require('express-graphql')
const path = require('path')
const exec = require('child_process').exec

const mockPackages = require('./mock-packages.js')
const NCM_BIN = path.join(__dirname, '..', '..', 'bin', 'ncm-cli.js')

NCMTestRunner.test = tapeCluster(test, NCMTestRunner)

module.exports = NCMTestRunner

function NCMTestRunner (opts) {
  this.app = express()

  this.httpServer = null
  this.port = -1
}

NCMTestRunner.prototype.bootstrap = function bootstrap (cb) {
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
    type Policy {
      id: String
      name: String
      organizationId: String
      whitelist: [WhitelistEntry!]!
    }
    type WhitelistEntry {
      name: String!
      version: String!
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
      policies(organizationId: String!): [Policy!]
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

  this.app.use('/accounts/user/details', function (req, res, next) {
    res.send({})
    res.statusCode = 200

    next()
  })

  this.app.use('/ncm2/api/v2/graphql', expressGraphql({
    schema: schema,
    rootValue: api,
    graphiql: true
  }))

  this.httpServer = this.app.listen(0, () => {
    var addr = this.httpServer.address()
    this.port = addr.port
    cb()
  })
}

NCMTestRunner.prototype.exec = function _exec (cmd, cb) {
  let execCmd = 'NCM_TOKEN=token NCM_API=http://localhost:' +
    this.port + ' node ' + NCM_BIN + ' ' + cmd + ' --color=16m'
  exec(execCmd, {
    env: Object.assign({ FORCE_COLOR: 3 }, process.env)
  }, cb)
}

NCMTestRunner.prototype.close = function close (cb) {
  this.httpServer.close(cb)
}

function NCMAPI (mockData) {
  this.mockData = mockData
}

NCMAPI.prototype.packageVersion = function packageVersion (params) {
  let modules = this.mockData.packages.filter(function findPackage (p) {
    return p.name === params.name &&
      p.version === params.version
  })

  if (modules.length === 0) {
    return null
  } else if (modules.length === 1) {
    return modules[0]
  } else {
    throw new Error('duplicate module : ' + params.name +
      '@' + params.version)
  }
}

NCMAPI.prototype.packageVersions = function packageVersions (params) {
  let versions = params.packageVersions

  let modules = this.mockData.packages.filter(function findPackage (p) {
    return versions.some(function (v) {
      return p.name === v.name && p.version === v.version
    })
  })
  return modules
}

NCMAPI.prototype.policies = function policies (params) {
  return []
}
