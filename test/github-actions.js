'use strict'

// Import AVA's default export
const test = require('ava').default
const sinon = require('sinon')

const core = require('@actions/core')
const updateCheck = require('../lib/report/github-action')

test('Github Action Annotation', async (t) => {
  sinon.stub(core, 'getInput').returns('test-run')

  const octokit = {
    checks: {
      update: () => {
        console.log({ ok: 200 })
      }
    }
  }

  const listChecks = {
    data: {
      total_count: 1,
      check_runs: [
        {
          name: 'test-run'
        }
      ]
    }
  }

  const annotations = [
    {
      path: 'package.json',
      start_line: 10,
      end_line: 10,
      annotation_level: 'failure',
      message: 'DDOS vulnerability discovered by MrRobot666',
      title: '[supersecurepkg@0.0.1] Certification Warning'
    },
    {
      path: 'package.json',
      start_line: 12,
      end_line: 12,
      annotation_level: 'warning',
      message: 'This package version is Whitelisted.',
      title: '[mysuperpkg@6.6.6] Certification Warning'
    }
  ]

  const contextData = {
    owner: 'nodesource',
    repo: 'ncm-cli'
  }

  // AVA handles assertions differently than tap
  await t.notThrowsAsync(async () => {
    updateCheck(octokit, listChecks, annotations, contextData)
  })
})
