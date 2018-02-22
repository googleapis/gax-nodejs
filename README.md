Google API Extensions for Node.js
=================================

[![Build Status](https://travis-ci.org/googleapis/gax-nodejs.svg?branch=master)](https://travis-ci.org/googleapis/gax-nodejs)
[![Code Coverage](https://img.shields.io/codecov/c/github/googleapis/gax-nodejs.svg)](https://codecov.io/github/googleapis/gax-nodejs)
[![Dependencies](https://david-dm.org/googleapis/gax-nodejs.svg)](https://david-dm.org/googleapis/gax-nodejs)

Google API Extensions for Node.js (gax-nodejs) is a set of modules which aids
the development of APIs for clients and servers based on [gRPC][] and Google API
conventions.

Application code will rarely need to use most of the classes within this library
directly, but code generated automatically from the API definition files in
[Google APIs][] can use services such as page streaming and request bundling to
provide a more convenient and idiomatic API surface to callers.

[gRPC]: http://grpc.io
[Google APIs]: https://github.com/googleapis/googleapis/


Node.js Versions
----------------

gax-nodejs is currently tested with Node.js 4.2.3


Contributing
------------

Contributions to this library are always welcome and highly encouraged.

See the [CONTRIBUTING][] documentation for more information on how to get started.

[CONTRIBUTING]: https://github.com/googleapis/gax-nodejs/blob/master/CONTRIBUTING.md


Versioning
----------

This library follows [Semantic Versioning][].

It is currently in major version zero (``0.y.z``), which means that anything
may change at any time and the public API should not be considered
stable.

[Semantic Versioning]: http://semver.org/


Details
-------

For detailed documentation of the modules in gax-nodejs, please watch [DOCUMENTATION].


License
-------

BSD - See [LICENSE][] for more information.

[LICENSE]: https://github.com/googleapis/gax-nodejs/blob/master/LICENSE
[DOCUMENTATION]: http://googleapis.github.io/gax-nodejs/
