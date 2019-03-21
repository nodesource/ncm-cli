# NCM-CLI

[![Build Status](https://travis-ci.org/nodesource/ncm-cli.svg?branch=master)](https://travis-ci.org/nodesource/ncm-cli)

`ncm-cli` is a command-line tool for NodeSource Certified Modules 2.0, designed to make code quality, security, and compliance a breeze. Generate a custom project report, fetch compliance and security information, manage organizational whitelists, and inspect specific packages in greater detail -- all from the command-line.

## Installation

```
npm install -g ncm-cli
```

## Usage

```
Usage:
┌─────────────────────────┐
│ ncm <command> [options] │
└─────────────────────────┘

 -h, --help    Display help for any command OR this message
 -v, --version Print ncm CLI version

ncm details <module>
ncm details <module@version>

ncm report
ncm report <directory>
  -l, --long
  -c --compliance
  -s --security
  --filter=<value>

ncm signin (interactive)
 -g, --github Sign in via GitHub account
 -G, --google Sign in via Google account

ncm signout
```

## Authentication

`ncm-cli` supports three forms of authentication.

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

Learn more about obtaining service tokens and configuring permissions [here](https://docs.nodesource.com/ncm_v2/docs#ci-setup).

## `ncm report`

Generate and return a project report (defaults to the current directory) outlining package certification. To specify a directory on which to generate a report, simply pass the directory following the command. The top five riskiest modules will be displayed alongside your concise project report.

```
$ ncm report /path/to/foo

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

By passing `--long, -l`, the returned report will be formatted to give greater detail into individual package certification. This will include the module name, version, risk score, license compliance, and respective security vulnerabilities.

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
│ cookiejar @ 2.0.6                        │ |||| Med   │ ✓ MIT                 │ ✓ 0           │
│ ms @ 2.0.0                               │ |||| Med   │ ✓ MIT                 │ ✓ 0           │
│ readable-stream @ 1.0.27-1               │ |||| Med   │ ✓ MIT                 │ ✓ 0           │
│ string_decoder @ 0.10.31                 │ |||| Med   │ ✓ MIT                 │ ✓ 0           │
│ async @ 1.5.2                            │ |||| Low   │ ✓ MIT                 │ ✓ 0           │
│ combined-stream @ 1.0.7                  │ |||| Low   │ ✓ MIT                 │ ✓ 0           │
│ component-emitter @ 1.2.1                │ |||| Low   │ ✓ MIT                 │ ✓ 0           │
│ core-util-is @ 1.0.2                     │ |||| Low   │ ✓ MIT                 │ ✓ 0           │
│ delayed-stream @ 1.0.0                   │ |||| Low   │ ✓ MIT                 │ ✓ 0           │
│ extend @ 3.0.0                           │ |||| Low   │ ✓ MIT                 │ X 1L          │
│ inherits @ 2.0.3                         │ |||| Low   │ ✓ ISC                 │ ✓ 0           │
│ isarray @ 0.0.1                          │ |||| Low   │ ✓ MIT                 │ ✓ 0           │
│ mime-db @ 1.38.0                         │ |||| Low   │ ✓ MIT                 │ ✓ 0           │
│ reduce-component @ 1.0.1                 │ |||| Low   │ ✓ Apache-2.0          │ ✓ 0           │
│ debug @ 2.6.9                            │ |||| None  │ ✓ MIT                 │ ✓ 0           │
│ methods @ 1.1.2                          │ |||| None  │ ✓ MIT                 │ ✓ 0           │
│ mime-types @ 2.1.22                      │ |||| None  │ ✓ MIT                 │ ✓ 0           │
└──────────────────────────────────────────┴────────────┴───────────────────────┴───────────────┘
```

The report feature also includes the ability to filter depending on specified criteria.

### Filter: Compliance
To display only non-compliant packages, pass the `--compliance, -c` flag.

### Filter: Security
To display packages which contain at least one security vulnerability, pass the `--security, -s` flag.

### Filter: Vulnerability Severity
You may also filter the report based on one or more severity levels. `ncm-cli` supports the following levels of severity: critical, high, medium, low. Passing the `--filter=` flag along with one or more of these filter parameters will result in a report that displays only packages that contain at least one such vulnerability.

```
$ ncm report --filter=high,medium

╔════════════╗
║ foo Report ║
╚════════════╝

24 packages checked

  ! 3 critical risk
    4 high risk
    4 medium risk
    10 low risk

  ! 7 security vulnerabilities found across 6 modules
    |➔ Run `ncm report --filter=security` for a list

  ! 2 noncompliant modules found
    |➔ Run `ncm report --filter=compliance` for a list

─────────────────────────────────────────────────────────────────────────────────────────────────
  null
-------------------------------------------------------------------------------------------------
  Module Name                               Risk         License                 Security
┌──────────────────────────────────────────┬────────────┬───────────────────────┬───────────────┐
│ qs @ 6.3.1                               │ |||| Crit  │ ✓ BSD-3-Clause        │ X 1H          │
│ superagent @ 1.8.5                       │ |||| Crit  │ ✓ MIT                 │ X 1M 1L       │
│ qs @ 2.3.3                               │ |||| High  │ ✓ BSD-2-Clause        │ X 1H          │
└──────────────────────────────────────────┴────────────┴───────────────────────┴───────────────┘
```

## `ncm details <module{@version}>`

Returns a detailed report about a specific module with version. `ncm-cli` will default to using the `latest` version.

```
$ ncm details client-request

╔═════════════════════════╗
║ client-request @ latest ║
╚═════════════════════════╝

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
```

## `ncm whitelist`

Display and modify your organization’s module whitelist.

### `ncm whitelist --list`

Returns a list containing each module in your organization’s whitelist. Public modules are listed alongside their risk score, license compliance, and security summary.

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

Add a module to your organization’s whitelist.

### `ncm whitelist --remove <module@version>`

Remove a module to your organization’s whitelist.

```
$ ncm whitelist --remove qs@6.3.1

╔══════════════════════════════╗
║ personal Whitelisted Modules ║
╚══════════════════════════════╝

✓ Package(s) removed successfully.
```

## `ncm config`

`ncm-cli` allows access to various configuration settings. For more information, use the help command: `ncm config --help`

## `ncm help`

Display the NodeSource Certified Modules help menu. For more information on a specific command, run `ncm <command> --help`.

## `ncm orgs <orgname>`

Change your active organization interactively by entering the `orgs` command without passing an `<orgname>`. By passing an organization name, `ncm-cli` will switch the active organization without prompting for input.

```
$ ncm orgs personal

╔═════════════════════════════════════╗
║ Select your NodeSource organization ║
╚═════════════════════════════════════╝

✓ You're using ncm with the personal settings.
```

## License & Copyright

Copyright 2019 NodeSource

Licensed under the Apache License, Version 2.0, see the LICENSE file for details.
