/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/report.js TAP report output matches snapshot > report-output 1`] = `

[38;2;137;161;157m╔═════════════════════╗[39m
[38;2;137;161;157m║[39m [37mmock-project Report[39m [38;2;137;161;157m║[39m
[38;2;137;161;157m╚═════════════════════╝[39m

32 [38;2;137;161;157mpackages checked[39m

  [38;2;255;96;64m! 1[39m critical risk
    [38;2;255;139;64m2[39m high risk
    [38;2;255;183;38m5[39m medium risk
    [38;2;137;161;157m10[39m low risk

  [38;2;255;96;64m![39m 1 security vulnerabilities found across 1 modules
    [38;2;102;204;187m|➔ Run \`ncm-cli report --filter=security\` for a list[39m

  [38;2;255;96;64m![39m 1 noncompliant modules found
    [38;2;102;204;187m|➔ Run \`ncm-cli report --filter=compliance\` for a list[39m

[38;2;137;161;157m─────────────────────────────────────────────────────────────────────────────────────────────────[39m
[38;2;137;161;157m  Top 5: Highest Risk Modules[39m
[38;2;137;161;157m-------------------------------------------------------------------------------------------------[39m
[38;2;137;161;157m  Module Name                               Risk         License                 Security[39m
[38;2;137;161;157m┌──────────────────────────────────────────┬────────────┬───────────────────────┬───────────────┐[39m
[38;2;137;161;157m│[39m kind-of @ 3.2.2                          [38;2;137;161;157m│[39m [38;2;255;96;64m||||[39m [38;2;137;161;157mCrit[39m  [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m MIT                 [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m 0           [38;2;137;161;157m│[39m
[38;2;137;161;157m│[39m handlebars @ 4.0.5                       [38;2;137;161;157m│[39m [38;2;255;139;64m|||[39m[38;2;76;88;89m|[39m [38;2;137;161;157mHigh[39m  [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m MIT                 [38;2;137;161;157m│[39m [38;2;255;96;64mX[39m [38;2;255;139;64m1H[39m          [38;2;137;161;157m│[39m
[38;2;137;161;157m│[39m uglify-js @ 2.8.29                       [38;2;137;161;157m│[39m [38;2;255;139;64m|||[39m[38;2;76;88;89m|[39m [38;2;137;161;157mHigh[39m  [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m BSD-2-Clause        [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m 0           [38;2;137;161;157m│[39m
[38;2;137;161;157m│[39m chalk @ 2.4.2                            [38;2;137;161;157m│[39m [38;2;255;183;38m||[39m[38;2;76;88;89m||[39m [38;2;137;161;157mMed [39m  [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m MIT                 [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m 0           [38;2;137;161;157m│[39m
[38;2;137;161;157m│[39m left-pad @ 1.3.0                         [38;2;137;161;157m│[39m [38;2;255;183;38m||[39m[38;2;76;88;89m||[39m [38;2;137;161;157mMed [39m  [38;2;137;161;157m│[39m [38;2;255;96;64mX[39m WTFPL               [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m 0           [38;2;137;161;157m│[39m
[38;2;137;161;157m└──────────────────────────────────────────┴────────────┴───────────────────────┴───────────────┘[39m

`

exports[`test/report.js TAP report --compliance output > report-output-compliance 1`] = `

[38;2;137;161;157m╔═════════════════════╗[39m
[38;2;137;161;157m║[39m [37mmock-project Report[39m [38;2;137;161;157m║[39m
[38;2;137;161;157m╚═════════════════════╝[39m

32 [38;2;137;161;157mpackages checked[39m

  [38;2;255;96;64m! 1[39m critical risk
    [38;2;255;139;64m2[39m high risk
    [38;2;255;183;38m5[39m medium risk
    [38;2;137;161;157m10[39m low risk

  [38;2;255;96;64m![39m 1 security vulnerabilities found across 1 modules
    [38;2;102;204;187m|➔ Run \`ncm-cli report --filter=security\` for a list[39m

  [38;2;255;96;64m![39m 1 noncompliant modules found
    [38;2;102;204;187m|➔ Run \`ncm-cli report --filter=compliance\` for a list[39m

[38;2;137;161;157m─────────────────────────────────────────────────────────────────────────────────────────────────[39m
[38;2;137;161;157m  null[39m
[38;2;137;161;157m-------------------------------------------------------------------------------------------------[39m
[38;2;137;161;157m  Module Name                               Risk         License                 Security[39m
[38;2;137;161;157m┌──────────────────────────────────────────┬────────────┬───────────────────────┬───────────────┐[39m
[38;2;137;161;157m│[39m left-pad @ 1.3.0                         [38;2;137;161;157m│[39m [38;2;255;183;38m||[39m[38;2;76;88;89m||[39m [38;2;137;161;157mMed [39m  [38;2;137;161;157m│[39m [38;2;255;96;64mX[39m WTFPL               [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m 0           [38;2;137;161;157m│[39m
[38;2;137;161;157m└──────────────────────────────────────────┴────────────┴───────────────────────┴───────────────┘[39m

`

exports[`test/report.js TAP report output matches snapshot > long-report-output 1`] = `

[38;2;137;161;157m╔═════════════════════╗[39m
[38;2;137;161;157m║[39m [37mmock-project Report[39m [38;2;137;161;157m║[39m
[38;2;137;161;157m╚═════════════════════╝[39m

32 [38;2;137;161;157mpackages checked[39m

  [38;2;255;96;64m! 1[39m critical risk
    [38;2;255;139;64m2[39m high risk
    [38;2;255;183;38m5[39m medium risk
    [38;2;137;161;157m10[39m low risk

  [38;2;255;96;64m![39m 1 security vulnerabilities found across 1 modules
    [38;2;102;204;187m|➔ Run \`ncm-cli report --filter=security\` for a list[39m

  [38;2;255;96;64m![39m 1 noncompliant modules found
    [38;2;102;204;187m|➔ Run \`ncm-cli report --filter=compliance\` for a list[39m

[38;2;137;161;157m─────────────────────────────────────────────────────────────────────────────────────────────────[39m
[38;2;137;161;157m  Modules[39m
[38;2;137;161;157m-------------------------------------------------------------------------------------------------[39m
[38;2;137;161;157m  Module Name                               Risk         License                 Security[39m
[38;2;137;161;157m┌──────────────────────────────────────────┬────────────┬───────────────────────┬───────────────┐[39m
[38;2;137;161;157m│[39m kind-of @ 3.2.2                          [38;2;137;161;157m│[39m [38;2;255;96;64m||||[39m [38;2;137;161;157mCrit[39m  [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m MIT                 [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m 0           [38;2;137;161;157m│[39m
[38;2;137;161;157m│[39m handlebars @ 4.0.5                       [38;2;137;161;157m│[39m [38;2;255;139;64m|||[39m[38;2;76;88;89m|[39m [38;2;137;161;157mHigh[39m  [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m MIT                 [38;2;137;161;157m│[39m [38;2;255;96;64mX[39m [38;2;255;139;64m1H[39m          [38;2;137;161;157m│[39m
[38;2;137;161;157m│[39m uglify-js @ 2.8.29                       [38;2;137;161;157m│[39m [38;2;255;139;64m|||[39m[38;2;76;88;89m|[39m [38;2;137;161;157mHigh[39m  [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m BSD-2-Clause        [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m 0           [38;2;137;161;157m│[39m
[38;2;137;161;157m│[39m chalk @ 2.4.2                            [38;2;137;161;157m│[39m [38;2;255;183;38m||[39m[38;2;76;88;89m||[39m [38;2;137;161;157mMed [39m  [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m MIT                 [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m 0           [38;2;137;161;157m│[39m
[38;2;137;161;157m│[39m left-pad @ 1.3.0                         [38;2;137;161;157m│[39m [38;2;255;183;38m||[39m[38;2;76;88;89m||[39m [38;2;137;161;157mMed [39m  [38;2;137;161;157m│[39m [38;2;255;96;64mX[39m WTFPL               [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m 0           [38;2;137;161;157m│[39m
[38;2;137;161;157m│[39m minimist @ 0.0.10                        [38;2;137;161;157m│[39m [38;2;255;183;38m||[39m[38;2;76;88;89m||[39m [38;2;137;161;157mMed [39m  [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m MIT                 [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m 0           [38;2;137;161;157m│[39m
[38;2;137;161;157m│[39m source-map @ 0.5.7                       [38;2;137;161;157m│[39m [38;2;255;183;38m||[39m[38;2;76;88;89m||[39m [38;2;137;161;157mMed [39m  [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m BSD-3-Clause        [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m 0           [38;2;137;161;157m│[39m
[38;2;137;161;157m│[39m yargs @ 3.10.0                           [38;2;137;161;157m│[39m [38;2;255;183;38m||[39m[38;2;76;88;89m||[39m [38;2;137;161;157mMed [39m  [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m MIT                 [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m 0           [38;2;137;161;157m│[39m
[38;2;137;161;157m│[39m amdefine @ 1.0.1                         [38;2;137;161;157m│[39m [38;2;137;161;157m|[39m[38;2;76;88;89m|||[39m [38;2;137;161;157mLow [39m  [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m BSD-3-Clause OR MIT [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m 0           [38;2;137;161;157m│[39m
[38;2;137;161;157m│[39m async @ 1.5.2                            [38;2;137;161;157m│[39m [38;2;137;161;157m|[39m[38;2;76;88;89m|||[39m [38;2;137;161;157mLow [39m  [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m MIT                 [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m 0           [38;2;137;161;157m│[39m
[38;2;137;161;157m│[39m cliui @ 2.1.0                            [38;2;137;161;157m│[39m [38;2;137;161;157m|[39m[38;2;76;88;89m|||[39m [38;2;137;161;157mLow [39m  [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m ISC                 [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m 0           [38;2;137;161;157m│[39m
[38;2;137;161;157m│[39m color-convert @ 1.9.3                    [38;2;137;161;157m│[39m [38;2;137;161;157m|[39m[38;2;76;88;89m|||[39m [38;2;137;161;157mLow [39m  [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m MIT                 [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m 0           [38;2;137;161;157m│[39m
[38;2;137;161;157m│[39m is-buffer @ 1.1.6                        [38;2;137;161;157m│[39m [38;2;137;161;157m|[39m[38;2;76;88;89m|||[39m [38;2;137;161;157mLow [39m  [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m MIT                 [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m 0           [38;2;137;161;157m│[39m
[38;2;137;161;157m│[39m optimist @ 0.6.1                         [38;2;137;161;157m│[39m [38;2;137;161;157m|[39m[38;2;76;88;89m|||[39m [38;2;137;161;157mLow [39m  [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m MIT                 [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m 0           [38;2;137;161;157m│[39m
[38;2;137;161;157m│[39m source-map @ 0.4.4                       [38;2;137;161;157m│[39m [38;2;137;161;157m|[39m[38;2;76;88;89m|||[39m [38;2;137;161;157mLow [39m  [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m BSD-3-Clause        [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m 0           [38;2;137;161;157m│[39m
[38;2;137;161;157m│[39m window-size @ 0.1.0                      [38;2;137;161;157m│[39m [38;2;137;161;157m|[39m[38;2;76;88;89m|||[39m [38;2;137;161;157mLow [39m  [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m MIT                 [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m 0           [38;2;137;161;157m│[39m
[38;2;137;161;157m│[39m wordwrap @ 0.0.2                         [38;2;137;161;157m│[39m [38;2;137;161;157m|[39m[38;2;76;88;89m|||[39m [38;2;137;161;157mLow [39m  [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m MIT                 [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m 0           [38;2;137;161;157m│[39m
[38;2;137;161;157m│[39m wordwrap @ 0.0.3                         [38;2;137;161;157m│[39m [38;2;137;161;157m|[39m[38;2;76;88;89m|||[39m [38;2;137;161;157mLow [39m  [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m MIT                 [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m 0           [38;2;137;161;157m│[39m
[38;2;137;161;157m│[39m align-text @ 0.1.4                       [38;2;137;161;157m│[39m [38;2;76;88;89m||||[39m [38;2;76;88;89mNone[39m  [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m MIT                 [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m 0           [38;2;137;161;157m│[39m
[38;2;137;161;157m│[39m ansi-styles @ 3.2.1                      [38;2;137;161;157m│[39m [38;2;76;88;89m||||[39m [38;2;76;88;89mNone[39m  [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m MIT                 [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m 0           [38;2;137;161;157m│[39m
[38;2;137;161;157m│[39m camelcase @ 1.2.1                        [38;2;137;161;157m│[39m [38;2;76;88;89m||||[39m [38;2;76;88;89mNone[39m  [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m MIT                 [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m 0           [38;2;137;161;157m│[39m
[38;2;137;161;157m│[39m center-align @ 0.1.3                     [38;2;137;161;157m│[39m [38;2;76;88;89m||||[39m [38;2;76;88;89mNone[39m  [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m MIT                 [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m 0           [38;2;137;161;157m│[39m
[38;2;137;161;157m│[39m color-name @ 1.1.3                       [38;2;137;161;157m│[39m [38;2;76;88;89m||||[39m [38;2;76;88;89mNone[39m  [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m MIT                 [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m 0           [38;2;137;161;157m│[39m
[38;2;137;161;157m│[39m decamelize @ 1.2.0                       [38;2;137;161;157m│[39m [38;2;76;88;89m||||[39m [38;2;76;88;89mNone[39m  [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m MIT                 [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m 0           [38;2;137;161;157m│[39m
[38;2;137;161;157m│[39m escape-string-regexp @ 1.0.5             [38;2;137;161;157m│[39m [38;2;76;88;89m||||[39m [38;2;76;88;89mNone[39m  [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m MIT                 [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m 0           [38;2;137;161;157m│[39m
[38;2;137;161;157m│[39m has-flag @ 3.0.0                         [38;2;137;161;157m│[39m [38;2;76;88;89m||||[39m [38;2;76;88;89mNone[39m  [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m MIT                 [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m 0           [38;2;137;161;157m│[39m
[38;2;137;161;157m│[39m lazy-cache @ 1.0.4                       [38;2;137;161;157m│[39m [38;2;76;88;89m||||[39m [38;2;76;88;89mNone[39m  [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m MIT                 [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m 0           [38;2;137;161;157m│[39m
[38;2;137;161;157m│[39m longest @ 1.0.1                          [38;2;137;161;157m│[39m [38;2;76;88;89m||||[39m [38;2;76;88;89mNone[39m  [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m MIT                 [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m 0           [38;2;137;161;157m│[39m
[38;2;137;161;157m│[39m repeat-string @ 1.6.1                    [38;2;137;161;157m│[39m [38;2;76;88;89m||||[39m [38;2;76;88;89mNone[39m  [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m MIT                 [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m 0           [38;2;137;161;157m│[39m
[38;2;137;161;157m│[39m right-align @ 0.1.3                      [38;2;137;161;157m│[39m [38;2;76;88;89m||||[39m [38;2;76;88;89mNone[39m  [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m MIT                 [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m 0           [38;2;137;161;157m│[39m
[38;2;137;161;157m│[39m supports-color @ 5.5.0                   [38;2;137;161;157m│[39m [38;2;76;88;89m||||[39m [38;2;76;88;89mNone[39m  [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m MIT                 [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m 0           [38;2;137;161;157m│[39m
[38;2;137;161;157m│[39m uglify-to-browserify @ 1.0.2             [38;2;137;161;157m│[39m [38;2;76;88;89m||||[39m [38;2;76;88;89mNone[39m  [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m MIT                 [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m 0           [38;2;137;161;157m│[39m
[38;2;137;161;157m└──────────────────────────────────────────┴────────────┴───────────────────────┴───────────────┘[39m

`
