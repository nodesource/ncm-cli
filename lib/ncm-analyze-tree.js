'use strict'

const fs = require('fs')
const { graphql } = require('./util')
const universalModuleTree = require('universal-module-tree')
const semver = require('semver')

const analyze = async ({
  dir,
  token,
  pageSize = 50,
  concurrency = 5,
  onPkgs = () => {},
  filter = () => true,
  url
}) => {
  const rawDeps = await readUniversalTree(dir)
  const pkgs = filterPkgs(rawDeps, filter)

  onPkgs(pkgs)

  const data = new Set()
  const pages = splitSet(pkgs, pageSize)
  const batches = splitSet(pages, concurrency)

  for (const batch of batches) {
    await Promise.all([...batch].map(async page => {
      const fetchedData = await fetchData({ pkgs: page, token, url })
      for (const datum of fetchedData) {
        data.add(datum)
      }
    }))
  }

  return data
}

const filterPkgs = (pkgs, fn) => {
  const map = new Map()
  for (const pkg of pkgs) {
    const id = `${pkg.name}${pkg.version}`
    if (!semver.valid(pkg.version)) continue
    if (map.get(id)) continue
    if (fn(pkg)) map.set(id, pkg)
  }

  const clean = new Set()
  for (const [, pkg] of map) clean.add(pkg)
  return clean
}

const id = node => `${node.data.name}@${node.data.version}`

const readUniversalTree = async dir => {
  let lockJson = null
  try {
    const content = await fs.promises.readFile(`${dir}/package-lock.json`, 'utf8')
    lockJson = JSON.parse(content)
  } catch (_) {}

  if (lockJson && !lockJson.dependencies && lockJson.packages) {
    const set = new Set()
    for (const [pkgPath, pkgData] of Object.entries(lockJson.packages)) {
      if (!pkgPath) continue
      const parts = pkgPath.split('node_modules/')
      const name = parts[parts.length - 1]
      const version = pkgData.version
      if (!name || !version) continue
      set.add({ name, version, paths: [[]] })
    }
    return set
  }

  const tree = await universalModuleTree(dir)
  const pkgs = new Map()

  const walk = (node, path) => {
    let pkgObj
    if (pkgs.has(id(node))) {
      pkgObj = pkgs.get(id(node))
      pkgObj.paths.push(path)
    } else {
      pkgObj = {
        name: node.data.name,
        version: node.data.version,
        paths: [path]
      }
      pkgs.set(id(node), pkgObj)
      for (const child of node.children) {
        walk(child, [...path, node])
      }
    }
  }

  for (const child of tree.children) walk(child, [])

  const set = new Set()
  for (const [, pkg] of pkgs) set.add(pkg)
  return set
}

const fetchData = async ({ pkgs, token, url }) => {
  const query = `
    query getPackageVersions($packageVersions: [PackageVersionInput!]!) {
      packageVersions(packageVersions: $packageVersions) {
        name
        version
        published
        publishedAt
        scores {
          group
          name
          pass
          severity
          title
          data
        }
      }
    }
  `

  const variables = {
    packageVersions: [...pkgs].map(({ name, version }) => ({ name, version }))
  }

  const res = await graphql(url, query, variables)

  const data = new Set()
  for (const datum of res.packageVersions) {
    data.add(datum)
  }

  return data
}

const splitSet = (set, n) => {
  const buckets = new Set()
  let bucket
  for (const member of set) {
    if (!bucket) bucket = new Set()
    bucket.add(member)
    if (bucket.size === n) {
      buckets.add(bucket)
      bucket = null
    }
  }
  if (bucket) buckets.add(bucket)
  return buckets
}

module.exports = analyze
