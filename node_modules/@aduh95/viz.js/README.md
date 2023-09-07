# Viz.js

[![CI](https://github.com/aduh95/viz.js/workflows/CI/badge.svg)](https://github.com/aduh95/viz.js/actions)
[![NPM version](https://img.shields.io/npm/v/@aduh95/viz.js.svg)](https://www.npmjs.org/package/@aduh95/viz.js)
[![License MIT](https://img.shields.io/npm/l/@aduh95/viz.js.svg)](https://github.com/aduh95/viz.js/blob/master/LICENCE)

This project builds [Graphviz](http://www.graphviz.org) with
[Emscripten](http://kripken.github.io/emscripten-site/) and provides a simple
wrapper for using it in the browser.

## See Also

Have a look at [Dagre](https://dagrejs.github.io/), which is not a hack.

## Usage

### Getting Viz.js

- Install the
  [`@aduh95/viz.js` package](https://www.npmjs.com/package/@aduh95/viz.js) from
  the npm registry.
- Download from the [releases page](https://github.com/aduh95/viz.js/releases).

### Node.js

**N.B.**: This library has been fully tested with Node.js 12 LTS and Node.js
13.2+. If you need support for older versions of Node.js (E.G.: 10.x), you
should restrict the use of `viz.js` to the [synchronous API](#synchronous-api)
only.

```js
import Viz from "@aduh95/viz.js";
import getWorker from "@aduh95/viz.js/worker";

const worker = getWorker();
const viz = new Viz({ worker });

viz
  .renderString("digraph{1 -> 2 }")
  .then((svgString) => {
    console.log(svgString);
  })
  .catch((error) => {
    console.error(error);
  })
  .finally(
    () =>
      // You can either terminate explicitly:
      viz.terminateWorker()
    // or let it be auto-closed at the end of the process
  );
```

If you want to use it from a CommonJS script, you can use the
`@aduh95/viz.js/async` wrapper shortcut:

```js
const dot2svg = require("@aduh95/viz.js/async");

dot2svg("digraph{1 -> 2 }")
  .then((svgString) => {
    console.log(svgString);
  })
  .catch((error) => {
    console.error(error);
  });
```

> Note: If you want to your lib to be web-ready, it is recommended to build up
> from the first code example rather than the CommonJS one.

#### Synchronous API

There is a synchronous version of `renderString` method available:

```js
const vizRenderStringSync = require("@aduh95/viz.js/sync");

console.log(vizRenderStringSync("digraph{1 -> 2 }"));
```

Key differences with async API:

- It compiles Graphviz to JavaScript instead of `WebAssembly`, this should come
  with a performance hit and a bigger bundled file size (brotli size is 27%
  bigger).
- It is a CommonJS module, while the rest of the API is written as standard
  ECMAScript modules. The upside is this syntax is supported on a wider Node.js
  version array.

> Note: Using the sync API on the browser main thread is not recommended, it
> might degrade the overall user experience of the web page. It is strongly
> recommended to use web workers – with the sync or the async API.

### Browsers

#### Using a bundler

You can either use the `worker` or the `workerURL` on the constructor. Note that
when using `workerURL`, `Viz` constructor will try to spawn a webworker using
`type=module`. If you don't want a module worker, you should provide a `worker`
instead.

The Worker module exports a function that takes
[an Emscripten Module object](https://emscripten.org/docs/api_reference/module.html#affecting-execution).
You can use that to tweak the defaults, the only requirement is to define a
`locateFile` method that returns the URL of the WASM file.

```js
// worker.js
import initWASM from "@aduh95/viz.js/worker";
// If you are not using a bundler that supports package.json#exports
// use "./node_modules/@aduh95/viz.js/dist/render.browser.js" instead.

// You need to configure your bundler to treat `.wasm` file as file to return a URL.
import wasmURL from "@aduh95/viz.js/wasm";
// With Rollup, use the `@rollup/plugin-url` plugin and add `**/*.wasm` to the
// `include` list in the plugin config.
// With Webpack, use the `file-loader` plugin: "file-loader!@aduh95/viz.js/wasm"

// If you are not using a bundler that supports package.json#exports
// or doesn't have a file-loader plugin to get URL of the asset:
// const wasmURL =
//   new URL("./node_modules/@aduh95/viz.js/dist/render.wasm", import.meta.url);

initWASM({
  locateFile() {
    return wasmURL;
  },
});
```

And give feed that module to the main thread:

```js
//main.js
import Viz from "@aduh95/viz.js";
// If you are not using a bundler that supports package.json#exports:
// import Viz from "./node_modules/@aduh95/viz.js/dist/index.mjs";

// If you are using Rollup, use `@surma/rollup-plugin-off-main-thread` plugin.
// If you are using Webpack, use the `worker-loader` plugin and add this import:
// import VizWorker from "worker-loader!./worker.js";

let viz;
async function dot2svg(dot, options) {
  if (viz === undefined) {
    // No-bundler / auto-bundling version:
    viz = new Viz({
      worker: new Worker(new URL("./worker.js", import.meta.url), {
        type: "module",
      }),
    });
    // or if you are using Webpack:
    // viz = new Viz({ worker: new VizWorker() });
  }
  return viz.renderString(dot, options);
}
```

#### Using a CDN

If you are using a CDN and don't want a separate file for the worker module,
there is a workaround:

```js
import Viz from "https://unpkg.com/@aduh95/viz.js";

const locateFile = (fileName) =>
  "https://unpkg.com/@aduh95/viz.js/dist/" + fileName;
const onmessage = async function (event) {
  if (this.messageHandler === undefined) {
    // Lazy loading actual handler
    const { default: init, onmessage } = await import(
      Module.locateFile("render.browser.js")
    );
    // Removing default MessageEvent handler
    removeEventListener("message", onmessage);
    await init(Module);
    this.messageHandler = onmessage;
  }
  return this.messageHandler(event);
};
const vizOptions = {
  workerURL: URL.createObjectURL(
    new Blob(
      [
        "const Module = { locateFile:",
        locateFile.toString(),
        "};",
        "onmessage=",
        onmessage.toString(),
      ],
      { type: "application/javascript" }
    )
  ),
};

async function dot2svg(dot, options) {
  const viz = new Viz(vizOptions);

  return viz.renderString(dot, options);
}
```

If you want to support browsers that do not support loading webworker as module,
or want a custom message handling, you can use dynamic imports to help you:

```js
// worker.js
/**
 * Lazy-loads Viz.js message handler
 * @returns {(event: MessageEvent) => Promise<any>}
 */
function getVizMessageHandler() {
  if (this._messageHandler === undefined) {
    const vizDistFolder = "https://unpkg.com/@aduh95/viz.js/dist";
    const Module = {
      // locateFile is used by render module to locate WASM file.
      locateFile: (fileName) => `${vizDistFolder}/${fileName}`,
    };
    this._messageHandler = import(Module.locateFile("render.browser.js")).then(
      ({ default: init, onmessage }) => {
        // to avoid conflicts, disable viz.js message handler
        self.removeEventListener("message", onmessage);

        return init(Module).then(() => onmessage);
      }
    );
  }
  return this._messageHandler;
}

self.addEventListener("message", (event) => {
  if (event.data.id) {
    // handling event sent by viz.js
    getVizMessageHandler()
      .then((onmessage) => onmessage(event))
      .catch((error) => {
        // handle dynamic import error here
        console.error(error);

        // Note: If an error is emitted by Viz.js internals (dot syntax error,
        // WASM file initialization error, etc.), the error is catch and sent
        // directly through postMessage.
        // If you think this behavior is not ideal, please open an issue.
      });
  } else {
    // handle other messages
  }
});
```

### Deno

_The support is experimental. You would probably need to monkey-patch the
unimplemented web APIs. Please check the test folder for an example of
implementation._

As Deno aims to expose all the web API, you can use the browser implementation.

## Building From Source

To build from source, first
[install the Emscripten SDK](https://emscripten.org/docs/getting_started/index.html).
You'll also need [Node.js 13+](https://nodejs.org/) and
[Deno](https://deno.land/) to run the tests.

Using Homebrew (macOS or GNU/Linux):

```shell
brew install automake bison libtool node pkg-config
```

> Note: Emscripten version number is pinned in the Makefile. If you are willing
> to use a different version, you'd need to change the Makefile variable to
> match the version you are using.

You will certainly need to tweak config files to make sure your system knows
where it should find each binary.

The build process for Viz.js is split into two parts: building the Graphviz and
Expat dependencies, and building the rendering script files and API.

    make deps
    make all -j4
    make test
