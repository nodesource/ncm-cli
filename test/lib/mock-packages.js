module.exports =
[{
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
      'This package version license is unacceptable: \'Artistic-2.0\'',
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
},
{
  'name': 'chalk',
  'version': '2.4.2',
  'published': true,
  'publishedAt': '2019-01-05T15:45:52.349Z',
  description: 'Terminal string styling done right',
  author: 'sindresorhus',
  maintainers: [ 'qix', 'sindresorhus' ],
  keywords: [ 'color', 'colour', 'colors' ],
  'scores': [
    {
      'group': 'risk',
      'name': 'deprecated',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version is not deprecated.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'readme-exists',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a README file.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'readme-size',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a README file of 10.8 kB.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-expanded-size',
      'pass': false,
      'severity': 'LOW',
      'title': 'This package version\'s size on disk is 48.0 kB.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-file-count',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 7 file(s).',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-dir-count',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 2 dir(s).',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'missing-strict-mode',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version always uses strict mode.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-abandoned-promises',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version finalizes all detectable promises.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-lost-callback-errs',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version handles all callback errors.',
      'data': null
    },
    {
      'group': 'compliance',
      'name': 'license',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version license is acceptable: \'MIT\'',
      'data': {
        'spdx': 'MIT'
      }
    },
    {
      'group': 'risk',
      'name': 'has-install-scripts',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have install scripts.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-gyp-file',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have a Gyp build file.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'uses-deprecated-node-apis',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not use any deprecated Node APIs.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-unsafe-regexps',
      'pass': false,
      'severity': 'MEDIUM',
      'title': 'This package version has an unsafe regular expression at templates.js:2:24.',
      'data': {
        'locations': [
          'templates.js:2:24',
          'templates.js:3:21'
        ]
      }
    },
    {
      'group': 'risk',
      'name': 'uses-eval',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not use eval() or implied eval.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'has-scm-info',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a git repository at git+https://github.com/chalk/chalk.git .',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'scm-tagged-versions',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 96% tagged non-prelease versions in git.',
      'data': null
    }
  ]
},
{
  'name': 'ansi-styles',
  'version': '3.2.1',
  'published': true,
  'publishedAt': '2018-03-02T09:40:00.702Z',
  'scores': [
    {
      'group': 'quality',
      'name': 'disk-usage-expanded-size',
      'pass': false,
      'severity': 'LOW',
      'title': 'This package version\'s size on disk is 20.0 kB.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-file-count',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 4 file(s).',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-dir-count',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 1 dir(s).',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-unsafe-regexps',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have unsafe regular expressions.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'uses-eval',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not use eval() or implied eval.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'deprecated',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version is not deprecated.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'readme-exists',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a README file.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'readme-size',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a README file of 3.7 kB.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'uses-deprecated-node-apis',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not use any deprecated Node APIs.',
      'data': null
    },
    {
      'group': 'compliance',
      'name': 'license',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version license is acceptable: \'MIT\'',
      'data': {
        'spdx': 'MIT'
      }
    },
    {
      'group': 'risk',
      'name': 'has-install-scripts',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have install scripts.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-gyp-file',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have a Gyp build file.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'missing-strict-mode',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version always uses strict mode.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-abandoned-promises',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version finalizes all detectable promises.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-lost-callback-errs',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version handles all callback errors.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'has-scm-info',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a git repository at git://github.com/sindresorhus/ansi-styles.git .',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'scm-tagged-versions',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 100% tagged non-prelease versions in git.',
      'data': null
    }
  ]
},
{
  'name': 'color-convert',
  'version': '1.9.3',
  'published': true,
  'publishedAt': '2018-08-28T05:32:39.014Z',
  'scores': [
    {
      'group': 'quality',
      'name': 'readme-exists',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a README file.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'readme-size',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a README file of 2.9 kB.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'deprecated',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version is not deprecated.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-install-scripts',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have install scripts.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-gyp-file',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have a Gyp build file.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-unsafe-regexps',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have unsafe regular expressions.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'uses-deprecated-node-apis',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not use any deprecated Node APIs.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'uses-eval',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not use eval() or implied eval.',
      'data': null
    },
    {
      'group': 'compliance',
      'name': 'license',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version license is acceptable: \'MIT\'',
      'data': {
        'spdx': 'MIT'
      }
    },
    {
      'group': 'quality',
      'name': 'disk-usage-expanded-size',
      'pass': false,
      'severity': 'LOW',
      'title': 'This package version\'s size on disk is 48.0 kB.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-file-count',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 7 file(s).',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-dir-count',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 1 dir(s).',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'has-scm-info',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a git repository at git+https://github.com/Qix-/color-convert.git .',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'scm-tagged-versions',
      'pass': false,
      'severity': 'MEDIUM',
      'title': 'This package has 71% tagged non-prelease versions in git.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-lost-callback-errs',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version handles all callback errors.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-abandoned-promises',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version finalizes all detectable promises.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'missing-strict-mode',
      'pass': false,
      'severity': 'LOW',
      'title': 'This package version doesn\'t use strict mode in index.js:1:1.',
      'data': {
        'locations': [
          'index.js:1:1',
          'route.js:1:1',
          'conversions.js:2:1'
        ]
      }
    }
  ]
},
{
  'name': 'color-name',
  'version': '1.1.3',
  'published': true,
  'publishedAt': '2017-07-15T22:17:08.140Z',
  'scores': [
    {
      'group': 'risk',
      'name': 'has-install-scripts',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have install scripts.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-gyp-file',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have a Gyp build file.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-expanded-size',
      'pass': false,
      'severity': 'LOW',
      'title': 'This package version\'s size on disk is 36.0 kB.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-file-count',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 7 file(s).',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-dir-count',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 1 dir(s).',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'uses-deprecated-node-apis',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not use any deprecated Node APIs.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'has-scm-info',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a git repository at git+ssh://git@github.com/dfcreative/color-name.git .',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'scm-tagged-versions',
      'pass': false,
      'severity': 'MEDIUM',
      'title': 'This package has 0% tagged non-prelease versions in git.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'deprecated',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version is not deprecated.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-unsafe-regexps',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have unsafe regular expressions.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'readme-exists',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a README file.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'readme-size',
      'pass': false,
      'severity': 'MEDIUM',
      'title': 'This package version has a README file of 384 B.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'uses-eval',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not use eval() or implied eval.',
      'data': null
    },
    {
      'group': 'compliance',
      'name': 'license',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version license is acceptable: \'MIT\'',
      'data': {
        'spdx': 'MIT'
      }
    },
    {
      'group': 'risk',
      'name': 'has-abandoned-promises',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version finalizes all detectable promises.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-lost-callback-errs',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version handles all callback errors.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'missing-strict-mode',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version always uses strict mode.',
      'data': null
    }
  ]
},
{
  'name': 'escape-string-regexp',
  'version': '1.0.5',
  'published': true,
  'publishedAt': '2016-02-21T12:55:17.074Z',
  'scores': [
    {
      'group': 'risk',
      'name': 'deprecated',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version is not deprecated.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-expanded-size',
      'pass': false,
      'severity': 'LOW',
      'title': 'This package version\'s size on disk is 20.0 kB.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-file-count',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 4 file(s).',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-dir-count',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 1 dir(s).',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'uses-deprecated-node-apis',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not use any deprecated Node APIs.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'has-scm-info',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a git repository at git://github.com/sindresorhus/escape-string-regexp .',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'scm-tagged-versions',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 100% tagged non-prelease versions in git.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'readme-exists',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a README file.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'readme-size',
      'pass': false,
      'severity': 'LOW',
      'title': 'This package version has a README file of 552 B.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-unsafe-regexps',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have unsafe regular expressions.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'uses-eval',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not use eval() or implied eval.',
      'data': null
    },
    {
      'group': 'compliance',
      'name': 'license',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version license is acceptable: \'MIT\'',
      'data': {
        'spdx': 'MIT'
      }
    },
    {
      'group': 'risk',
      'name': 'has-install-scripts',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have install scripts.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-gyp-file',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have a Gyp build file.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'missing-strict-mode',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version always uses strict mode.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-lost-callback-errs',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version handles all callback errors.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-abandoned-promises',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version finalizes all detectable promises.',
      'data': null
    }
  ]
},
{
  'name': 'supports-color',
  'version': '5.5.0',
  'published': true,
  'publishedAt': '2018-08-20T04:37:37.309Z',
  'scores': [
    {
      'group': 'quality',
      'name': 'has-scm-info',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a git repository at git+https://github.com/chalk/supports-color.git .',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'scm-tagged-versions',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 97% tagged non-prelease versions in git.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'deprecated',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version is not deprecated.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-install-scripts',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have install scripts.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-gyp-file',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have a Gyp build file.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-unsafe-regexps',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have unsafe regular expressions.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'uses-eval',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not use eval() or implied eval.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-expanded-size',
      'pass': false,
      'severity': 'LOW',
      'title': 'This package version\'s size on disk is 24.0 kB.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-file-count',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 5 file(s).',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-dir-count',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 1 dir(s).',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'readme-exists',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a README file.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'readme-size',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a README file of 1.9 kB.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'uses-deprecated-node-apis',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not use any deprecated Node APIs.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-abandoned-promises',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version finalizes all detectable promises.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-lost-callback-errs',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version handles all callback errors.',
      'data': null
    },
    {
      'group': 'compliance',
      'name': 'license',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version license is acceptable: \'MIT\'',
      'data': {
        'spdx': 'MIT'
      }
    },
    {
      'group': 'risk',
      'name': 'missing-strict-mode',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version always uses strict mode.',
      'data': null
    }
  ]
},
{
  'name': 'has-flag',
  'version': '3.0.0',
  'published': true,
  'publishedAt': '2018-01-02T19:21:56.098Z',
  'scores': [
    {
      'group': 'quality',
      'name': 'has-scm-info',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a git repository at git+https://github.com/sindresorhus/has-flag.git .',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'scm-tagged-versions',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 100% tagged non-prelease versions in git.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-install-scripts',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have install scripts.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-gyp-file',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have a Gyp build file.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-expanded-size',
      'pass': false,
      'severity': 'LOW',
      'title': 'This package version\'s size on disk is 20.0 kB.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-file-count',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 4 file(s).',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-dir-count',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 1 dir(s).',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'deprecated',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version is not deprecated.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'uses-deprecated-node-apis',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not use any deprecated Node APIs.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'uses-eval',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not use eval() or implied eval.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'readme-exists',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a README file.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'readme-size',
      'pass': false,
      'severity': 'LOW',
      'title': 'This package version has a README file of 986 B.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-unsafe-regexps',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have unsafe regular expressions.',
      'data': null
    },
    {
      'group': 'compliance',
      'name': 'license',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version license is acceptable: \'MIT\'',
      'data': {
        'spdx': 'MIT'
      }
    },
    {
      'group': 'risk',
      'name': 'missing-strict-mode',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version always uses strict mode.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-abandoned-promises',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version finalizes all detectable promises.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-lost-callback-errs',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version handles all callback errors.',
      'data': null
    }
  ]
},
{
  'name': 'debug',
  'version': '2.2.0',
  'published': true,
  'publishedAt': '2015-05-10T07:21:25.639Z',
  'scores': [
    {
      'group': 'risk',
      'name': 'has-install-scripts',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have install scripts.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-gyp-file',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have a Gyp build file.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'deprecated',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version is not deprecated.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-expanded-size',
      'pass': false,
      'severity': 'MEDIUM',
      'title': 'This package version\'s size on disk is 60.0 kB.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-file-count',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 11 file(s).',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-dir-count',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 1 dir(s).',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-unsafe-regexps',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have unsafe regular expressions.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'uses-deprecated-node-apis',
      'pass': false,
      'severity': 'MEDIUM',
      'title': 'This package version uses a deprecated Node API at node.js:164:20 — \'fs.SyncWriteStream\' was deprecated since v4.0.0.',
      'data': {
        'locations': [
          'node.js:164:20'
        ]
      }
    },
    {
      'group': 'risk',
      'name': 'uses-eval',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not use eval() or implied eval.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'readme-exists',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a README file.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'readme-size',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a README file of 6.3 kB.',
      'data': null
    },
    {
      'group': 'compliance',
      'name': 'license',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version license is acceptable: \'MIT\'',
      'data': {
        'spdx': 'MIT'
      }
    },
    {
      'group': 'risk',
      'name': 'has-abandoned-promises',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version finalizes all detectable promises.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-lost-callback-errs',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version handles all callback errors.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'has-scm-info',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a git repository at git://github.com/visionmedia/debug.git .',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'scm-tagged-versions',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 97% tagged non-prelease versions in git.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'missing-strict-mode',
      'pass': false,
      'severity': 'LOW',
      'title': 'This package version doesn\'t use strict mode in node.js:6:1.',
      'data': {
        'locations': [
          'node.js:6:1',
          'debug.js:9:1'
        ]
      }
    },
    {
      'group': 'security',
      'name': 'vulnerability',
      'pass': false,
      'severity': 'LOW',
      'title': 'Regular Expression Denial of Service (ReDoS)',
      'data': {
        'id': 'npm:debug:20170905',
        'vulnerable': [
          '>=1.0.0 <2.6.9',
          '>=3.0.0 <3.1.0'
        ]
      }
    }
  ]
},
{
  'name': 'ms',
  'version': '0.7.1',
  'published': true,
  'publishedAt': '2015-04-20T23:38:57.957Z',
  'scores': [
    {
      'group': 'risk',
      'name': 'deprecated',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version is not deprecated.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'uses-eval',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not use eval() or implied eval.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-install-scripts',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have install scripts.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-gyp-file',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have a Gyp build file.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-expanded-size',
      'pass': false,
      'severity': 'LOW',
      'title': 'This package version\'s size on disk is 28.0 kB.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-file-count',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 6 file(s).',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-dir-count',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 1 dir(s).',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'readme-exists',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a README file.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'readme-size',
      'pass': false,
      'severity': 'LOW',
      'title': 'This package version has a README file of 933 B.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-unsafe-regexps',
      'pass': false,
      'severity': 'MEDIUM',
      'title': 'This package version has an unsafe regular expression at index.js:43:15.',
      'data': {
        'locations': [
          'index.js:43:15'
        ]
      }
    },
    {
      'group': 'compliance',
      'name': 'license',
      'pass': false,
      'severity': 'HIGH',
      'title': 'This package version has no license.',
      'data': {
        'spdx': null
      }
    },
    {
      'group': 'risk',
      'name': 'uses-deprecated-node-apis',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not use any deprecated Node APIs.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'has-scm-info',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a git repository at git://github.com/guille/ms.js.git .',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'scm-tagged-versions',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 88% tagged non-prelease versions in git.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-abandoned-promises',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version finalizes all detectable promises.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-lost-callback-errs',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version handles all callback errors.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'missing-strict-mode',
      'pass': false,
      'severity': 'LOW',
      'title': 'This package version doesn\'t use strict mode in index.js:5:1.',
      'data': {
        'locations': [
          'index.js:5:1'
        ]
      }
    },
    {
      'group': 'security',
      'name': 'vulnerability',
      'pass': false,
      'severity': 'LOW',
      'title': 'Regular Expression Denial of Service (ReDoS)',
      'data': {
        'id': 'npm:ms:20170412',
        'vulnerable': [
          '<2.0.0'
        ]
      }
    }
  ]
},
{
  'name': 'handlebars',
  'version': '4.0.5',
  'published': true,
  'publishedAt': '2015-11-20T05:07:09.574Z',
  'scores': [
    {
      'group': 'risk',
      'name': 'deprecated',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version is not deprecated.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-expanded-size',
      'pass': false,
      'severity': 'CRITICAL',
      'title': 'This package version\'s size on disk is 2.7 MB.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-file-count',
      'pass': false,
      'severity': 'MEDIUM',
      'title': 'This package has 113 file(s).',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-dir-count',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 19 dir(s).',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'readme-exists',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a README file.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'readme-size',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a README file of 8.5 kB.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-install-scripts',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have install scripts.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-gyp-file',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have a Gyp build file.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'uses-eval',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not use eval() or implied eval.',
      'data': null
    },
    {
      'group': 'compliance',
      'name': 'license',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version license is acceptable: \'MIT\'',
      'data': {
        'spdx': 'MIT'
      }
    },
    {
      'group': 'risk',
      'name': 'has-lost-callback-errs',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version handles all callback errors.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-abandoned-promises',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version finalizes all detectable promises.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-unsafe-regexps',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have unsafe regular expressions.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'missing-strict-mode',
      'pass': false,
      'severity': 'LOW',
      'title': 'This package version doesn\'t use strict mode in lib/index.js:7:1.',
      'data': {
        'locations': [
          'lib/index.js:7:1',
          'bin/handlebars:3:1'
        ]
      }
    },
    {
      'group': 'quality',
      'name': 'has-scm-info',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a git repository at git+https://github.com/wycats/handlebars.js.git .',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'scm-tagged-versions',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 100% tagged non-prelease versions in git.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'uses-deprecated-node-apis',
      'pass': false,
      'severity': 'MEDIUM',
      'title': 'This package version uses a deprecated Node API at lib/index.js:22:39 — \'require.extensions\' was deprecated since v0.12.0. Use compiling them ahead of time instead.',
      'data': {
        'locations': [
          'lib/index.js:22:39',
          'lib/index.js:23:3',
          'lib/index.js:24:3'
        ]
      }
    },
    {
      'group': 'security',
      'name': 'vulnerability',
      'pass': false,
      'severity': 'HIGH',
      'title': 'Prototype Pollution',
      'data': {
        'id': 'SNYK-JS-HANDLEBARS-173692',
        'vulnerable': [
          '<4.0.13'
        ]
      }
    }
  ]
},
{
  'name': 'async',
  'version': '1.5.2',
  'published': true,
  'publishedAt': '2016-01-08T00:03:32.998Z',
  'scores': [
    {
      'group': 'risk',
      'name': 'has-install-scripts',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have install scripts.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-gyp-file',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have a Gyp build file.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-expanded-size',
      'pass': false,
      'severity': 'HIGH',
      'title': 'This package version\'s size on disk is 184.0 kB.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-file-count',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 7 file(s).',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-dir-count',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 3 dir(s).',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'uses-eval',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not use eval() or implied eval.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'uses-deprecated-node-apis',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not use any deprecated Node APIs.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'readme-exists',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a README file.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'readme-size',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a README file of 60.8 kB.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'deprecated',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version is not deprecated.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-unsafe-regexps',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have unsafe regular expressions.',
      'data': null
    },
    {
      'group': 'compliance',
      'name': 'license',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version license is acceptable: \'MIT\'',
      'data': {
        'spdx': 'MIT'
      }
    },
    {
      'group': 'quality',
      'name': 'has-scm-info',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a git repository at git+https://github.com/caolan/async.git .',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'scm-tagged-versions',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 86% tagged non-prelease versions in git.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-abandoned-promises',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version finalizes all detectable promises.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-lost-callback-errs',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version handles all callback errors.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'missing-strict-mode',
      'pass': false,
      'severity': 'LOW',
      'title': 'This package version doesn\'t use strict mode in lib/async.js:8:1.',
      'data': {
        'locations': [
          'lib/async.js:8:1'
        ]
      }
    }
  ]
},
{
  'name': 'optimist',
  'version': '0.6.1',
  'published': true,
  'publishedAt': '2014-02-06T05:40:56.954Z',
  'scores': [
    {
      'group': 'risk',
      'name': 'deprecated',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version is not deprecated.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-unsafe-regexps',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have unsafe regular expressions.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'uses-eval',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not use eval() or implied eval.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'uses-deprecated-node-apis',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not use any deprecated Node APIs.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-install-scripts',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have install scripts.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-gyp-file',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have a Gyp build file.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-expanded-size',
      'pass': false,
      'severity': 'HIGH',
      'title': 'This package version\'s size on disk is 160.0 kB.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-file-count',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 29 file(s).',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-dir-count',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 4 dir(s).',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'readme-exists',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a README file.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'readme-size',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a README file of 10.7 kB.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'missing-strict-mode',
      'pass': false,
      'severity': 'LOW',
      'title': 'This package version doesn\'t use strict mode in index.js:1:1.',
      'data': {
        'locations': [
          'index.js:1:1'
        ]
      }
    },
    {
      'group': 'risk',
      'name': 'has-lost-callback-errs',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version handles all callback errors.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-abandoned-promises',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version finalizes all detectable promises.',
      'data': null
    },
    {
      'group': 'compliance',
      'name': 'license',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version license is acceptable: \'MIT/X11\'',
      'data': {
        'spdx': 'MIT'
      }
    },
    {
      'group': 'quality',
      'name': 'has-scm-info',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a git repository at git://github.com/substack/node-optimist.git .',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'scm-tagged-versions',
      'pass': false,
      'severity': 'MEDIUM',
      'title': 'This package has 33% tagged non-prelease versions in git.',
      'data': null
    }
  ]
},
{
  'name': 'minimist',
  'version': '0.0.10',
  'published': true,
  'publishedAt': '2014-05-11T21:43:10.663Z',
  'scores': [
    {
      'group': 'quality',
      'name': 'has-scm-info',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a git repository at git://github.com/substack/minimist.git .',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'scm-tagged-versions',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 95% tagged non-prelease versions in git.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-expanded-size',
      'pass': false,
      'severity': 'MEDIUM',
      'title': 'This package version\'s size on disk is 84.0 kB.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-file-count',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 16 file(s).',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-dir-count',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 3 dir(s).',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'uses-eval',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not use eval() or implied eval.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'readme-exists',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a README file.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'readme-size',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a README file of 1.6 kB.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-install-scripts',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have install scripts.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-gyp-file',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have a Gyp build file.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'deprecated',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version is not deprecated.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'uses-deprecated-node-apis',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not use any deprecated Node APIs.',
      'data': null
    },
    {
      'group': 'compliance',
      'name': 'license',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version license is acceptable: \'MIT\'',
      'data': {
        'spdx': 'MIT'
      }
    },
    {
      'group': 'risk',
      'name': 'has-unsafe-regexps',
      'pass': false,
      'severity': 'MEDIUM',
      'title': 'This package version has an unsafe regular expression at index.js:96:20.',
      'data': {
        'locations': [
          'index.js:96:20',
          'index.js:185:12'
        ]
      }
    },
    {
      'group': 'risk',
      'name': 'has-lost-callback-errs',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version handles all callback errors.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-abandoned-promises',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version finalizes all detectable promises.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'missing-strict-mode',
      'pass': false,
      'severity': 'LOW',
      'title': 'This package version doesn\'t use strict mode in index.js:1:1.',
      'data': {
        'locations': [
          'index.js:1:1'
        ]
      }
    }
  ]
},
{
  'name': 'wordwrap',
  'version': '0.0.3',
  'published': true,
  'publishedAt': '2015-05-07T17:04:58.219Z',
  'scores': [
    {
      'group': 'risk',
      'name': 'missing-strict-mode',
      'pass': false,
      'severity': 'LOW',
      'title': 'This package version doesn\'t use strict mode in index.js:1:1.',
      'data': {
        'locations': [
          'index.js:1:1'
        ]
      }
    },
    {
      'group': 'risk',
      'name': 'uses-eval',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not use eval() or implied eval.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'deprecated',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version is not deprecated.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'readme-exists',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a README file.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'readme-size',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a README file of 1.8 kB.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'uses-deprecated-node-apis',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not use any deprecated Node APIs.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'has-scm-info',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a git repository at git://github.com/substack/node-wordwrap.git .',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'scm-tagged-versions',
      'pass': false,
      'severity': 'MEDIUM',
      'title': 'This package has 25% tagged non-prelease versions in git.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-install-scripts',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have install scripts.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-gyp-file',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have a Gyp build file.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-unsafe-regexps',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have unsafe regular expressions.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-abandoned-promises',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version finalizes all detectable promises.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-expanded-size',
      'pass': false,
      'severity': 'MEDIUM',
      'title': 'This package version\'s size on disk is 72.0 kB.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-file-count',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 9 file(s).',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-dir-count',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 3 dir(s).',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-lost-callback-errs',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version handles all callback errors.',
      'data': null
    },
    {
      'group': 'compliance',
      'name': 'license',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version license is acceptable: \'MIT\'',
      'data': {
        'spdx': 'MIT'
      }
    }
  ]
},
{
  'name': 'source-map',
  'version': '0.4.4',
  'published': true,
  'publishedAt': '2015-07-13T19:07:44.340Z',
  'scores': [
    {
      'group': 'risk',
      'name': 'has-install-scripts',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have install scripts.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-gyp-file',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have a Gyp build file.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'deprecated',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version is not deprecated.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'uses-deprecated-node-apis',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not use any deprecated Node APIs.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'readme-exists',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a README file.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'readme-size',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a README file of 15.9 kB.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-unsafe-regexps',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have unsafe regular expressions.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-expanded-size',
      'pass': false,
      'severity': 'HIGH',
      'title': 'This package version\'s size on disk is 196.0 kB.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-file-count',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 22 file(s).',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-dir-count',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 4 dir(s).',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'uses-eval',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not use eval() or implied eval.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-lost-callback-errs',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version handles all callback errors.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-abandoned-promises',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version finalizes all detectable promises.',
      'data': null
    },
    {
      'group': 'compliance',
      'name': 'license',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version license is acceptable: \'BSD-3-Clause\'',
      'data': {
        'spdx': 'BSD-3-Clause'
      }
    },
    {
      'group': 'quality',
      'name': 'has-scm-info',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a git repository at http://github.com/mozilla/source-map.git .',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'scm-tagged-versions',
      'pass': false,
      'severity': 'MEDIUM',
      'title': 'This package has 71% tagged non-prelease versions in git.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'missing-strict-mode',
      'pass': false,
      'severity': 'LOW',
      'title': 'This package version doesn\'t use strict mode in lib/source-map.js:6:1.',
      'data': {
        'locations': [
          'lib/source-map.js:6:1'
        ]
      }
    }
  ]
},
{
  'name': 'amdefine',
  'version': '1.0.1',
  'published': true,
  'publishedAt': '2016-11-02T05:00:51.414Z',
  'scores': [
    {
      'group': 'risk',
      'name': 'deprecated',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version is not deprecated.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-expanded-size',
      'pass': false,
      'severity': 'LOW',
      'title': 'This package version\'s size on disk is 36.0 kB.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-file-count',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 5 file(s).',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-dir-count',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 1 dir(s).',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'readme-exists',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a README file.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'readme-size',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a README file of 6.1 kB.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'uses-deprecated-node-apis',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not use any deprecated Node APIs.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-install-scripts',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have install scripts.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-gyp-file',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have a Gyp build file.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-unsafe-regexps',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have unsafe regular expressions.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'uses-eval',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not use eval() or implied eval.',
      'data': null
    },
    {
      'group': 'compliance',
      'name': 'license',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version license is acceptable: \'BSD-3-Clause OR MIT\'',
      'data': {
        'spdx': 'BSD-3-Clause OR MIT'
      }
    },
    {
      'group': 'risk',
      'name': 'missing-strict-mode',
      'pass': false,
      'severity': 'LOW',
      'title': 'This package version doesn\'t use strict mode in amdefine.js:22:5.',
      'data': {
        'locations': [
          'amdefine.js:22:5'
        ]
      }
    },
    {
      'group': 'risk',
      'name': 'has-lost-callback-errs',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version handles all callback errors.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-abandoned-promises',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version finalizes all detectable promises.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'has-scm-info',
      'pass': false,
      'severity': 'HIGH',
      'title': 'This package version does not have a scm repository specified.',
      'data': null
    }
  ]
},
{
  'name': 'uglify-js',
  'version': '2.8.29',
  'published': true,
  'publishedAt': '2017-06-14T03:43:13.026Z',
  'scores': [
    {
      'group': 'risk',
      'name': 'has-install-scripts',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have install scripts.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-gyp-file',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have a Gyp build file.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'readme-exists',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a README file.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'readme-size',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a README file of 41.9 kB.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-expanded-size',
      'pass': false,
      'severity': 'HIGH',
      'title': 'This package version\'s size on disk is 660.0 kB.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-file-count',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 19 file(s).',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-dir-count',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 4 dir(s).',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'deprecated',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version is not deprecated.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-abandoned-promises',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version finalizes all detectable promises.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-lost-callback-errs',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version handles all callback errors.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'uses-eval',
      'pass': false,
      'severity': 'HIGH',
      'title': 'This package version does eval at tools/node.js:27:1.',
      'data': {
        'locations': [
          'tools/node.js:27:1'
        ]
      }
    },
    {
      'group': 'quality',
      'name': 'has-scm-info',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a git repository at https://github.com/mishoo/UglifyJS2.git .',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'scm-tagged-versions',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 85% tagged non-prelease versions in git.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'uses-deprecated-node-apis',
      'pass': false,
      'severity': 'MEDIUM',
      'title': 'This package version uses a deprecated Node API at tools/node.js:44:23 — \'new Buffer()\' was deprecated since v6.0.0. Use \'Buffer.alloc()\' or \'Buffer.from()\' instead.',
      'data': {
        'locations': [
          'tools/node.js:44:23',
          'tools/node.js:171:86'
        ]
      }
    },
    {
      'group': 'compliance',
      'name': 'license',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version license is acceptable: \'BSD-2-Clause\'',
      'data': {
        'spdx': 'BSD-2-Clause'
      }
    },
    {
      'group': 'risk',
      'name': 'missing-strict-mode',
      'pass': false,
      'severity': 'LOW',
      'title': 'This package version doesn\'t use strict mode in tools/node.js:2:1.',
      'data': {
        'locations': [
          'tools/node.js:2:1'
        ]
      }
    },
    {
      'group': 'risk',
      'name': 'has-unsafe-regexps',
      'pass': false,
      'severity': 'MEDIUM',
      'title': 'This package version has an unsafe regular expression at tools/node.js:39:17.',
      'data': {
        'locations': [
          'tools/node.js:39:17'
        ]
      }
    }
  ]
},
{
  'name': 'source-map',
  'version': '0.5.7',
  'published': true,
  'publishedAt': '2017-08-21T16:30:15.907Z',
  'scores': [
    {
      'group': 'quality',
      'name': 'disk-usage-expanded-size',
      'pass': false,
      'severity': 'HIGH',
      'title': 'This package version\'s size on disk is 800.0 kB.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-file-count',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 19 file(s).',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-dir-count',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 3 dir(s).',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'deprecated',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version is not deprecated.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'readme-exists',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a README file.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'readme-size',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a README file of 23.5 kB.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-install-scripts',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have install scripts.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-gyp-file',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have a Gyp build file.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-unsafe-regexps',
      'pass': false,
      'severity': 'MEDIUM',
      'title': 'This package version has an unsafe regular expression at lib/util.js:29:17.',
      'data': {
        'locations': [
          'lib/util.js:29:17',
          'lib/util.js:216:21'
        ]
      }
    },
    {
      'group': 'risk',
      'name': 'uses-deprecated-node-apis',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not use any deprecated Node APIs.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'uses-eval',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not use eval() or implied eval.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-abandoned-promises',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version finalizes all detectable promises.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-lost-callback-errs',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version handles all callback errors.',
      'data': null
    },
    {
      'group': 'compliance',
      'name': 'license',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version license is acceptable: \'BSD-3-Clause\'',
      'data': {
        'spdx': 'BSD-3-Clause'
      }
    },
    {
      'group': 'quality',
      'name': 'has-scm-info',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a git repository at http://github.com/mozilla/source-map.git .',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'scm-tagged-versions',
      'pass': false,
      'severity': 'MEDIUM',
      'title': 'This package has 71% tagged non-prelease versions in git.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'missing-strict-mode',
      'pass': false,
      'severity': 'LOW',
      'title': 'This package version doesn\'t use strict mode in source-map.js:6:1.',
      'data': {
        'locations': [
          'source-map.js:6:1',
          'lib/base64-vlq.js:38:1',
          'lib/util.js:18:1',
          'lib/mapping-list.js:8:1',
          'lib/binary-search.js:8:1'
        ]
      }
    }
  ]
},
{
  'name': 'uglify-to-browserify',
  'version': '1.0.2',
  'published': true,
  'publishedAt': '2014-02-05T12:40:02.383Z',
  'scores': [
    {
      'group': 'risk',
      'name': 'missing-strict-mode',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version always uses strict mode.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-unsafe-regexps',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have unsafe regular expressions.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'uses-eval',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not use eval() or implied eval.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'deprecated',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version is not deprecated.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'has-scm-info',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a git repository at https://github.com/ForbesLindesay/uglify-to-browserify.git .',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'scm-tagged-versions',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 100% tagged non-prelease versions in git.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'readme-exists',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a README file.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'readme-size',
      'pass': false,
      'severity': 'LOW',
      'title': 'This package version has a README file of 574 B.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'uses-deprecated-node-apis',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not use any deprecated Node APIs.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-expanded-size',
      'pass': false,
      'severity': 'LOW',
      'title': 'This package version\'s size on disk is 36.0 kB.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-file-count',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 7 file(s).',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-dir-count',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 2 dir(s).',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-install-scripts',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have install scripts.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-gyp-file',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have a Gyp build file.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-abandoned-promises',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version finalizes all detectable promises.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-lost-callback-errs',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version handles all callback errors.',
      'data': null
    },
    {
      'group': 'compliance',
      'name': 'license',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version license is acceptable: \'MIT\'',
      'data': {
        'spdx': 'MIT'
      }
    }
  ]
},
{
  'name': 'yargs',
  'version': '3.10.0',
  'published': true,
  'publishedAt': '2015-05-29T04:32:16.617Z',
  'scores': [
    {
      'group': 'quality',
      'name': 'disk-usage-expanded-size',
      'pass': false,
      'severity': 'HIGH',
      'title': 'This package version\'s size on disk is 132.0 kB.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-file-count',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 10 file(s).',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-dir-count',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 2 dir(s).',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-unsafe-regexps',
      'pass': false,
      'severity': 'MEDIUM',
      'title': 'This package version has an unsafe regular expression at lib/parser.js:174:12.',
      'data': {
        'locations': [
          'lib/parser.js:174:12',
          'lib/parser.js:440:12'
        ]
      }
    },
    {
      'group': 'risk',
      'name': 'uses-eval',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not use eval() or implied eval.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'readme-exists',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a README file.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'readme-size',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a README file of 22.3 kB.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'deprecated',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version is not deprecated.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-install-scripts',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have install scripts.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-gyp-file',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have a Gyp build file.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'uses-deprecated-node-apis',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not use any deprecated Node APIs.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-abandoned-promises',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version finalizes all detectable promises.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-lost-callback-errs',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version handles all callback errors.',
      'data': null
    },
    {
      'group': 'compliance',
      'name': 'license',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version license is acceptable: \'MIT\'',
      'data': {
        'spdx': 'MIT'
      }
    },
    {
      'group': 'quality',
      'name': 'has-scm-info',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a git repository at git+https://github.com/yargs/yargs.git .',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'scm-tagged-versions',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 87% tagged non-prelease versions in git.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'missing-strict-mode',
      'pass': false,
      'severity': 'LOW',
      'title': 'This package version doesn\'t use strict mode in index.js:1:1.',
      'data': {
        'locations': [
          'index.js:1:1',
          'lib/parser.js:3:1',
          'lib/validation.js:3:1',
          'lib/completion.js:1:1',
          'lib/usage.js:3:1'
        ]
      }
    }
  ]
},
{
  'name': 'camelcase',
  'version': '1.2.1',
  'published': true,
  'publishedAt': '2015-08-01T10:38:13.833Z',
  'scores': [
    {
      'group': 'risk',
      'name': 'deprecated',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version is not deprecated.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'readme-exists',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a README file.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'readme-size',
      'pass': false,
      'severity': 'LOW',
      'title': 'This package version has a README file of 889 B.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-install-scripts',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have install scripts.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-gyp-file',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have a Gyp build file.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'uses-deprecated-node-apis',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not use any deprecated Node APIs.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'uses-eval',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not use eval() or implied eval.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-expanded-size',
      'pass': false,
      'severity': 'LOW',
      'title': 'This package version\'s size on disk is 20.0 kB.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-file-count',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 4 file(s).',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-dir-count',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 1 dir(s).',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-unsafe-regexps',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have unsafe regular expressions.',
      'data': null
    },
    {
      'group': 'compliance',
      'name': 'license',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version license is acceptable: \'MIT\'',
      'data': {
        'spdx': 'MIT'
      }
    },
    {
      'group': 'risk',
      'name': 'has-lost-callback-errs',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version handles all callback errors.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-abandoned-promises',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version finalizes all detectable promises.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'missing-strict-mode',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version always uses strict mode.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'has-scm-info',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a git repository at git+https://github.com/sindresorhus/camelcase.git .',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'scm-tagged-versions',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 94% tagged non-prelease versions in git.',
      'data': null
    }
  ]
},
{
  'name': 'cliui',
  'version': '2.1.0',
  'published': true,
  'publishedAt': '2015-04-24T22:35:03.777Z',
  'scores': [
    {
      'group': 'compliance',
      'name': 'license',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version license is acceptable: \'ISC\'',
      'data': {
        'spdx': 'ISC'
      }
    },
    {
      'group': 'risk',
      'name': 'has-install-scripts',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have install scripts.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-gyp-file',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have a Gyp build file.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-expanded-size',
      'pass': false,
      'severity': 'MEDIUM',
      'title': 'This package version\'s size on disk is 52.0 kB.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-file-count',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 8 file(s).',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-dir-count',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 2 dir(s).',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-unsafe-regexps',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have unsafe regular expressions.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'deprecated',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version is not deprecated.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'uses-deprecated-node-apis',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not use any deprecated Node APIs.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'uses-eval',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not use eval() or implied eval.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'has-scm-info',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a git repository at git+ssh://git@github.com/bcoe/cliui.git .',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'scm-tagged-versions',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 94% tagged non-prelease versions in git.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'readme-exists',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a README file.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'readme-size',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a README file of 2.0 kB.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-abandoned-promises',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version finalizes all detectable promises.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-lost-callback-errs',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version handles all callback errors.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'missing-strict-mode',
      'pass': false,
      'severity': 'LOW',
      'title': 'This package version doesn\'t use strict mode in index.js:1:1.',
      'data': {
        'locations': [
          'index.js:1:1'
        ]
      }
    }
  ]
},
{
  'name': 'center-align',
  'version': '0.1.3',
  'published': true,
  'publishedAt': '2016-02-01T22:42:21.133Z',
  'scores': [
    {
      'group': 'quality',
      'name': 'disk-usage-expanded-size',
      'pass': false,
      'severity': 'LOW',
      'title': 'This package version\'s size on disk is 24.0 kB.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-file-count',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 5 file(s).',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-dir-count',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 1 dir(s).',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'readme-exists',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a README file.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'readme-size',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a README file of 1.9 kB.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-install-scripts',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have install scripts.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-gyp-file',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have a Gyp build file.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'uses-eval',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not use eval() or implied eval.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'uses-deprecated-node-apis',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not use any deprecated Node APIs.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'deprecated',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version is not deprecated.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-unsafe-regexps',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have unsafe regular expressions.',
      'data': null
    },
    {
      'group': 'compliance',
      'name': 'license',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version license is acceptable: \'MIT\'',
      'data': {
        'spdx': 'MIT'
      }
    },
    {
      'group': 'risk',
      'name': 'missing-strict-mode',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version always uses strict mode.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-abandoned-promises',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version finalizes all detectable promises.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-lost-callback-errs',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version handles all callback errors.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'has-scm-info',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a git repository at git://github.com/jonschlinkert/center-align.git .',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'scm-tagged-versions',
      'pass': false,
      'severity': 'MEDIUM',
      'title': 'This package has 50% tagged non-prelease versions in git.',
      'data': null
    }
  ]
},
{
  'name': 'align-text',
  'version': '0.1.4',
  'published': true,
  'publishedAt': '2016-02-02T01:50:57.618Z',
  'scores': [
    {
      'group': 'quality',
      'name': 'has-scm-info',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a git repository at git://github.com/jonschlinkert/align-text.git .',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'scm-tagged-versions',
      'pass': false,
      'severity': 'MEDIUM',
      'title': 'This package has 50% tagged non-prelease versions in git.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-expanded-size',
      'pass': false,
      'severity': 'LOW',
      'title': 'This package version\'s size on disk is 24.0 kB.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-file-count',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 4 file(s).',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-dir-count',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 1 dir(s).',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'deprecated',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version is not deprecated.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'readme-exists',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a README file.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'readme-size',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a README file of 5.5 kB.',
      'data': null
    },
    {
      'group': 'compliance',
      'name': 'license',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version license is acceptable: \'MIT\'',
      'data': {
        'spdx': 'MIT'
      }
    },
    {
      'group': 'risk',
      'name': 'has-install-scripts',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have install scripts.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-gyp-file',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have a Gyp build file.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'missing-strict-mode',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version always uses strict mode.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-abandoned-promises',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version finalizes all detectable promises.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-lost-callback-errs',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version handles all callback errors.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-unsafe-regexps',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have unsafe regular expressions.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'uses-eval',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not use eval() or implied eval.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'uses-deprecated-node-apis',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not use any deprecated Node APIs.',
      'data': null
    }
  ]
},
{
  'name': 'kind-of',
  'version': '3.2.2',
  'published': true,
  'publishedAt': '2017-05-16T18:21:41.452Z',
  'scores': [
    {
      'group': 'quality',
      'name': 'has-scm-info',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a git repository at git://github.com/jonschlinkert/kind-of.git .',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'scm-tagged-versions',
      'pass': false,
      'severity': 'MEDIUM',
      'title': 'This package has 80% tagged non-prelease versions in git.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'readme-exists',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a README file.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'readme-size',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a README file of 8.1 kB.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-expanded-size',
      'pass': false,
      'severity': 'LOW',
      'title': 'This package version\'s size on disk is 24.0 kB.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-file-count',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 4 file(s).',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-dir-count',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 1 dir(s).',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'deprecated',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version is not deprecated.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-install-scripts',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have install scripts.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-gyp-file',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have a Gyp build file.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'uses-eval',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not use eval() or implied eval.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-unsafe-regexps',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have unsafe regular expressions.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'uses-deprecated-node-apis',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not use any deprecated Node APIs.',
      'data': null
    },
    {
      'group': 'compliance',
      'name': 'license',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version license is acceptable: \'MIT\'',
      'data': {
        'spdx': 'MIT'
      }
    },
    {
      'group': 'risk',
      'name': 'has-lost-callback-errs',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version handles all callback errors.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-abandoned-promises',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version finalizes all detectable promises.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'missing-strict-mode',
      'pass': false,
      'severity': 'LOW',
      'title': 'This package version doesn\'t use strict mode in index.js:1:1.',
      'data': {
        'locations': [
          'index.js:1:1'
        ]
      }
    }
  ]
},
{
  'name': 'is-buffer',
  'version': '1.1.6',
  'published': true,
  'publishedAt': '2017-10-25T21:36:28.871Z',
  'scores': [
    {
      'group': 'quality',
      'name': 'disk-usage-expanded-size',
      'pass': false,
      'severity': 'LOW',
      'title': 'This package version\'s size on disk is 28.0 kB.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-file-count',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 5 file(s).',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-dir-count',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 2 dir(s).',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'deprecated',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version is not deprecated.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-install-scripts',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have install scripts.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-gyp-file',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have a Gyp build file.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'readme-exists',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a README file.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'readme-size',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a README file of 1.7 kB.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'uses-deprecated-node-apis',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not use any deprecated Node APIs.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-unsafe-regexps',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have unsafe regular expressions.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'uses-eval',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not use eval() or implied eval.',
      'data': null
    },
    {
      'group': 'compliance',
      'name': 'license',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version license is acceptable: \'MIT\'',
      'data': {
        'spdx': 'MIT'
      }
    },
    {
      'group': 'risk',
      'name': 'has-abandoned-promises',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version finalizes all detectable promises.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-lost-callback-errs',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version handles all callback errors.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'has-scm-info',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a git repository at git://github.com/feross/is-buffer.git .',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'scm-tagged-versions',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 100% tagged non-prelease versions in git.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'missing-strict-mode',
      'pass': false,
      'severity': 'LOW',
      'title': 'This package version doesn\'t use strict mode in index.js:10:1.',
      'data': {
        'locations': [
          'index.js:10:1'
        ]
      }
    }
  ]
},
{
  'name': 'longest',
  'version': '1.0.1',
  'published': true,
  'publishedAt': '2015-03-31T11:38:21.482Z',
  'scores': [
    {
      'group': 'risk',
      'name': 'missing-strict-mode',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version always uses strict mode.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'readme-exists',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a README file.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'readme-size',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a README file of 2.2 kB.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'has-scm-info',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a git repository at https://github.com/jonschlinkert/longest.git .',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'scm-tagged-versions',
      'pass': false,
      'severity': 'MEDIUM',
      'title': 'This package has 80% tagged non-prelease versions in git.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'uses-deprecated-node-apis',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not use any deprecated Node APIs.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'deprecated',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version is not deprecated.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'uses-eval',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not use eval() or implied eval.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-unsafe-regexps',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have unsafe regular expressions.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-install-scripts',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have install scripts.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-gyp-file',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have a Gyp build file.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-expanded-size',
      'pass': false,
      'severity': 'LOW',
      'title': 'This package version\'s size on disk is 20.0 kB.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-file-count',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 4 file(s).',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-dir-count',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 1 dir(s).',
      'data': null
    },
    {
      'group': 'compliance',
      'name': 'license',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version license is acceptable: {\'url\':\'https://github.com/jonschlinkert/longest/blob/master/LICENSE\',\'type\':\'MIT\'}',
      'data': {
        'spdx': 'MIT'
      }
    },
    {
      'group': 'risk',
      'name': 'has-lost-callback-errs',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version handles all callback errors.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-abandoned-promises',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version finalizes all detectable promises.',
      'data': null
    }
  ]
},
{
  'name': 'repeat-string',
  'version': '1.6.1',
  'published': true,
  'publishedAt': '2016-10-23T16:54:00.613Z',
  'scores': [
    {
      'group': 'risk',
      'name': 'missing-strict-mode',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version always uses strict mode.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-install-scripts',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have install scripts.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-gyp-file',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have a Gyp build file.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-expanded-size',
      'pass': false,
      'severity': 'LOW',
      'title': 'This package version\'s size on disk is 24.0 kB.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-file-count',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 4 file(s).',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-dir-count',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 1 dir(s).',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'readme-exists',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a README file.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'readme-size',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a README file of 5.1 kB.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'uses-eval',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not use eval() or implied eval.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-unsafe-regexps',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have unsafe regular expressions.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'uses-deprecated-node-apis',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not use any deprecated Node APIs.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-lost-callback-errs',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version handles all callback errors.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-abandoned-promises',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version finalizes all detectable promises.',
      'data': null
    },
    {
      'group': 'compliance',
      'name': 'license',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version license is acceptable: \'MIT\'',
      'data': {
        'spdx': 'MIT'
      }
    },
    {
      'group': 'risk',
      'name': 'deprecated',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version is not deprecated.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'has-scm-info',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a git repository at git://github.com/jonschlinkert/repeat-string.git .',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'scm-tagged-versions',
      'pass': false,
      'severity': 'MEDIUM',
      'title': 'This package has 24% tagged non-prelease versions in git.',
      'data': null
    }
  ]
},
{
  'name': 'lazy-cache',
  'version': '1.0.4',
  'published': true,
  'publishedAt': '2016-04-23T02:34:21.150Z',
  'scores': [
    {
      'group': 'quality',
      'name': 'readme-exists',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a README file.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'readme-size',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a README file of 3.7 kB.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'uses-eval',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not use eval() or implied eval.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-expanded-size',
      'pass': false,
      'severity': 'LOW',
      'title': 'This package version\'s size on disk is 20.0 kB.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-file-count',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 4 file(s).',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-dir-count',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 1 dir(s).',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-install-scripts',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have install scripts.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-gyp-file',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have a Gyp build file.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'deprecated',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version is not deprecated.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-unsafe-regexps',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have unsafe regular expressions.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'uses-deprecated-node-apis',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not use any deprecated Node APIs.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'missing-strict-mode',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version always uses strict mode.',
      'data': null
    },
    {
      'group': 'compliance',
      'name': 'license',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version license is acceptable: \'MIT\'',
      'data': {
        'spdx': 'MIT'
      }
    },
    {
      'group': 'risk',
      'name': 'has-abandoned-promises',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version finalizes all detectable promises.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-lost-callback-errs',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version handles all callback errors.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'has-scm-info',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a git repository at git+https://github.com/jonschlinkert/lazy-cache.git .',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'scm-tagged-versions',
      'pass': false,
      'severity': 'MEDIUM',
      'title': 'This package has 65% tagged non-prelease versions in git.',
      'data': null
    }
  ]
},
{
  'name': 'right-align',
  'version': '0.1.3',
  'published': true,
  'publishedAt': '2015-06-09T05:58:16.317Z',
  'scores': [
    {
      'group': 'risk',
      'name': 'missing-strict-mode',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version always uses strict mode.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-unsafe-regexps',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have unsafe regular expressions.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'deprecated',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version is not deprecated.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'readme-exists',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a README file.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'readme-size',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a README file of 2.1 kB.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'uses-deprecated-node-apis',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not use any deprecated Node APIs.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-install-scripts',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have install scripts.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-gyp-file',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have a Gyp build file.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'has-scm-info',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a git repository at git://github.com/jonschlinkert/right-align.git .',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'scm-tagged-versions',
      'pass': false,
      'severity': 'MEDIUM',
      'title': 'This package has 25% tagged non-prelease versions in git.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-expanded-size',
      'pass': false,
      'severity': 'LOW',
      'title': 'This package version\'s size on disk is 20.0 kB.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-file-count',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 4 file(s).',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-dir-count',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 1 dir(s).',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'uses-eval',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not use eval() or implied eval.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-abandoned-promises',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version finalizes all detectable promises.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-lost-callback-errs',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version handles all callback errors.',
      'data': null
    },
    {
      'group': 'compliance',
      'name': 'license',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version license is acceptable: \'MIT\'',
      'data': {
        'spdx': 'MIT'
      }
    }
  ]
},
{
  'name': 'wordwrap',
  'version': '0.0.2',
  'published': true,
  'publishedAt': '2011-08-26T10:17:09.949Z',
  'scores': [
    {
      'group': 'risk',
      'name': 'missing-strict-mode',
      'pass': false,
      'severity': 'LOW',
      'title': 'This package version doesn\'t use strict mode in index.js:1:1.',
      'data': {
        'locations': [
          'index.js:1:1'
        ]
      }
    },
    {
      'group': 'risk',
      'name': 'uses-eval',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not use eval() or implied eval.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'readme-exists',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a README file.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'readme-size',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a README file of 1.8 kB.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-expanded-size',
      'pass': false,
      'severity': 'MEDIUM',
      'title': 'This package version\'s size on disk is 72.0 kB.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-file-count',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 9 file(s).',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-dir-count',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 3 dir(s).',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-install-scripts',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have install scripts.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-gyp-file',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have a Gyp build file.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-unsafe-regexps',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have unsafe regular expressions.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'deprecated',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version is not deprecated.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'uses-deprecated-node-apis',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not use any deprecated Node APIs.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'has-scm-info',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a git repository at git://github.com/substack/node-wordwrap.git .',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'scm-tagged-versions',
      'pass': false,
      'severity': 'MEDIUM',
      'title': 'This package has 25% tagged non-prelease versions in git.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-abandoned-promises',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version finalizes all detectable promises.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-lost-callback-errs',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version handles all callback errors.',
      'data': null
    },
    {
      'group': 'compliance',
      'name': 'license',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version license is acceptable: \'MIT/X11\'',
      'data': {
        'spdx': 'MIT'
      }
    }
  ]
},
{
  'name': 'decamelize',
  'version': '1.2.0',
  'published': true,
  'publishedAt': '2016-03-05T08:49:10.462Z',
  'scores': [
    {
      'group': 'risk',
      'name': 'has-install-scripts',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have install scripts.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-gyp-file',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have a Gyp build file.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-expanded-size',
      'pass': false,
      'severity': 'LOW',
      'title': 'This package version\'s size on disk is 20.0 kB.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-file-count',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 4 file(s).',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-dir-count',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 1 dir(s).',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'readme-exists',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a README file.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'readme-size',
      'pass': false,
      'severity': 'LOW',
      'title': 'This package version has a README file of 781 B.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'uses-deprecated-node-apis',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not use any deprecated Node APIs.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'uses-eval',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not use eval() or implied eval.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'deprecated',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version is not deprecated.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-unsafe-regexps',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have unsafe regular expressions.',
      'data': null
    },
    {
      'group': 'compliance',
      'name': 'license',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version license is acceptable: \'MIT\'',
      'data': {
        'spdx': 'MIT'
      }
    },
    {
      'group': 'quality',
      'name': 'has-scm-info',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a git repository at https://github.com/sindresorhus/decamelize .',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'scm-tagged-versions',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 100% tagged non-prelease versions in git.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'missing-strict-mode',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version always uses strict mode.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-abandoned-promises',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version finalizes all detectable promises.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-lost-callback-errs',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version handles all callback errors.',
      'data': null
    }
  ]
},
{
  'name': 'window-size',
  'version': '0.1.0',
  'published': true,
  'publishedAt': '2014-02-15T03:41:48.322Z',
  'scores': [
    {
      'group': 'quality',
      'name': 'readme-exists',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a README file.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'readme-size',
      'pass': false,
      'severity': 'LOW',
      'title': 'This package version has a README file of 624 B.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'deprecated',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version is not deprecated.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'has-scm-info',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a git repository at git+https://github.com/jonschlinkert/window-size.git .',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'scm-tagged-versions',
      'pass': false,
      'severity': 'MEDIUM',
      'title': 'This package has 70% tagged non-prelease versions in git.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-install-scripts',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have install scripts.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-gyp-file',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have a Gyp build file.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'uses-deprecated-node-apis',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not use any deprecated Node APIs.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'uses-eval',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not use eval() or implied eval.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-expanded-size',
      'pass': false,
      'severity': 'LOW',
      'title': 'This package version\'s size on disk is 20.0 kB.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-file-count',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 4 file(s).',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-dir-count',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 1 dir(s).',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-unsafe-regexps',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have unsafe regular expressions.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-lost-callback-errs',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version handles all callback errors.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-abandoned-promises',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version finalizes all detectable promises.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'missing-strict-mode',
      'pass': false,
      'severity': 'LOW',
      'title': 'This package version doesn\'t use strict mode in index.js:9:1.',
      'data': {
        'locations': [
          'index.js:9:1'
        ]
      }
    },
    {
      'group': 'compliance',
      'name': 'license',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version license is acceptable: {\'url\':\'https://github.com/jonschlinkert/window-size/blob/master/LICENSE-MIT\',\'type\':\'MIT\'}',
      'data': {
        'spdx': 'MIT'
      }
    }
  ]
},
{
  'name': 'brace-expansion',
  'version': '1.1.2',
  'published': true,
  'publishedAt': '2015-11-28T12:58:57.647Z',
  'scores': [
    {
      'group': 'risk',
      'name': 'has-install-scripts',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have install scripts.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-gyp-file',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have a Gyp build file.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'readme-exists',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a README file.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'readme-size',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a README file of 3.5 kB.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'uses-eval',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not use eval() or implied eval.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'deprecated',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version is not deprecated.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-expanded-size',
      'pass': false,
      'severity': 'LOW',
      'title': 'This package version\'s size on disk is 28.0 kB.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-file-count',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 5 file(s).',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-dir-count',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 1 dir(s).',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'uses-deprecated-node-apis',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not use any deprecated Node APIs.',
      'data': null
    },
    {
      'group': 'compliance',
      'name': 'license',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version license is acceptable: \'MIT\'',
      'data': {
        'spdx': 'MIT'
      }
    },
    {
      'group': 'risk',
      'name': 'missing-strict-mode',
      'pass': false,
      'severity': 'LOW',
      'title': 'This package version doesn\'t use strict mode in index.js:1:1.',
      'data': {
        'locations': [
          'index.js:1:1'
        ]
      }
    },
    {
      'group': 'risk',
      'name': 'has-unsafe-regexps',
      'pass': false,
      'severity': 'MEDIUM',
      'title': 'This package version has an unsafe regular expression at index.js:96:27.',
      'data': {
        'locations': [
          'index.js:96:27',
          'index.js:97:25',
          'index.js:99:19'
        ]
      }
    },
    {
      'group': 'risk',
      'name': 'has-lost-callback-errs',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version handles all callback errors.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-abandoned-promises',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version finalizes all detectable promises.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'has-scm-info',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a git repository at git://github.com/juliangruber/brace-expansion.git .',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'scm-tagged-versions',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 93% tagged non-prelease versions in git.',
      'data': null
    },
    {
      'group': 'security',
      'name': 'vulnerability',
      'pass': false,
      'severity': 'MEDIUM',
      'title': 'Regular Expression Denial of Service (ReDoS)',
      'data': {
        'id': 'npm:brace-expansion:20170302',
        'vulnerable': [
          '<1.1.7'
        ]
      }
    }
  ]
},
{
  'name': 'balanced-match',
  'version': '0.3.0',
  'published': true,
  'publishedAt': '2015-11-28T12:37:27.893Z',
  'scores': [
    {
      'group': 'quality',
      'name': 'readme-exists',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a README file.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'readme-size',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a README file of 3.1 kB.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-expanded-size',
      'pass': false,
      'severity': 'LOW',
      'title': 'This package version\'s size on disk is 44.0 kB.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-file-count',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 9 file(s).',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-dir-count',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 2 dir(s).',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'deprecated',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version is not deprecated.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'uses-deprecated-node-apis',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not use any deprecated Node APIs.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-install-scripts',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have install scripts.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-gyp-file',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have a Gyp build file.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-unsafe-regexps',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have unsafe regular expressions.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'uses-eval',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not use eval() or implied eval.',
      'data': null
    },
    {
      'group': 'compliance',
      'name': 'license',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version license is acceptable: \'MIT\'',
      'data': {
        'spdx': 'MIT'
      }
    },
    {
      'group': 'risk',
      'name': 'missing-strict-mode',
      'pass': false,
      'severity': 'LOW',
      'title': 'This package version doesn\'t use strict mode in index.js:1:1.',
      'data': {
        'locations': [
          'index.js:1:1'
        ]
      }
    },
    {
      'group': 'risk',
      'name': 'has-lost-callback-errs',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version handles all callback errors.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-abandoned-promises',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version finalizes all detectable promises.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'has-scm-info',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a git repository at git://github.com/juliangruber/balanced-match.git .',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'scm-tagged-versions',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 100% tagged non-prelease versions in git.',
      'data': null
    }
  ]
},
{
  'name': 'concat-map',
  'version': '0.0.1',
  'published': true,
  'publishedAt': '2014-01-30T03:06:35.982Z',
  'scores': [
    {
      'group': 'risk',
      'name': 'missing-strict-mode',
      'pass': false,
      'severity': 'LOW',
      'title': 'This package version doesn\'t use strict mode in index.js:1:1.',
      'data': {
        'locations': [
          'index.js:1:1'
        ]
      }
    },
    {
      'group': 'quality',
      'name': 'disk-usage-expanded-size',
      'pass': false,
      'severity': 'LOW',
      'title': 'This package version\'s size on disk is 40.0 kB.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-file-count',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 7 file(s).',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-dir-count',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 3 dir(s).',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'uses-deprecated-node-apis',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not use any deprecated Node APIs.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'deprecated',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version is not deprecated.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'uses-eval',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not use eval() or implied eval.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'readme-exists',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a README file.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'readme-size',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a README file of 1.2 kB.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-install-scripts',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have install scripts.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-gyp-file',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have a Gyp build file.',
      'data': null
    },
    {
      'group': 'compliance',
      'name': 'license',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version license is acceptable: \'MIT\'',
      'data': {
        'spdx': 'MIT'
      }
    },
    {
      'group': 'risk',
      'name': 'has-lost-callback-errs',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version handles all callback errors.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-abandoned-promises',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version finalizes all detectable promises.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'has-scm-info',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a git repository at git://github.com/substack/node-concat-map.git .',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'scm-tagged-versions',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 50% tagged non-prelease versions in git.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-unsafe-regexps',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have unsafe regular expressions.',
      'data': null
    }
  ]
},
{
  'name': 'left-pad',
  'version': '1.3.0',
  'published': true,
  'publishedAt': '2018-04-09T01:10:45.796Z',
  'scores': [
    {
      'group': 'risk',
      'name': 'has-install-scripts',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have install scripts.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-gyp-file',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have a Gyp build file.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-unsafe-regexps',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have unsafe regular expressions.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'readme-exists',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a README file.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'readme-size',
      'pass': false,
      'severity': 'LOW',
      'title': 'This package version has a README file of 871 B.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-expanded-size',
      'pass': false,
      'severity': 'LOW',
      'title': 'This package version\'s size on disk is 48.0 kB.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-file-count',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 10 file(s).',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-dir-count',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 2 dir(s).',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'uses-eval',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not use eval() or implied eval.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'deprecated',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version is not deprecated.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'uses-deprecated-node-apis',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not use any deprecated Node APIs.',
      'data': null
    },
    {
      'group': 'compliance',
      'name': 'license',
      'pass': false,
      'severity': 'MEDIUM',
      'title': 'This package version license is unacceptable: \'WTFPL\'',
      'data': {
        'spdx': 'WTFPL'
      }
    },
    {
      'group': 'risk',
      'name': 'missing-strict-mode',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version always uses strict mode.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-abandoned-promises',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version finalizes all detectable promises.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-lost-callback-errs',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version handles all callback errors.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'has-scm-info',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a git repository at git+ssh://git@github.com/stevemao/left-pad.git .',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'scm-tagged-versions',
      'pass': false,
      'severity': 'MEDIUM',
      'title': 'This package has 40% tagged non-prelease versions in git.',
      'data': null
    }
  ]
},
{
  'name': 'is-path-in-cwd',
  'version': null,
  'published': false,
  'publishedAt': null,
  'scores': []
},
{
  'name': 'is-path-inside',
  'version': '2.1.0',
  'published': true,
  'publishedAt': '2019-04-15T16:33:19.419Z',
  'scores': [
    {
      'group': 'compliance',
      'name': 'license',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version license is acceptable: \'MIT\'',
      'data': {
        'spdx': 'MIT'
      }
    },
    {
      'group': 'risk',
      'name': 'has-lost-callback-errs',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version handles all callback errors.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'deprecated',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version is not deprecated.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'has-scm-info',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a git repository at git+https://github.com/sindresorhus/is-path-inside.git .',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'scm-tagged-versions',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 100% tagged non-prelease versions in git.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-abandoned-promises',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version finalizes all detectable promises.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'readme-exists',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a README file.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'readme-size',
      'pass': false,
      'severity': 'LOW',
      'title': 'This package version has a README file of 591 B.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-install-scripts',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have install scripts.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-gyp-file',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have a Gyp build file.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'uses-eval',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not use eval() or implied eval.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-expanded-size',
      'pass': false,
      'severity': 'LOW',
      'title': 'This package version\'s size on disk is 24.0 kB.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-file-count',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 5 file(s).',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-dir-count',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 1 dir(s).',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-unsafe-regexps',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have unsafe regular expressions.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'uses-deprecated-node-apis',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not use any deprecated Node APIs.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'missing-strict-mode',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version always uses strict mode.',
      'data': null
    }
  ]
},
{
  'name': 'path-is-inside',
  'version': '1.0.2',
  'published': true,
  'publishedAt': '2016-09-10T23:35:10.802Z',
  'scores': [
    {
      'group': 'risk',
      'name': 'deprecated',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version is not deprecated.',
      'data': null
    },
    {
      'group': 'compliance',
      'name': 'license',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version license is acceptable: \'(WTFPL OR MIT)\'',
      'data': {
        'spdx': '(WTFPL OR MIT)'
      }
    },
    {
      'group': 'quality',
      'name': 'has-scm-info',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version has a git repository at git+https://github.com/domenic/path-is-inside.git .',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'scm-tagged-versions',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 67% tagged non-prelease versions in git.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'uses-eval',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not use eval() or implied eval.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-abandoned-promises',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version finalizes all detectable promises.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-lost-callback-errs',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version handles all callback errors.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'readme-exists',
      'pass': false,
      'severity': 'MEDIUM',
      'title': 'This package version does not have a README file.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-expanded-size',
      'pass': false,
      'severity': 'LOW',
      'title': 'This package version\'s size on disk is 20.0 kB.',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-file-count',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 3 file(s).',
      'data': null
    },
    {
      'group': 'quality',
      'name': 'disk-usage-dir-count',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package has 2 dir(s).',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-install-scripts',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have install scripts.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-gyp-file',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have a Gyp build file.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'has-unsafe-regexps',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not have unsafe regular expressions.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'missing-strict-mode',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version always uses strict mode.',
      'data': null
    },
    {
      'group': 'risk',
      'name': 'uses-deprecated-node-apis',
      'pass': true,
      'severity': 'NONE',
      'title': 'This package version does not use any deprecated Node APIs.',
      'data': null
    }
  ]
}]
