# CHANGELOG

All notable changes to this project will be documented in this file.

## [Unreleased]

## [0.4.0] - 2021-12-12

### Added

- The `SuperReactive` class now extends `EventEmitter`. You can now listen for the following events:
  - `remoteUpdate`: emitted when the remote endpoint updated a value.
  - `localValueRead`: emitted when a local `@reactive` property was read.
  - `localValueWritten`: emitted when a local `@reactive` property was written to (triggering an update on the remote endpoint).
- Added `tiny-typed-emitter` as a dependency for this package.
