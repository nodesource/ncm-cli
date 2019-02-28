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

8 [38;2;137;161;157mpackages checked[39m

  [38;2;255;96;64m! 0[39m critical risk
    [38;2;255;139;64m0[39m high risk
    [38;2;255;183;38m2[39m medium risk
    [38;2;137;161;157m1[39m low risk

  [38;2;90;200;120m✓[39m No security vulnerabilities found

  [38;2;255;96;64m![39m 1 noncompliant modules found
    [38;2;102;204;187m|➔ Run \`ncm-cli report --filter=compliance\` for a list[39m

[38;2;137;161;157m─────────────────────────────────────────────────────────────────────────────────────────────────[39m
[38;2;137;161;157m  Top 5: Highest Risk Modules[39m
[38;2;137;161;157m-------------------------------------------------------------------------------------------------[39m
[38;2;137;161;157m  Module Name                               Risk         License                 Security[39m
[38;2;137;161;157m┌──────────────────────────────────────────┬────────────┬───────────────────────┬───────────────┐[39m
[38;2;137;161;157m│[39m chalk @ 2.4.2                            [38;2;137;161;157m│[39m [38;2;255;183;38m||[39m[38;2;76;88;89m||[39m [38;2;137;161;157mMed [39m  [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m MIT                 [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m 0           [38;2;137;161;157m│[39m
[38;2;137;161;157m│[39m left-pad @ 1.3.0                         [38;2;137;161;157m│[39m [38;2;255;183;38m||[39m[38;2;76;88;89m||[39m [38;2;137;161;157mMed [39m  [38;2;137;161;157m│[39m [38;2;255;96;64mX[39m WTFPL               [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m 0           [38;2;137;161;157m│[39m
[38;2;137;161;157m│[39m color-convert @ 1.9.3                    [38;2;137;161;157m│[39m [38;2;137;161;157m|[39m[38;2;76;88;89m|||[39m [38;2;137;161;157mLow [39m  [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m MIT                 [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m 0           [38;2;137;161;157m│[39m
[38;2;137;161;157m│[39m ansi-styles @ 3.2.1                      [38;2;137;161;157m│[39m [38;2;76;88;89m||||[39m [38;2;76;88;89mNone[39m  [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m MIT                 [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m 0           [38;2;137;161;157m│[39m
[38;2;137;161;157m│[39m color-name @ 1.1.3                       [38;2;137;161;157m│[39m [38;2;76;88;89m||||[39m [38;2;76;88;89mNone[39m  [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m MIT                 [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m 0           [38;2;137;161;157m│[39m
[38;2;137;161;157m└──────────────────────────────────────────┴────────────┴───────────────────────┴───────────────┘[39m

`

exports[`test/report.js TAP report --compliance output > report-output-compliance 1`] = `

[38;2;137;161;157m╔═════════════════════╗[39m
[38;2;137;161;157m║[39m [37mmock-project Report[39m [38;2;137;161;157m║[39m
[38;2;137;161;157m╚═════════════════════╝[39m

8 [38;2;137;161;157mpackages checked[39m

 [38;2;137;161;157m|[39m[38;2;76;88;89m|||[39m [38;2;137;161;157mLow[39m Average module risk

  [38;2;90;200;120m✓[39m 0 security vulnerabilities found
    [38;2;255;96;64mC[39m 0 critical severity
    [38;2;255;139;64mH[39m 0 high severity
    [38;2;255;183;38mM[39m 0 medium severity
    [38;2;137;161;157mL[39m 0 low severity

[38;2;255;96;64m![39m 1 noncompliant modules found
  [38;2;102;204;187m|➔ Run \`ncm-cli report --compliance\` for more details[39m

[38;2;137;161;157m  Module Name                               Risk         License                 Security[39m
[38;2;137;161;157m┌──────────────────────────────────────────┬────────────┬───────────────────────┬───────────────┐[39m
[38;2;137;161;157m│[39m left-pad @ 1.3.0                         [38;2;137;161;157m│[39m [38;2;255;183;38m||[39m[38;2;76;88;89m||[39m [38;2;137;161;157mMed [39m  [38;2;137;161;157m│[39m [38;2;255;96;64mX[39m WTFPL               [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m 0           [38;2;137;161;157m│[39m
[38;2;137;161;157m└──────────────────────────────────────────┴────────────┴───────────────────────┴───────────────┘[39m

`

exports[`test/report.js TAP report output matches snapshot > long-report-output 1`] = `

[38;2;137;161;157m╔═════════════════════╗[39m
[38;2;137;161;157m║[39m [37mmock-project Report[39m [38;2;137;161;157m║[39m
[38;2;137;161;157m╚═════════════════════╝[39m

8 [38;2;137;161;157mpackages checked[39m

  [38;2;255;96;64m! 0[39m critical risk
    [38;2;255;139;64m0[39m high risk
    [38;2;255;183;38m2[39m medium risk
    [38;2;137;161;157m1[39m low risk

  [38;2;90;200;120m✓[39m No security vulnerabilities found

  [38;2;255;96;64m![39m 1 noncompliant modules found
    [38;2;102;204;187m|➔ Run \`ncm-cli report --filter=compliance\` for a list[39m

[38;2;137;161;157m─────────────────────────────────────────────────────────────────────────────────────────────────[39m
[38;2;137;161;157m  Modules[39m
[38;2;137;161;157m-------------------------------------------------------------------------------------------------[39m
[38;2;137;161;157m  Module Name                               Risk         License                 Security[39m
[38;2;137;161;157m┌──────────────────────────────────────────┬────────────┬───────────────────────┬───────────────┐[39m
[38;2;137;161;157m│[39m chalk @ 2.4.2                            [38;2;137;161;157m│[39m [38;2;255;183;38m||[39m[38;2;76;88;89m||[39m [38;2;137;161;157mMed [39m  [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m MIT                 [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m 0           [38;2;137;161;157m│[39m
[38;2;137;161;157m│[39m left-pad @ 1.3.0                         [38;2;137;161;157m│[39m [38;2;255;183;38m||[39m[38;2;76;88;89m||[39m [38;2;137;161;157mMed [39m  [38;2;137;161;157m│[39m [38;2;255;96;64mX[39m WTFPL               [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m 0           [38;2;137;161;157m│[39m
[38;2;137;161;157m│[39m color-convert @ 1.9.3                    [38;2;137;161;157m│[39m [38;2;137;161;157m|[39m[38;2;76;88;89m|||[39m [38;2;137;161;157mLow [39m  [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m MIT                 [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m 0           [38;2;137;161;157m│[39m
[38;2;137;161;157m│[39m ansi-styles @ 3.2.1                      [38;2;137;161;157m│[39m [38;2;76;88;89m||||[39m [38;2;76;88;89mNone[39m  [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m MIT                 [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m 0           [38;2;137;161;157m│[39m
[38;2;137;161;157m│[39m color-name @ 1.1.3                       [38;2;137;161;157m│[39m [38;2;76;88;89m||||[39m [38;2;76;88;89mNone[39m  [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m MIT                 [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m 0           [38;2;137;161;157m│[39m
[38;2;137;161;157m│[39m escape-string-regexp @ 1.0.5             [38;2;137;161;157m│[39m [38;2;76;88;89m||||[39m [38;2;76;88;89mNone[39m  [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m MIT                 [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m 0           [38;2;137;161;157m│[39m
[38;2;137;161;157m│[39m has-flag @ 3.0.0                         [38;2;137;161;157m│[39m [38;2;76;88;89m||||[39m [38;2;76;88;89mNone[39m  [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m MIT                 [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m 0           [38;2;137;161;157m│[39m
[38;2;137;161;157m│[39m supports-color @ 5.5.0                   [38;2;137;161;157m│[39m [38;2;76;88;89m||||[39m [38;2;76;88;89mNone[39m  [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m MIT                 [38;2;137;161;157m│[39m [38;2;90;200;120m✓[39m 0           [38;2;137;161;157m│[39m
[38;2;137;161;157m└──────────────────────────────────────────┴────────────┴───────────────────────┴───────────────┘[39m

`
