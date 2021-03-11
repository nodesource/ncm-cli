'use strict'

// In order to work around windows shell issues...
const spawn = require('cross-spawn')
const { getValue } = require('../lib/config')
const clientRequest = require('../lib/client-request')
const { queryReadline, reversedSplit } = require('../lib/util')
const details = require('./details')
const {
  COLORS,
  line,
  failure
} = require('../lib/ncm-style')
const { helpHeader } = require('../lib/help')
const rc = require('rc')
const chalk = require('chalk')
const semver = require('semver')
const universalModuleTree = require('universal-module-tree')

const L = console.log
const E = console.error

module.exports = install
module.exports.optionsList = optionsList

const id = node => `${node.data.name}@${node.data.version}`
const publicRegistryUrl = 'https://registry.npmjs.org/'

const readUniversalTree = async dir => {
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

  for (const child of tree.children) {
    walk(child, [])
  }

  const set = new Set()
  for (const [, pkg] of pkgs) set.add(pkg)
  return set
}

const registryUrl = scope => {
  const result = rc('npm', { registry: publicRegistryUrl })
  const url = result[`${scope}:registry`] || result.config_registry || result.registry
  return url.slice(-1) === '/' ? url : `${url}/`
}

const filterPkgs = (pkgs) => {
  const map = new Map()
  for (const pkg of pkgs) {
    const id = `${pkg.name}${pkg.version}`
    if (semver.valid(pkg.version) && !map.get(id)) {
      map.set(id, pkg)
    }
  }

  const clean = new Set()
  for (const [, pkg] of map) clean.add(pkg)
  return [...clean]
}

const scannerLog = () => {
  L()
  L(chalk`Scanning npm dependency substitution vulnerabilities before installing...`)
  L()
}

async function install (argv, arg1, arg2, arg3) {
  const childArgv = Array.from(process.argv.slice(3))
  const regUrl = registryUrl()
  const privateRegistryUrl = regUrl.endsWith('/') ? regUrl : `${regUrl}/`
  let name
  let version

  if (!arg1) {
    try {
      scannerLog()

      const pkgTree = filterPkgs(await readUniversalTree(process.cwd()))
      for (const pkg of pkgTree) {
        try {
          name = pkg.name
          if (!name) continue
          if (name.includes('/')) continue

          const { body: { versions = {} } } = await clientRequest({
            method: 'GET',
            uri: `${privateRegistryUrl}${name}`,
            json: true,
            opted: true
          })
          if (!Object.keys(versions).length) continue

          const { url: privateRepoUrl } = versions[(Object.keys(versions)[0])].repository
          if (!privateRepoUrl) continue

          const { body: { versions: pubVers = {} } } = await clientRequest({
            method: 'GET',
            uri: `${publicRegistryUrl}${name}`,
            json: true,
            opted: true
          })
          if (!Object.keys(pubVers).length) continue

          const { url: pubRepoUrl } = versions[(Object.keys(versions)[0])].repository
          if (!pubRepoUrl) continue
          if (privateRepoUrl !== pubRepoUrl) {
            E(chalk.red(`[ERROR] "${name}" is vulnerable to npm substitution attacks. Please use scopes for the internal packages and try again`))
            process.exit(1)
          }
        } catch (_) {} // TODO: err handler
      }
    } catch (err) {} // TODO: err handler

    L()
    L(chalk`Passed. Now installing...`)
    L()

    const args = [getValue('installCmd'), null, ...childArgv]
    const bin = getValue('installBin')
    const cp = spawn(bin, args, { stdio: 'inherit' })

    cp.on('error', error => {
      E()
      E(chalk`{COLORS.red ${error}}`)
      E()
    })
    cp.on('exit', code => {
      process.exitCode = code
    })
    return
  } else if (arg1.lastIndexOf('@') > 0 && !arg2 && !arg3) {
    childArgv.splice(childArgv.indexOf(arg1), 1)
    ;[name, version] = reversedSplit(arg1, /@(?!$)/)
  } else if (arg2 === '@' && arg3) {
    name = arg1
    version = arg3
    childArgv.splice(childArgv.indexOf(arg1), 1)
    childArgv.splice(childArgv.indexOf(arg2), 1)
    childArgv.splice(childArgv.indexOf(arg3), 1)
  } else if (arg1) {
    name = arg1
    version = arg2 || 'latest'
    childArgv.splice(childArgv.indexOf(arg1), 1)
    if (arg2) childArgv.splice(childArgv.indexOf(arg2), 1)
  } else {
    printHelp()
    process.exitCode = 1
    return
  }

  await details(argv, arg1, arg2, arg3)

  const good = process.exitCode === 0 || process.exitCode === undefined

  const confirm = good ? `${COLORS.green} (Y/n)` : `${COLORS.red} (y/N)`

  L(line('|➔', chalk`Install this module? {${confirm}}`, COLORS.yellow))
  L()

  let choice
  if (argv.force) {
    choice = 'y'
  } else if (process.stdin.isTTY) {
    choice = (await queryReadline(chalk`{${COLORS.light1} > }`)).trim().toLowerCase()
  } else {
    choice = good ? 'y' : 'n'
  }

  if ((good && choice === '') || choice === 'y') {
    scannerLog()

    try {
      if (!name.includes('/')) {
        const { body: { versions = {} } } = await clientRequest({
          method: 'GET',
          uri: `${privateRegistryUrl}${name}`,
          json: true,
          opted: true
        })
        if (Object.keys(versions).length) {
          const { url: privateRepoUrl } = versions[(Object.keys(versions)[0])].repository
          if (privateRepoUrl) {
            const { body: { versions: pubVers = {} } } = await clientRequest({
              method: 'GET',
              uri: `${publicRegistryUrl}${name}`,
              json: true,
              opted: true
            })
            if (Object.keys(pubVers).length) {
              const { url: pubRepoUrl } = versions[(Object.keys(versions)[0])].repository
              if (pubRepoUrl && (privateRepoUrl !== pubRepoUrl)) {
                E(chalk.red(`[ERROR] "${name}@${version}" is vulnerable to npm substitution attacks. Please use scopes for the internal packages and try again`))
                process.exitCode = 1
              }
            }
          }
        }
      }
    } catch (err) {
      // TODO: err handler
    }

    const args = [getValue('installCmd'), `${name}@${version}`, ...childArgv]
    const bin = getValue('installBin')

    L()
    L(chalk`Running: {${COLORS.teal} ${bin} ${args.join(' ')}}`)
    L()

    const cp = spawn(bin, args, { stdio: 'inherit' })
    cp.on('error', error => {
      E()
      E(chalk`{COLORS.red ${error}}`)
      E()
    })
    cp.on('exit', code => {
      process.exitCode = code
    })
  } else {
    L()
    L(failure(chalk`Did {bold not} install ${name}@${version}`))
    L()
  }
}

function printHelp () {
  helpHeader(
    'install',
    chalk`{${COLORS.light1} ncm} {${COLORS.yellow} install} {${COLORS.teal} <module\{@version\}> [options] [npm options]}`,
    'ncm install <module{@version}> [options] [npm options]',
    chalk`
Runs and displays {${COLORS.light1} "ncm details <module\{@version\}>"} with an interactive confirmation prompt.
If confirmed, attempts to run {${COLORS.light1} "npm install <module\{@version\}>"} with any additional options provided.

{italic The config keys {${COLORS.yellow} installBin} and {${COLORS.yellow} installCmd} can adjust this to work with other package installers if necessary.}
    `
  )

  L(optionsList())
  L()
}

function optionsList () {
  return chalk`
{${COLORS.light1} ncm} {${COLORS.yellow} install} {${COLORS.teal} <module\{@version\}> [npm options]}
{${COLORS.light1} ncm} {${COLORS.yellow} i} {${COLORS.teal} <module\{@version\}> [npm options]}
  {${COLORS.teal} -d, --dir} {white Directory to check for dependency path}
  `.trim()
}
