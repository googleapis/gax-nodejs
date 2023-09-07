# http-auth-connect
[Connect](https://github.com/senchalabs/connect) integration with [http-auth](https://github.com/gevorg/http-auth) module.

[![build](https://github.com/http-auth/http-auth-connect/workflows/build/badge.svg)](https://github.com/http-auth/http-auth-connect/actions/workflows/build.yml)

## Installation

Via git (or downloaded tarball):

```bash
$ git clone git://github.com/http-auth/http-auth-connect.git
```
Via [npm](http://npmjs.org/):

```bash
$ npm install http-auth-connect
```    

## Usage
```javascript
// Express module.
// eslint-disable-next-line node/no-unpublished-require
const express = require("express");

// Authentication module.
// eslint-disable-next-line node/no-unpublished-require
const auth = require("http-auth");
// eslint-disable-next-line node/no-unpublished-require
const authConnect = require("http-auth-connect");

const basic = auth.basic({
  realm: "Simon Area.",
  file: __dirname + "/../data/users.htpasswd" // gevorg:gpass, Sarah:testpass
});

// Application setup.
const app = express();
app.use(authConnect(basic));

// Setup route.
app.get("/", (req, res) => {
  res.send(`Hello from express - ${req.user}!`);
});

// Start server.
app.listen(1337, () => {
  // Log URL.
  console.log("Server running at http://127.0.0.1:1337/");
});
```


## Running tests

It uses [mocha](https://mochajs.org/), so just run following command in package directory:

```bash
$ npm test
```

## License

The MIT License (MIT)