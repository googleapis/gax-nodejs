node-self
=========

require() relative to the path inside your module.

### Installation

```bash
npm install --save inside
```

### Usage:

```js
var User = require('inside')('lib/models/user');
```

### How does it work?

The first time node-self is called, it detects which file is calling it. It then traverses up the directory tree to find the first `package.json`. Then all calls to `node-self` will simply call `require()` relative to that directory.
