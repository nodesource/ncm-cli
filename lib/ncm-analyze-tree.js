'use strict'

const { graphql } = require('./util')
const semver = require('semver')
const fs = require('fs')
const path = require('path')

// No need for patches since we're not using universal-module-tree anymore

// Use dependency-tree package instead of universal-module-tree
const dependencyTree = require('dependency-tree')

// Helper function to convert dependency-tree output to a format similar to universal-module-tree
const buildDependencyTree = (filename, directory) => {
  // Make sure directory is absolute
  const absDirectory = path.isAbsolute(directory) ? directory : path.resolve(process.cwd(), directory)

  // Analyze with dependency-tree

  try {
    // Check if the target file exists
    const targetFilePath = path.resolve(absDirectory, filename)
    if (!fs.existsSync(targetFilePath)) {
      // Main file doesn't exist, fall back to package.json
      return { children: [] }
    }

    // Get the dependency tree in object form
    // First attempt: analyze the application code
    const tree = dependencyTree({
      filename: targetFilePath,
      directory: absDirectory,
      filter: path => path.indexOf('node_modules') === -1, // Skip node_modules
      noTypeDefinitions: true // Skip TypeScript definitions
    })

    // Now we need to get npm dependencies from package.json since we excluded node_modules
    // This approach combines both static analysis and package.json info
    // const npmDeps = getNpmDependencies(absDirectory)
    // Mix in the npm dependencies from package.json

    // Convert to a format similar to universal-module-tree
    return convertToUniversalModuleTree(tree, absDirectory)
  } catch (err) {
    // Error analyzing dependencies
    return { children: [] }
  }
}

// Helper function to get npm dependencies from package.json
function getNpmDependencies (directory) {
  const deps = []
  const pkgJsonPath = path.join(directory, 'package.json')

  try {
    if (fs.existsSync(pkgJsonPath)) {
      const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'))

      // Combine all dependency types
      const allDeps = {
        ...pkgJson.dependencies || {},
        ...pkgJson.devDependencies || {},
        ...pkgJson.peerDependencies || {},
        ...pkgJson.optionalDependencies || {}
      }

      // Create a dependency object for each npm package
      for (const [name, version] of Object.entries(allDeps)) {
        // Clean up version strings (remove ^, ~, etc.)
        let cleanVersion = version
        if (typeof version === 'string') {
          cleanVersion = version.replace(/^[^0-9]*/, '')
        }

        deps.push({
          name,
          version: cleanVersion || '0.0.0'
        })
      }
    }
  } catch (err) {
    // Error reading package.json
  }

  return deps
}

// Convert dependency-tree format to universal-module-tree format
function convertToUniversalModuleTree (tree, baseDir) {
  // Get the root node (first key in the object)
  const rootKey = Object.keys(tree)[0]
  if (!rootKey) return { children: [] }

  // Extract package info from package.json if available
  const pkgJsonPath = path.join(baseDir, 'package.json')
  let pkgInfo = { name: path.basename(baseDir), version: '0.0.0' }

  try {
    if (fs.existsSync(pkgJsonPath)) {
      const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'))
      pkgInfo = {
        name: pkgJson.name || pkgInfo.name,
        version: pkgJson.version || pkgInfo.version
      }
    }
  } catch (err) {
    // Ignore package.json errors
  }

  // Add npm dependencies directly to the tree
  const npmDeps = getNpmDependencies(baseDir)

  // Create the root node with children
  const result = {
    data: pkgInfo,
    children: []
  }

  // Process all dependencies from the static analysis
  function processNode (treeNode, parentNode) {
    const deps = Object.keys(treeNode)

    for (const dep of deps) {
      // Extract name and version from the dependency path
      // For simplicity, we'll use the filename as the name
      const name = path.basename(dep, path.extname(dep))

      // Create the child node
      const childNode = {
        data: {
          name,
          version: '0.0.0' // Default version since we don't have this info
        },
        children: []
      }

      // Process subdependencies
      processNode(treeNode[dep], childNode)

      // Add to parent's children
      parentNode.children.push(childNode)
    }
  }

  // Start processing from the root
  if (rootKey) {
    processNode(tree[rootKey], result)
  }

  // Add npm dependencies from package.json as direct children of the root node
  for (const dep of npmDeps) {
    // Add npm package as a direct child
    result.children.push({
      data: {
        name: dep.name,
        version: dep.version
      },
      children: []
    })
  }

  return result
}

const analyze = async ({
  dir,
  token,
  pageSize = 50,
  concurrency = 5,
  onPkgs = () => {},
  filter = () => true,
  url
}) => {
  // Get all dependencies and apply filter
  const rawDeps = await readUniversalTree(dir)
  const pkgs = filterPkgs(rawDeps, filter)

  onPkgs(pkgs)

  const data = new Set()
  const pages = splitSet(pkgs, pageSize)
  const batches = splitSet(pages, concurrency)
  // Process each batch

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
  // let validCounter = 0
  // let invalidCounter = 0
  // let skippedCounter = 0

  for (const pkg of pkgs) {
    const id = `${pkg.name}${pkg.version}`
    if (!semver.valid(pkg.version)) {
      // invalidCounter++

      continue
    }

    if (map.get(id)) {
      // skippedCounter++
      continue
    }

    if (fn(pkg)) {
      map.set(id, pkg)
      // validCounter++
    } else {
      // skippedCounter++
    }
  }

  // Filtering complete

  const clean = new Set()
  for (const [, pkg] of map) clean.add(pkg)
  return clean
}

const id = node => `${node.data.name}@${node.data.version}`

// This function is only used as a fallback now, using the getNpmDependencies function
// to directly extract package.json dependencies in our main workflow
// async function readPackagesFromPackageJson(dir) {
//   const npmDeps = getNpmDependencies(dir);

//   // Convert to the same format as the tree structure
//   const pkgJsonPath = path.join(dir, 'package.json');
//   let pkgInfo = { name: path.basename(dir), version: '0.0.0' };

//   try {
//     if (fs.existsSync(pkgJsonPath)) {
//       const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
//       pkgInfo = {
//         name: pkgJson.name || pkgInfo.name,
//         version: pkgJson.version || pkgInfo.version
//       };
//     }
//   } catch (err) {
//     // Ignore package.json errors
//   }

//   // Create result structure
//   const result = {
//     data: pkgInfo,
//     children: []
//   };

//   // Add all npm dependencies as children
//   for (const dep of npmDeps) {
//     result.children.push({
//       data: {
//         name: dep.name,
//         version: dep.version
//       },
//       children: []
//     });
//   }

//   return result;
// }

const readUniversalTree = async dir => {
  let treeResult

  try {
    // Use our new dependency tree builder instead of universalModuleTree
    // First, find the main file from package.json or use typical entry points
    const pkgJsonPath = path.join(dir, 'package.json')
    let mainFile = null
    let pkgJson = null

    if (fs.existsSync(pkgJsonPath)) {
      try {
        pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'))
        if (pkgJson.main) {
          mainFile = pkgJson.main
        } else if (pkgJson.bin) {
          // If there's no main but there is a bin field, use the first bin entry
          if (typeof pkgJson.bin === 'string') {
            mainFile = pkgJson.bin
          } else if (typeof pkgJson.bin === 'object') {
            // Use the first bin entry if it's an object
            const firstBin = Object.values(pkgJson.bin)[0]
            if (firstBin) {
              mainFile = firstBin
            }
          }
        }
      } catch (e) {
        // Ignore package.json errors
        // Error reading package.json
      }
    }

    // Check if the main file exists, otherwise try common entry points
    if (mainFile && !fs.existsSync(path.join(dir, mainFile))) {
      // Main file not found, trying alternatives
      mainFile = null
    }

    if (!mainFile) {
      // Try common entry points
      const possibleEntryPoints = [
        'index.js',
        'app.js',
        'server.js',
        'main.js',
        'bin/index.js',
        'lib/index.js'
      ]

      // If we have package.json info, try using the name as entry point
      if (pkgJson && pkgJson.name) {
        possibleEntryPoints.unshift(`bin/${pkgJson.name}.js`)
        possibleEntryPoints.unshift(`${pkgJson.name}.js`)
      }

      for (const entryPoint of possibleEntryPoints) {
        if (fs.existsSync(path.join(dir, entryPoint))) {
          mainFile = entryPoint

          break
        }
      }

      // If still no main file found, make one last attempt with bin directory
      if (!mainFile && fs.existsSync(path.join(dir, 'bin'))) {
        try {
          const binFiles = fs.readdirSync(path.join(dir, 'bin'))
          if (binFiles.length > 0) {
            // Use the first .js file in the bin directory
            const jsFile = binFiles.find(file => file.endsWith('.js'))
            if (jsFile) {
              mainFile = `bin/${jsFile}`
            }
          }
        } catch (e) {
          // Ignore errors reading bin directory
        }
      }
    }

    // Starting dependency analysis

    // Build the dependency tree starting from the main file
    treeResult = buildDependencyTree(mainFile, dir)

    // We should always have dependencies from package.json now
    // but fall back to the old method if something goes wrong
    if (!treeResult || !treeResult.children || treeResult.children.length === 0) {
      // Using fallback package detection from package.json
      treeResult = await readPackagesFromPackageJson(dir)
    }
  } catch (err) {
    // Try to find packages by reading package.json
    try {
      // Using fallback package detection from package.json
      treeResult = await readPackagesFromPackageJson(dir)
    } catch (fallbackErr) {
      // Fallback also failed
      return new Set()
    }
  }

  // At this point, we must have a valid tree from either dependency-tree or package.json
  // Get packages from the tree structure
  const pkgs = new Map()

  const walk = (node, path) => {
    // Check if node is valid
    if (!node || !node.data) return

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
      for (const child of (node.children || [])) {
        walk(child, [...path, node])
      }
    }
  }

  // Start walking from the tree structure
  if (treeResult instanceof Set) {
    // Direct Set result from readPackagesFromPackageJson
    return treeResult
  }

  // Now we know treeResult is an object, not a Set
  const treeObj = treeResult

  if (treeObj && treeObj.data) {
    // Single root node case
    walk(treeObj, [])
  } else if (treeObj && treeObj.children && Array.isArray(treeObj.children)) {
    // Multiple children case
    for (const child of treeObj.children) {
      if (child && child.data) {
        walk(child, [])
      }
    }
  }

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
    // datum.paths = [...pkgs][i].paths
    data.add(datum)
  }

  // Packages were evaluated by NCM service

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

// Function to read packages from package.json
async function readPackagesFromPackageJson (dir) {
  const packageJsonPath = path.join(dir, 'package.json')

  // Check if package.json exists
  if (!fs.existsSync(packageJsonPath)) {
    // No package.json found
    return new Set()
  }

  // Read and parse package.json
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
  const result = new Set()

  // Add the main package
  if (packageJson.name && packageJson.version) {
    result.add({
      name: packageJson.name,
      version: packageJson.version
    })
  }

  // Add dependencies
  if (packageJson.dependencies) {
    for (const [name, version] of Object.entries(packageJson.dependencies)) {
      // Clean up the version string (remove ^, ~, etc.)
      const cleanVersion = version.replace(/[^\d.]/g, '') || version
      result.add({
        name,
        version: cleanVersion
      })
    }
  }

  // Add devDependencies
  if (packageJson.devDependencies) {
    for (const [name, version] of Object.entries(packageJson.devDependencies)) {
      // Clean up the version string
      const cleanVersion = version.replace(/[^\d.]/g, '') || version
      result.add({
        name,
        version: cleanVersion
      })
    }
  }

  // Add peerDependencies
  if (packageJson.peerDependencies) {
    for (const [name, version] of Object.entries(packageJson.peerDependencies)) {
      // Clean up the version string
      const cleanVersion = version.replace(/[^\d.]/g, '') || version
      result.add({
        name,
        version: cleanVersion
      })
    }
  }

  return result
}

module.exports = analyze
