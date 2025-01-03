# NCM-CLI

[![Build Status](https://travis-ci.org/nodesource/ncm-cli.svg?branch=master)](https://travis-ci.org/nodesource/ncm-cli)

The command-line tool for NodeSource Certified Modules 2.0 — designed to make code quality, security, and compliance a breeze. Generate a custom project report, fetch compliance and security information, manage organizational whitelists, and inspect specific packages in greater detail — all from the command-line.

_Additional NodeSource Certified Modules v2 information is available [on the NodeSource documentation site](https://docs.nodesource.com/docs/category/ncm-v2)._

## Installation

```
$ npm install -g ncm-cli
```

## Usage

```
$ ncm <command> [options]
```

```
$ ncm help <command>
```

## Authentication

`ncm-cli` supports three forms of authentication (required).

### 1. NodeSource Account:

Sign-in interactively using your [NodeSource account](https://accounts.nodesource.com) email and password.

```
$ ncm signin
```

### 2. Single Sign-on

* Using a Google account: `ncm signin -G, --google`
* Using a GitHub account: `ncm signin -g, --github`

### 3. Environment Variable (CI/CD)

```
$ NCM_TOKEN=<token> ncm <command> [options]
```

Learn more about obtaining NodeSource service tokens and configuring permissions [here](https://docs.nodesource.com/ncm_v2/docs#ci-setup).

## `ncm report`

Generates a project-wide report of directory risk and quality of installed or specified packages.
The top five riskiest modules detected will be displayed alongside a concise project report.

The directory to generate a report from may be specified via `ncm report <dir>`.
Defaults to using the current working directory.

```
$ ncm report

╔════════════╗
║ foo Report ║
╚════════════╝

23 packages checked

  ! 2 critical risk
    4 high risk
    4 medium risk
    10 low risk

  ! 6 security vulnerabilities found across 5 modules
    |➔ Run `ncm report --filter=security` for a list

  ! 2 noncompliant modules found
    |➔ Run `ncm report --filter=compliance` for a list

  ! 1 used modules whitelisted
    |➔ Run `ncm whitelist --list` for a list

─────────────────────────────────────────────────────────────────────────────────────────────────
  Top 5: Highest Risk Modules
-------------------------------------------------------------------------------------------------
  Module Name                               Risk         License                 Security
┌──────────────────────────────────────────┬────────────┬───────────────────────┬───────────────┐
│ mime @ 1.3.4                             │ |||| Crit  │ ✓ MIT                 │ X 1L          │
│ superagent @ 1.8.5                       │ |||| Crit  │ ✓ MIT                 │ X 1M 1L       │
│ form-data @ 1.0.0-rc3                    │ |||| High  │ ✓ MIT                 │ ✓ 0           │
│ formidable @ 1.0.16                      │ |||| High  │ X UNKNOWN             │ ✓ 0           │
│ mime @ 1.2.11                            │ |||| High  │ X UNKNOWN             │ X 1L          │
└──────────────────────────────────────────┴────────────┴───────────────────────┴───────────────┘
```

### Full Reports

A report with a list of all modules can be generated by passing `--long, -l`.

```
$ ncm report --long

╔════════════╗
║ foo Report ║
╚════════════╝

23 packages checked

  ! 2 critical risk
    4 high risk
    4 medium risk
    10 low risk

  ! 6 security vulnerabilities found across 5 modules
    |➔ Run `ncm report --filter=security` for a list

  ! 2 noncompliant modules found
    |➔ Run `ncm report --filter=compliance` for a list

─────────────────────────────────────────────────────────────────────────────────────────────────
  Whitelisted Modules
-------------------------------------------------------------------------------------------------
  Module Name                               Risk         License                 Security
┌──────────────────────────────────────────┬────────────┬───────────────────────┬───────────────┐
│ qs @ 6.3.1                               │ |||| Crit  │ ✓ BSD-3-Clause        │ X 1H          │
└──────────────────────────────────────────┴────────────┴───────────────────────┴───────────────┘
─────────────────────────────────────────────────────────────────────────────────────────────────
  Non-whitelisted Modules
-------------------------------------------------------------------------------------------------
  Module Name                               Risk         License                 Security
┌──────────────────────────────────────────┬────────────┬───────────────────────┬───────────────┐
│ mime @ 1.3.4                             │ |||| Crit  │ ✓ MIT                 │ X 1L          │
│ superagent @ 1.8.5                       │ |||| Crit  │ ✓ MIT                 │ X 1M 1L       │
│ form-data @ 1.0.0-rc3                    │ |||| High  │ ✓ MIT                 │ ✓ 0           │
│ formidable @ 1.0.16                      │ |||| High  │ X UNKNOWN             │ ✓ 0           │
│ mime @ 1.2.11                            │ |||| High  │ X UNKNOWN             │ X 1L          │
│ qs @ 2.3.3                               │ |||| High  │ ✓ BSD-2-Clause        │ X 1H          │

 ... etc ...

│ mime-types @ 2.1.22                      │ |||| None  │ ✓ MIT                 │ ✓ 0           │
└──────────────────────────────────────────┴────────────┴───────────────────────┴───────────────┘
```

### Filters

Reports may be filtered based on any of the following flags:

- `--compliance, -c` - only display non-compliant packages.
- `--security, -s` - only display packages with vulnerabilities.

## Options

- `--json, -j` - Formats the report in JSON (disabled by default)

## `ncm details <module{@version}>`

Returns a detailed report about a specific module version.
Defaults to using the `latest` version as published to npm if no `version` is provided.

```
$ ncm details client-request@2.3.0

╔═════════════════════════════════════════╗
║ client-request @ 2.3.0 (within ncm-cli) ║
╚═════════════════════════════════════════╝

┌──────┬───────────┐
│ |||| │ None Risk │
└──────┴───────────┘

Security Risk:
  ✓ 0 security vulnerabilities found
    C 0 critical severity
    H 0 high severity
    M 0 medium severity
    L 0 low severity

┌───┬─────────────────────────────┐
│ ✓ │ No Security Vulnerabilities │
└───┴─────────────────────────────┘

License Risk:
┌───┬─────┐
│ ✓ │ MIT │
└───┴─────┘

Module Risk:
┌───┬────────────────┐
│ ✓ │ No Module Risk │
└───┴────────────────┘

Code Quality (does not affect risk score):
┌───┬────────────────────────────────────────────────────────────────────────────────────────────┐
│ ! │ This package version's size on disk is 40.0 kB.                                            │
└───┴────────────────────────────────────────────────────────────────────────────────────────────┘

Required By (leftmost is directly in your package):
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ (Directly in your package)                                                                 │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

## `ncm install <module{@version}>`

Runs and displays `ncm details <module{@version}>` with an interactive confirmation prompt.
If confirmed, attempts to run `npm install <module{@version}>` with any additional options provided.

_The config keys `installBin` and `installCmd` can adjust this to work with other package installers if necessary._
_For more information, see `ncm config --help`._

## `ncm whitelist`

Display or modify your NodeSource organization’s module whitelist.

### `ncm whitelist --list`

Returns a list containing each module in your NodeSource organization’s whitelist.
Public modules are listed alongside their risk score, license compliance, and security summary.

```
$ ncm whitelist --list

╔══════════════════════════════╗
║ personal Whitelisted Modules ║
╚══════════════════════════════╝

2 modules total
─────────────────────────────────────────────────────────────────────────────────────────────────
  Whitelisted Modules
-------------------------------------------------------------------------------------------------
  Module Name                               Risk         License                 Security
┌──────────────────────────────────────────┬────────────┬───────────────────────┬───────────────┐
│ express @ 4.0.0                          │ |||| None  │ ✓ MIT                 │ X 1M          │
│ qs @ 6.3.1                               │ |||| None  │ ✓ BSD-3-Clause        │ X 1H          │
└──────────────────────────────────────────┴────────────┴───────────────────────┴───────────────┘
```

### `ncm whitelist --add <module@version>`

Add one or more modules to your NodeSource organization’s whitelist.

### `ncm whitelist --remove <module@version>`

Remove one or more modules from your NodeSource organization’s whitelist.

## `ncm orgs`

Change your active NodeSource organization, which impacts the whitelist.
Defaults to an interactive prompt.

By passing an `<orgname>`, the interactive part may be skipped.

Input is _case sensitive_.

## `ncm config`

Access to various configuration settings.
For more information, use the help command: `ncm config --help`

## License & Copyright

Copyright 2019 NodeSource — _[Contributions via DCO 1.1](contributing.md#developers-certificate-of-origin)_

Licensed under the Apache License, Version 2.0 — see the [LICENSE](LICENSE) file for details.
