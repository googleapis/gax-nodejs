# Changelog

[npm history][1]

[1]: https://www.npmjs.com/package/gax-nodejs?activeTab=versions

## v0.25.6

03-28-2019 21:27 PDT

### Fixes
- fix(deps): update dependency semver to v6
- fix: bundling is optional in MethodConfig ([#459](https://github.com/googleapis/gax-nodejs/pull/459))
- fix(ts): drop dependency on @types/duplexify ([#458](https://github.com/googleapis/gax-nodejs/pull/458))

### Internal / Testing Changes
- chore: publish to npm using wombat ([#453](https://github.com/googleapis/gax-nodejs/pull/453))
- build: use per-repo publish token ([#449](https://github.com/googleapis/gax-nodejs/pull/449))

## v0.25.5

03-15-2019 14:01 PDT

### Implementation Changes

- fix: includes @types/duplexify in package ([#441](https://github.com/googleapis/gax-nodejs/pull/441))

### Dependencies

- fix(deps): update dependency google-proto-files to ^0.19.0
- chore(deps): update dependency @types/source-map-support to ^0.5.0 ([#442](https://github.com/googleapis/gax-nodejs/pull/442))

### Internal / Testing Changes

- build: Add docuploader credentials to node publish jobs ([#444](https://github.com/googleapis/gax-nodejs/pull/444))
- build: use node10 to run samples-test, system-test etc ([#443](https://github.com/googleapis/gax-nodejs/pull/443))
- build: update kokoro config ([#440](https://github.com/googleapis/gax-nodejs/pull/440))
- test: longer timeout for Pub/Sub system tests ([#451](https://github.com/googleapis/gax-nodejs/pull/451))

## v0.25.4

02-28-2019 17:51 PST

### Implementation Changes

- fix: do not hang in LRO forever if API returned nothing ([#436](https://github.com/googleapis/gax-nodejs/pull/436))

## v0.25.3

02-26-2019 12:08 PST

### Implementation Changes

- fix: monitoring could be a common proto ([#434](https://github.com/googleapis/gax-nodejs/pull/434))
- refactor: cleanup unused files ([#422](https://github.com/googleapis/gax-nodejs/pull/422))
- chore(typescript): export common API call types ([#433](https://github.com/googleapis/gax-nodejs/pull/433))

### Dependencies

- chore(deps): update dependency mocha to v6 ([#430](https://github.com/googleapis/gax-nodejs/pull/430))

### Documentation

- docs: update links in contrib guide ([#429](https://github.com/googleapis/gax-nodejs/pull/429))

### Internal / Testing Changes

- build: use linkinator for docs test ([#428](https://github.com/googleapis/gax-nodejs/pull/428))

## v0.25.2

02-12-2019 01:16 PST

- fix: do not fail if bundledField is missing ([#424](https://github.com/googleapis/gax-nodejs/pull/424))
- fix: do not use console.warn or console.error ([#426](https://github.com/googleapis/gax-nodejs/pull/426))

### Implementation Changes

- refactor: snake case savagery is for pythonistas 🙅‍♂️🐍 ([#421](https://github.com/googleapis/gax-nodejs/pull/421))
- refactor: clean up operations client ([#420](https://github.com/googleapis/gax-nodejs/pull/420))

### Internal / Testing Changes

- test: do not use grpc-js in regular system test ([#425](https://github.com/googleapis/gax-nodejs/pull/425))
- build: create docs test npm scripts ([#423](https://github.com/googleapis/gax-nodejs/pull/423))

## v0.25.1

02-08-2019 18:01 PST

This is a patch release that fixes the code working with `grpc-js` ([#400](https://github.com/googleapis/gax-nodejs/pull/400)).
It's not supposed to be used in production (yet), so it's hidden behind a secret environment variable.
We'll let you know when it's ready to use!

### Dependencies

- fix(deps): update dependency walkdir to v0.3.2 ([#413](https://github.com/googleapis/gax-nodejs/pull/413))
- fix(deps): update dependency walkdir to v0.2.0 ([#410](https://github.com/googleapis/gax-nodejs/pull/410))
- fix(deps): update dependency walkdir to v0.1.0 ([#407](https://github.com/googleapis/gax-nodejs/pull/407))

### Documentation

- docs: update contributing guide ([#414](https://github.com/googleapis/gax-nodejs/pull/414))
- docs: add lint/fix example to contributing guide ([#409](https://github.com/googleapis/gax-nodejs/pull/409))
- docs: fix type for retryCodes ([#404](https://github.com/googleapis/gax-nodejs/pull/404))

### Internal / Testing Changes

- build: test using @grpc/grpc-js in CI ([#418](https://github.com/googleapis/gax-nodejs/pull/418))
- chore: don't run system tests with grpc-js ([#417](https://github.com/googleapis/gax-nodejs/pull/417))
- test: enable testing of grpc-js ([#400](https://github.com/googleapis/gax-nodejs/pull/400))

## v0.25.0

01-28-2019 23:31 PST

### New Features

- Add grpc-gcp support in gax ([#396](https://github.com/googleapis/gax-nodejs/pull/396))

### Dependencies

- chore(deps): update dependency eslint-config-prettier to v4 ([#399](https://github.com/googleapis/gax-nodejs/pull/399))

## v0.24.0

01-24-2019 08:49 PST

### Dependencies
- fix(deps): update dependency @grpc/proto-loader to ^0.4.0 ([#395](https://github.com/googleapis/gax-nodejs/pull/395))
- fix(deps): update dependency google-auth-library to v3 ([#394](https://github.com/googleapis/gax-nodejs/pull/394))

## v0.23.0

01-11-2019 13:32 PST


### Implementation Changes
- fix: include status code on errors ([#390](https://github.com/googleapis/gax-nodejs/pull/390))
- fix: Change to "greater than" for limit on number of elements ([#386](https://github.com/googleapis/gax-nodejs/pull/386))
- fix(ts): export CallSettings and RetryOptions ([#360](https://github.com/googleapis/gax-nodejs/pull/360))

### Dependencies
- chore(deps): update dependency @types/sinon to v7 ([#385](https://github.com/googleapis/gax-nodejs/pull/385))
- chore(deps): update dependency typescript to ~3.2.0 ([#364](https://github.com/googleapis/gax-nodejs/pull/364))
- chore(deps): update dependency gts to ^0.9.0 ([#355](https://github.com/googleapis/gax-nodejs/pull/355))

### Documentation
- build: check broken links in generated docs ([#387](https://github.com/googleapis/gax-nodejs/pull/387))

### Internal / Testing Changes
- chore(build): inject yoshi automation key ([#384](https://github.com/googleapis/gax-nodejs/pull/384))
- chore: update nyc and eslint configs ([#383](https://github.com/googleapis/gax-nodejs/pull/383))
- chore: npm-install-retry is not a thing anymore ([#381](https://github.com/googleapis/gax-nodejs/pull/381))
- chore: fix publish.sh permission +x ([#380](https://github.com/googleapis/gax-nodejs/pull/380))
- fix(build): fix Kokoro release script ([#379](https://github.com/googleapis/gax-nodejs/pull/379))
- build: add Kokoro configs for autorelease ([#378](https://github.com/googleapis/gax-nodejs/pull/378))
- chore: always nyc report before calling codecov ([#375](https://github.com/googleapis/gax-nodejs/pull/375))
- chore: nyc ignore build/test by default ([#374](https://github.com/googleapis/gax-nodejs/pull/374))
- chore: update synth metadata ([#372](https://github.com/googleapis/gax-nodejs/pull/372))
- chore: fix openssl decrypt ([#367](https://github.com/googleapis/gax-nodejs/pull/367))
- test: enable pub/sub system tests ([#366](https://github.com/googleapis/gax-nodejs/pull/366))
- chore: don't say operations_client.ts is autogen'd ([#361](https://github.com/googleapis/gax-nodejs/pull/361))
- test: don't run Pub/Sub system tests ([#362](https://github.com/googleapis/gax-nodejs/pull/362))
- chore: include format and lint tools for samples ([#359](https://github.com/googleapis/gax-nodejs/pull/359))
- chore: add a synth.metadata

## v0.22.1

11-12-2018 16:56 PST


### Dependencies
- Update grpc dependency ([#353](https://github.com/googleapis/gax-nodejs/pull/353))

### Internal / Testing Changes
- Update eslintignore config ([#352](https://github.com/googleapis/gax-nodejs/pull/352))

## v0.22.0

11-12-2018 15:05 PST

### New Features
- feat: to support GRPC-GCP Extension, include additional options in grpcOptions ([#328](https://github.com/googleapis/gax-nodejs/pull/328))

## v0.21.0

### 11-10-2018 11:27 PST
This is a minor service release that largely contains updates to other modules.  The upgrade to `google-proto-files` and `walkdir` in particular should improve load time of the module by at least ~100ms.

### Dependencies
- fix(deps): update dependency google-proto-files to ^0.18.0 ([#348](https://github.com/googleapis/gax-nodejs/pull/348))
- fix: use `walkdir` instead of `globby` ([#346](https://github.com/googleapis/gax-nodejs/pull/346))
- chore(deps): update dependency through2 to v3 ([#343](https://github.com/googleapis/gax-nodejs/pull/343))
- chore: update grpc to ^1.15.1 ([#316](https://github.com/googleapis/gax-nodejs/pull/316))
- fix(deps): update dependency @grpc/grpc-js to ^0.3.0 ([#308](https://github.com/googleapis/gax-nodejs/pull/308))

### Internal / Testing Changes
- fix: improve types, remove dead code ([#340](https://github.com/googleapis/gax-nodejs/pull/340))
- refactor: enable noImplicitThis in the tsconfig ([#347](https://github.com/googleapis/gax-nodejs/pull/347))
- refactor: drop extend and lodash.flatten ([#345](https://github.com/googleapis/gax-nodejs/pull/345))
- chore: remove temporary folder ([#339](https://github.com/googleapis/gax-nodejs/pull/339))
- chore: use latest npm on Windows ([#344](https://github.com/googleapis/gax-nodejs/pull/344))
- refactor: clean up lodash and use strict ([#342](https://github.com/googleapis/gax-nodejs/pull/342))
- chore: include build in eslintignore ([#337](https://github.com/googleapis/gax-nodejs/pull/337))
- chore: system tests for gax ([#334](https://github.com/googleapis/gax-nodejs/pull/334))
- chore: update issue templates ([#333](https://github.com/googleapis/gax-nodejs/pull/333))
- Update issue templates
- chore: remove old issue template ([#329](https://github.com/googleapis/gax-nodejs/pull/329))
- build: run tests on node11 ([#327](https://github.com/googleapis/gax-nodejs/pull/327))
- fix: better types for GAPIC clients ([#326](https://github.com/googleapis/gax-nodejs/pull/326))
- chores(build): do not collect sponge.xml from windows builds ([#325](https://github.com/googleapis/gax-nodejs/pull/325))
- chores(build): run codecov on continuous builds ([#324](https://github.com/googleapis/gax-nodejs/pull/324))
- chore: update new issue template ([#323](https://github.com/googleapis/gax-nodejs/pull/323))
- build: fix codecov uploading on Kokoro ([#320](https://github.com/googleapis/gax-nodejs/pull/320))
- fix(deps): update dependency google-proto-files to ^0.17.0 ([#317](https://github.com/googleapis/gax-nodejs/pull/317))
- chore(deps): update dependency sinon to v7 ([#319](https://github.com/googleapis/gax-nodejs/pull/319))
- Update kokoro config ([#315](https://github.com/googleapis/gax-nodejs/pull/315))
- chore(deps): update dependency typescript to ~3.1.0 ([#313](https://github.com/googleapis/gax-nodejs/pull/313))
- Update CI config ([#312](https://github.com/googleapis/gax-nodejs/pull/312))
- build: prevent system/sample-test from leaking credentials
- Update the kokoro config ([#309](https://github.com/googleapis/gax-nodejs/pull/309))
- test: remove appveyor config ([#307](https://github.com/googleapis/gax-nodejs/pull/307))
- Update CI config ([#306](https://github.com/googleapis/gax-nodejs/pull/306))
- Enable prefer-const in the eslint config ([#304](https://github.com/googleapis/gax-nodejs/pull/304))
- Enable no-var in eslint ([#303](https://github.com/googleapis/gax-nodejs/pull/303))

## v0.18.0

### Implementation Changes
BREAKING CHANGE:
- fix: drop support for node.js 4.x and 9.x (#262)

### New Features

### Dependencies
- refactor: add dependency on @grpc/proto-loader (#229)
- chore(deps): update dependency typescript to v3 (#275)
- fix(deps): update dependency @grpc/proto-loader to ^0.3.0 (#269)
- chore(deps): update dependency gts to ^0.8.0 (#266)
- chore(package): Update gts to the latest version 🚀 (#255)
- chore(package): update @types/globby to version 8.0.0 (#257)

### Documentation
- Add Code of Conduct

### Internal / Testing Changes
- chore: move mocha options to mocha.opts (#274)
- test: fixing timeouts (#264)
- Configure Renovate (#258)
- fix: fix typo in a test (#260)
- fix: update linking for samples (#259)
- refactor: remove prettier, eslint, jshint (#254)

