'use strict'

const fs = require('fs')
const { GitHub, context } = require('@actions/github')
const core = require('@actions/core')

async function GitHubActionCheck (pkgScores, whitelist, hasFailures) {
  const packageJSONAction = fs.readFileSync('package.json', 'utf8')

  // This token is not created by the user setting up
  // the workflow. This is extracted by GitHub Actions
  // by design from the context of the job during
  // execution.
  const gToken = core.getInput('GITHUB_TOKEN')
  const octokit = new GitHub(gToken)
  const contextData = {
    owner: context.repo.owner,
    repo: context.repo.repo
  }

  // Identify the check currently running
  // we don't want to create a new one, only
  // update the current with fail and warning
  // annotations.
  const gitOwner = context.repo.owner
  const gitRepo = context.repo.repo
  const gitRef = context.sha
  const listChecks = await octokit.checks.listForRef({
    owner: gitOwner,
    repo: gitRepo,
    ref: gitRef
  })

  if (hasFailures) {
    // Create fail annotations array
    const failAnnotations = []
    for (const pkg of pkgScores) {
      const pkgName = pkg.name
      const pkgVersion = pkg.version
      // Get the line in the package.json where this module
      // was introduced, if not, means it's a dependency of
      // a dependency. If not found, we set 1 as safe placeholder.
      const lineInPackageJSON = getLineNumber(packageJSONAction, `"${pkgName}":+`)
      const parsedLine = lineInPackageJSON.length !== 0
        ? lineInPackageJSON[0].number
        : 1

      // This is a filter to push only the ones we found in the
      // package.json and ignore the rest
      if (parsedLine !== 1) {
        let failureMessages = ''
        if (pkg.failures.length !== 0) {
          for (const failure of pkg.failures) {
            // This is a filter to push only the ones we found in the
            // package.json and ignore the rest
            failureMessages += `\nCode: ${failure.name}\n`
            failureMessages += `Message: ${failure.title}\n`
            failureMessages += `Severity: ${failure.severity}\n`
            failureMessages += `Group: ${failure.group}\n`
            failureMessages += !failure.data
              ? ''
              : !failure.data.spdx
                  ? ''
                  : `Locations: ${failure.data.locations}\n`
          }
          failAnnotations.push({
            path: 'package.json',
            start_line: parsedLine,
            end_line: parsedLine,
            annotation_level: 'failure',
            message: failureMessages,
            title: `[${pkgName}@${pkgVersion}] Certification Failure`
          })
        }
        // This is necessary to send the las entries that were not
        // sent because a new chunk of 49 objects in the failAnnotations
        // array was not completed.
        await updateCheck(octokit, listChecks, failAnnotations, contextData)
        // Clean to avoid duplicated entry push
        failAnnotations.length = 0
      }
    }
  }

  // Whilist warnings should appear, no matter if the
  // check failed. We still need to inform about them.
  const warningAnnotations = []
  for (const pkg of whitelist) {
    const lineInWhitelistPackage = getLineNumber(packageJSONAction, `"${pkg.name}":+`)
    const parsedWhitelistLine = lineInWhitelistPackage.length !== 0
      ? lineInWhitelistPackage[0].number
      : 1
    warningAnnotations.push({
      path: 'package.json',
      start_line: parsedWhitelistLine,
      end_line: parsedWhitelistLine,
      annotation_level: 'warning',
      message: 'This package version is Whitelisted.',
      title: `[${pkg.name}@${pkg.version}] Certification Warning`
    })
  }

  if (warningAnnotations !== 0) {
    await updateCheck(octokit, listChecks, warningAnnotations, contextData)
  }
}

module.exports = GitHubActionCheck

async function updateCheck (octokit, listChecks, annotations, contextData) {
  // The check is identified, let's update with an
  // array of annotations

  const runName = core.getInput('GITHUB_JOB_NAME')
  const logUpdateCheck = () =>
    console.log('Unable to be sure of the check run ID, are you sure you set a name for the Job in the workflow file and passed the same to the action?')

  if (!listChecks || !listChecks.data) return logUpdateCheck()

  for (const run of listChecks.data.check_runs) {
    if (run.name === runName) {
      await octokit.checks.update({
        owner: contextData.owner,
        repo: contextData.repo,
        check_run_id: run.id,
        output: {
          title: 'NodeSource Ceritification process',
          summary: '',
          text: '',
          annotations
        }
      })
    } else {
      logUpdateCheck()
    }
  }
}

module.exports = updateCheck

function getLineNumber (file, str) {
  const pattern = new RegExp(str)
  return file.split(/\r?\n/).map((line, n) => {
    if (pattern.test(line)) {
      return {
        line,
        number: n + 1
      }
    }
    return false
  }).filter(Boolean)
}
