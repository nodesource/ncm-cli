1.3.4 / 2019-07-30
==================

* Added automatic retry for http request timeouts.
* Fixed handling of local dependency checking errors during `details`.
* Fixed and improved line-wrapping for `details` output.

1.3.3 / 2019-06-27
==================

* Better Windows support for `install`.
* Fixed handling of npm errors during `install`.
* Fixed organization selection for orgs which are expired trials.

1.3.2 / 2019-05-26
==================

* Better handling of malformed ncm api data.

1.3.1 / 2019-05-16
==================

* Ensured `analyze()` error messages are always printed in `report`.
* Support for `DEBUG=ncm` error debugging.

1.3.0 / 2019-05-09
==================

* Added support for `http{s}_proxy` env vars for all network requests.
* Fixed version display in `details` when checking the `latest` version.

1.2.0 / 2019-04-24
==================

* Added `install` command, which runs `details`, and then runs `npm install` on a confirmation.
* Added descriptive text to `<command> --help` output.
* Added `help <command>` as an alias to `<command> --help`.
* Fixed `NCM_TOKEN` functionality when making whitelist api requests.
* Fixed `details` parsing `@scope/module@version` input.
* Reworked Readme documentation.

1.1.0 / 2019-03-26
==================

* Added dependency path visualization to `details`
* Documented `-d`/`--dir` option

1.0.3 / 2019-03-22
==================

* Fixed risk meters in `whitelist --list`
* Made sign-in password prompt hide input correctly

1.0.2 / 2019-03-14
==================

* deps: universal-module-tree @ ^3.0.2
  - Fixed issues for some projects

1.0.1 / 2019-03-12
==================

* Added missing package metadata
* Fixed email sign-in
* Fixed adding scoped packages to a whitelist
* Fixed some multi-line wrapping

1.0.0 / 2019-03-12
==================

* Initial release!
