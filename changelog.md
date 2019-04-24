1.2.0 / 2018-04-24
==================

* Added `install` command, which runs `details`, and then runs `npm install` on a confirmation.
* Added descriptive text to `<command> --help` output.
* Added `help <command>` as an alias to `<command> --help`.
* Fixed `NCM_TOKEN` functionality when making whitelist api requests.
* Fixed `details` parsing `@scope/module@version` input.
* Reworked Readme documentation.

1.1.0 / 2018-03-26
==================

* Added dependency path visualization to `details`
* Documented `-d`/`--dir` option

1.0.3 / 2018-03-22
==================

* Fixed risk meters in `whitelist --list`
* Made sign-in password prompt hide input correctly

1.0.2 / 2018-03-14
==================

* deps: universal-module-tree @ ^3.0.2
  - Fixed issues for some projects

1.0.1 / 2018-03-12
==================

* Added missing package metadata
* Fixed email sign-in
* Fixed adding scoped packages to a whitelist
* Fixed some multi-line wrapping

1.0.0 / 2018-03-12
==================

* Initial release!
