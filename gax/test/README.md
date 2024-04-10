# Tests for gax-nodejs

## [test-application](./test-application/)
TODO: possibly link within this readme
### About
The test-application starts a [showcase-server](./showcase-server) and runs tests against the [showcase echo client library](./showcase-echo-client/). Gax is packed and the packed version is used as a dependency. Multiple clients are constructed to test how gax works with client libraries in both gRPC and REST environments.

### Maintenance
TODO

## [showcase-echo-client](./showcase-echo-client/)
### About
TODO
### Maintenance
TODO

## [showcase-server](./showcase-server/)
### About
TODO
### Maintenance
TODO

## [system-test](./system-test/)
Runs the tests for two client libraries that utilize various capabilities of gax with the version of gax found in the repo. 

## [unit](./unit/)
Mocha unit tests

## [fixtures](./fixtures)
### About
TODO


## [browser-test](./browser-test/)
### About
End-to-end karma tests that run against the [showcase-server](./showcase-server/)
### Maintenance
The [showcase-server](./showcase-server/) should periodically be updated to the newest version of gapic-showcase. See 
