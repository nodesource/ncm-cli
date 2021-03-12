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

const scannerLog = () =>
  L(chalk`[NCM::SECURITY] Scanning npm dependency substitution vulnerabilities...`)

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

          L(`[NCM::SECURITY] Verifying the package "${name}"`)

          const { body: { versions = {} } } = await clientRequest({
            method: 'GET',
            uri: `${privateRegistryUrl}${name}`,
            json: true,
            opted: true
          })
          let verLen = Object.keys(versions).length
          if (!verLen) continue

          const { integrity: privateIntegrity } = versions[(Object.keys(versions)[verLen - 1])].dist
          if (!privateIntegrity) continue

          const { body: { versions: pubVers = {} } } = await clientRequest({
            method: 'GET',
            uri: `${publicRegistryUrl}${name}`,
            json: true,
            opted: true
          })
          verLen = Object.keys(pubVers).length
          if (!verLen) continue

          const { integrity: publicIntegrity } = pubVers[(Object.keys(pubVers)[verLen - 1])].dist

          if (!publicIntegrity) continue
          if (privateIntegrity !== publicIntegrity) {
            E(chalk.red(`[NCM::SECURITY ISSUE DETECTED] "${name}" is vulnerable to npm substitution attacks. Use scopes for the internal packages to fix this`))
            process.exit(1)
          }
        } catch (_err) {
          E(_err)
        }
      }
    } catch (err) {
      E(err)
    }

    L(chalk`[NCM::SECURITY] Passed. Now installing...`)
    L()

    const args = [getValue('installCmd'), '', ...childArgv]
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

  try {
    scannerLog()

    if (!name.includes('/')) {
      const { body: { versions = {} } } = await clientRequest({
        method: 'GET',
        uri: `${privateRegistryUrl}${name}`,
        json: true,
        opted: true
      })
      let verLen = Object.keys(versions).length
      if (verLen) {
        const { integrity: privateIntegrity } = versions[(Object.keys(versions)[verLen - 1])].dist
        if (privateIntegrity) {
          const { body: { versions: pubVers = {} } } = await clientRequest({
            method: 'GET',
            uri: `${publicRegistryUrl}${name}`,
            json: true,
            opted: true
          })
          verLen = Object.keys(pubVers).length
          if (verLen) {
            const { integrity: publicIntegrity } = pubVers[(Object.keys(pubVers)[verLen - 1])].dist
            if (publicIntegrity && (privateIntegrity !== publicIntegrity)) {
              E(chalk.red(`[NCM::SECURITY ISSUE DETECTED] "${name}@${version}" is vulnerable to npm substitution attacks. Use scopes for the internal packages to fix this`))
              process.exit(1)
            }
          }
        }
      }
    }
  } catch (err) {
    E(err)
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
