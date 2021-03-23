'use strict'

// In order to work around windows shell issues...
const spawn = require('cross-spawn')
const { getValue, setValue } = require('../lib/config')
const clientRequest = require('../lib/client-request')
const { queryReadline, reversedSplit } = require('../lib/util')
const details = require('./details')
const {
  COLORS,
  line,
  failure
} = require('../lib/ncm-style')
const { helpHeader } = require('../lib/help')
const path = require('path')
const rc = require('rc')
const chalk = require('chalk')

const L = console.log
const E = console.error

module.exports = install
module.exports.optionsList = optionsList

const publicRegistryUrl = 'https://registry.npmjs.org/'
const cachedPublicPackages = getValue('cachedPublicPackages')

const registryUrl = scope => {
  const result = rc('npm', { registry: publicRegistryUrl })
  const url = result[`${scope}:registry`] || result.config_registry || result.registry
  return url.slice(-1) === '/' ? url : `${url}/`
}

const scannerLog = () =>
  L(chalk`[NCM::SECURITY] Scanning npm dependency substitution vulnerabilities...`)

const concurrentTaskQueue = []
const verificationTask = async ({ name, privateRegistryUrl }) => {
  try {
    L(`[NCM::SECURITY] Verifying the package "${name}"`)

    // skip cached or scoped packages
    if (cachedPublicPackages.includes(name) || name.includes('/')) return

    const { body: { versions = {} } } = await clientRequest({
      method: 'GET',
      uri: `${privateRegistryUrl}${name}`,
      json: true,
      opted: true
    })
    let verLen = Object.keys(versions).length
    if (!verLen) return

    const { integrity: privateIntegrity } = versions[(Object.keys(versions)[verLen - 1])].dist
    if (!privateIntegrity) return

    const { body: { versions: pubVers = {} } } = await clientRequest({
      method: 'GET',
      uri: `${publicRegistryUrl}${name}`,
      json: true,
      opted: true
    })
    verLen = Object.keys(pubVers).length
    if (!verLen) return

    const { integrity: publicIntegrity } = pubVers[(Object.keys(pubVers)[verLen - 1])].dist

    if (!publicIntegrity) return
    if (privateIntegrity !== publicIntegrity) {
      E(chalk.red(`[NCM::SECURITY ISSUE DETECTED] "${name}" is vulnerable to npm substitution attacks. Use scopes for the internal packages to fix this`))
      process.exit(1)
    } else {
      cachedPublicPackages.push(name)
      setValue('cachedPublicPackages', [...new Set(cachedPublicPackages)])
    }
  } catch (err) {
    E(err)
  }
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

      let deps
      try {
        deps = require(path.join(process.cwd(), 'package.json'))
      } catch (_) {} // skipped by below if there's no package.json

      if (deps) {
        const pkgTree = [...new Set(Object.keys({
          ...(deps.dependencies || {}),
          ...(deps.devDependencies || {})
        }))]

        pkgTree.forEach(async name =>
          concurrentTaskQueue.push(verificationTask({ name, privateRegistryUrl }))
        )

        try {
          await Promise.all(concurrentTaskQueue)
        } catch (pErr) {
          E(pErr)
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

    concurrentTaskQueue.push(verificationTask({ name, privateRegistryUrl }))
    try {
      await Promise.all(concurrentTaskQueue)
    } catch (pErr) {
      E(pErr)
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
