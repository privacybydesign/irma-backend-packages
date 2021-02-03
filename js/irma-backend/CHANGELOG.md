# Changelog
All notable changes to this package will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.4] - 2021-02-03
### Fixed
- The `getSessionResultJwt` and `getServerPublicKey` methods wrongly interpreted the
  received response from the IRMA server as JSON.
- In certain environments, the `Content-Length` header cannot be accessed in the HTTP response.
  The code assumed that this header is always available. We added a work-around for this.

## [0.1.3] - 2020-12-08
### Fixed
- The `serverToken` option was not working properly for all methods. When being set,
  it triggered errors.

## [0.1.2] - 2020-10-12
### Fixed
- Security patch for `node-fetch` dependency.

## [0.1.1] - 2020-04-01
### Fixed
- Moved the documentation to the right README.

## [0.1.0] - 2020-03-31
### Added
- Initial release

[0.1.4]: https://github.com/privacybydesign/irma-backend-packages/compare/94960ff...c8eb089
[0.1.3]: https://github.com/privacybydesign/irma-backend-packages/compare/00a8e5b...94960ff
[0.1.2]: https://github.com/privacybydesign/irma-backend-packages/compare/128f8ef...00a8e5b
[0.1.1]: https://github.com/privacybydesign/irma-backend-packages/compare/afcc594...128f8ef
[0.1.0]: https://github.com/privacybydesign/irma-backend-packages/tree/afcc59477738d3cde1381f6556c042afa74fbf54/js/irma-backend