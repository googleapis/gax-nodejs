# Changelog

### @aduh95/Viz.js v3.4.0 (2021-03-16)

- Bump Graphviz version to
  [2.47.0](https://gitlab.com/graphviz/graphviz/-/blob/master/CHANGELOG.md#2470-2021-03-15).

### @aduh95/Viz.js v3.3.4 (2021-03-10)

- Bump Graphviz version to
  [2.46.1](https://gitlab.com/graphviz/graphviz/-/blob/master/CHANGELOG.md#2461-2021-02-13).
- Bump Emscripten version to
  [2.0.15](https://github.com/emscripten-core/emscripten/blob/main/ChangeLog.md#2015-03052021).

### @aduh95/Viz.js v3.3.3 (2021-02-22)

- Improve interoperability with web bundlers
  ([#19](https://github.com/aduh95/viz.js/pull/19)).

### @aduh95/Viz.js v3.3.2 (2021-02-17)

- Fix `TextDecoder is not defined` in `@aduh95/viz.js/sync` on older version of
  Node.js.

### @aduh95/Viz.js v3.3.1 (2021-02-17)

- Fix image support in `@aduh95/viz.js/sync`
  ([#16](https://github.com/aduh95/viz.js/issues/16)).
- Bump Emscripten version to
  [2.0.14](https://github.com/emscripten-core/emscripten/blob/master/ChangeLog.md#2014-02142021).

### @aduh95/Viz.js v3.3.0 (2021-01-19)

- Bump Emscripten version to
  [2.0.12](https://github.com/emscripten-core/emscripten/blob/master/ChangeLog.md#2012-01092021).
- Bump Expat version to
  [2.2.10](https://github.com/libexpat/libexpat/blob/R_2_2_10/expat/Changes).
- Bump Graphviz version to
  [2.46.0](https://gitlab.com/graphviz/graphviz/-/blob/master/CHANGELOG.md#2460-2021-01-18).

### @aduh95/Viz.js v3.2.1 (2020-11-05)

- Bump Emscripten version to
  [2.0.8](https://github.com/emscripten-core/emscripten/blob/master/ChangeLog.md#208-10242020).
- Closure compiler is now disabled when building `render_sync.js`
  ([#14](https://github.com/aduh95/viz.js/issues/14)).

### @aduh95/Viz.js v3.2.0 (2020-10-17)

- Bump Emscripten version to
  [2.0.7](https://github.com/emscripten-core/emscripten/blob/master/ChangeLog.md#207-10132020).
- Remove engine restriction to allow use of the library on Node.js v10.x
  [#11](https://github.com/aduh95/viz.js/issues/11).
- Split link step to better optimize output files.
- Enable Closure compiler to produce smaller dist files.

### @aduh95/Viz.js v3.1.0 (2020-07-31)

- Auto-init WASM in `render.browser.js`
  ([#9](https://github.com/aduh95/viz.js/pull/9))
- Bump Emscripten version to
  [1.40.0](https://github.com/emscripten-core/emscripten/blob/master/ChangeLog.md#1400-07302020).

### @aduh95/Viz.js v3.0.2 (2020-07-09)

- Update Graphviz to
  [1.44.1](https://gitlab.com/graphviz/graphviz/-/blob/master/CHANGELOG.md#2441-2020-06-29).
- Bump Emscripten version to
  [1.39.19](https://github.com/emscripten-core/emscripten/blob/master/ChangeLog.md#13919-07072020).
- Upgrade test tools (Deno, Mocha, Puppeteer).

### @aduh95/Viz.js v3.0.1 (2020-06-09)

Fix issue with Webpack v4.

### @aduh95/Viz.js v3.0.0 (2020-05-27)

##### Notable changes

- The library is now compiled to WASM, which shrinks the file size (Viz.js
  (2.1.2 full version) brotlified: 409K; @aduh95/viz.js (3.0.0-beta.7 browser
  version) brotlified: 337K; 18% decrease), should improve performances and
  allows dynamic memory growth.
- The JS code is now transpiled from TypeScript, and typings are packed within
  the npm package. You can find the API documentation there!
- The library is able to reset its internal error state, which makes the
  [v2 wiki caveat](https://github.com/mdaines/viz.js/wiki/Caveats#rendering-graphs-with-user-input)
  unnecessary.
- Rendering from main thread is no longer supported on the default async API,
  you must use a worker (webworker or worker_thread).
- There is a synchronous version available for legacy Node.js support.

##### Breaking changes and deprecations

- **BREAKING:** Bump required version of Node.js to v12.17.0+. _Older Node.js
  version may support the synchronous API._
- **BREAKING:** Remove `Viz.prototype.renderSVGElement`. You can use
  `renderString` and `DOMParser` to achieve the same result.
- **BREAKING:** Remove `Viz.prototype.renderImageElement`. You can use
  `renderString` and `Canvas` to achieve the same result.
- **BREAKING:** Remove `Module` and `render` from `Viz` constructor's options
  (you must now specify either `worker` or `workerURL`).
- **BREAKING:** Remove _lite_ version, Viz.js now comes in only one variant.
- **BREAKING:** The `full.render.js` script is replaced by the `render.node.mjs`
  and `render.browser.js` modules.
- **BREAKING:** The `render.node.js` module (that replaces `full.render.js`)
  exports a worker_thread factory when imported from the main thread. It's
  available through `@aduh95/viz.js/worker` specifier on Node.js and bundle
  tools that support `package.json`#`exports`.
- **BREAKING:** The `render.browser.js` module (that replaces `full.render.js`)
  exports a function which takes a Module object as parameter. You should use it
  to give the path to `render.wasm` the Emscripten script. You should not import
  this module from the main thread. On bundle tools that support
  `package.json`#`exports`, you can use the specifier `@aduh95/viz.js/worker`.
- **BREAKING:** Compiles to WebAssembly, which cannot be bundled in the
  `render.js` file like asm.js used to. Depending on your bundling tool, you may
  need some extra config to make everything work. You might also use the
  synchronous API, which bundles the asm.js code, although its usage should be
  strictly limited to Node.js or webworker use.
- **BREAKING:** Remove ES5 dist files, all modern browsers now support ES2015
  modules. If you want to support an older browser, you would need to transpile
  it yourself or use an older version.
- **BREAKING:** On Node.js, `require('@aduh95/viz.js')` returns now a
  `Promise<Viz>`.
- **DEPRECATED:** `require('@aduh95/viz.js')` is deprecated, use
  `import('@aduh95/viz.js')` instead.

##### Added features

- Add support for Node.js `worker_threads`.
- Refactor JS files to TypeScript.
- Refactor `viz.c` to C++ to use
  [Emscripten's Embind](https://emscripten.org/docs/porting/connecting_cpp_and_javascript/embind.html).
- Use `ALLOW_MEMORY_GROW` compiler option to avoid failing on large graphs.
- Improve error handling:
  - Rejects with the full error string from Graphviz.
  - Remove the need of creating new instances when render fails by resetting
    internal error state.
- Switch to Mocha and Puppeteer for browser testing.
- Add synchronous API using asm.js (`@aduh95/viz.js/sync`).
- Add a helper module for asynchronous API (`@aduh95/viz.js/async`).
- Upgrade deps:
  - Upgrade Emscripten to 1.39.16
  - Upgrade Graphviz to 2.44.0
  - Upgrade Expat to 2.2.9
  - Upgrade Rollup to 2.x
- Change test chain:
  - Upgrade Mocha to 7.x
  - Use Puppeteer instead of Selenium

### Viz.js v2.1.2 (2018-12-08)

- Fix redeclared variable ([#160](https://github.com/mdaines/viz.js/issues/160))

### Viz.js v2.1.2-pre.1 (2018-12-05)

- Fix redeclared variable ([#160](https://github.com/mdaines/viz.js/issues/160))

### Viz.js v2.1.1 (2018-11-16)

- Add support for -n (Nop) option
  ([#151](https://github.com/mdaines/viz.js/pull/151))
- Specify --libdir option ([#153](https://github.com/mdaines/viz.js/pull/153))
- Correctly forward errors not derived from Error
  ([#145](https://github.com/mdaines/viz.js/pull/145))

### Viz.js v2.0.0 (2018-05-14)

- Viz.js now has first-class support for Web Workers, and returns Promises for
  all rendering functions, rather than accepting callbacks for some of its
  utility functions. However, you don't have to use Web Workers: Viz.js still
  works with just script tags.
- API and rendering code have been split into separate files to make it easier
  to work with Viz.js in bundlers.
- New output types: JSON objects and SVG elements. For example, the
  renderSVGElement function returns the promise of an SVGSVGElement object,
  ready to insert into the document.
- The single Viz() function is now a class and reuses its Emscripten module
  instance, improving performance across multiple calls.
- The API code is now built with Rollup, and the release includes an ES6 module.
- Added yInvert option. (Equivalent to the -y command-line option.)
- TypeScript declarations have been removed in this release.

### Viz.js v2.0.0-pre.8 (2018-05-07)

- Use ".render.js" suffix instead of ".js.opaque".
- Accept a Worker instance for the worker option instead of a string. Add
  workerURL option for passing the URL of a worker as a string. Less specific
  detection of worker scope.

### Viz.js v1.8.2 (2018-05-04)

- Make sure the Emscripten module isn't exported when Viz.js is loaded in an AMD
  environment. ([#130](https://github.com/mdaines/viz.js/issues/130))

### Viz.js v2.0.0-pre.7 (2018-05-03)

- Remove TypeScript declarations.
- Build with Rollup.
- Include ES6 module in npm release.

### Viz.js v2.0.0-pre.6 (2018-05-02)

- Fix TypeScript declarations.

### Viz.js v2.0.0-pre.5 (2018-04-24)

- Free layout and graph when we're done with them. Reuse the Emscripten module
  instance.
- Export the Module and render functions from rendering script files.
- Use ".js.opaque" rendering script files instead of ".module".

### Viz.js v2.0.0-pre.4 (2018-04-13)

- Don't wait for onload to resolve image elements.

### Viz.js v2.0.0-pre.1 (2018-04-12)

- New 2.0 API. Viz is now a class, and has separate render functions that return
  promises. The code generated by Emscripten is now distributed as separate
  files, which can be loaded as web workers.
- Add yInvert option. ([#118](https://github.com/mdaines/viz.js/issues/118))
- Fix lite in IE.
- Update Emscripten version.

### Viz.js v1.8.1 (2018-03-07)

- Add Travis CI configuration for testing and release
- Reorganize browser tests
- Move API docs to wiki
- Update Expat to 2.2.5
- Build with Emscripten 1.37.33
- Add TypeScript declaration file and tests

### Viz.js v1.8.1-pre.5 (2018-03-07)

- Add tests for TypeScript declaration file.
- Update TypeScript declaration file.

### Viz.js v1.8.1-pre.4 (2018-02-26)

- Add Travis CI configuration for testing and release
- Reorganize browser tests
- Move API docs to wiki
- Update Expat to 2.2.5
- Add Typescript support

### Viz.js v1.8.0 (2017-05-20)

- Include viz-lite.js in NPM release.
  ([<tt>998039a</tt>](https://github.com/mdaines/viz.js/commit/998039a7c6d8e6c422703788bfd83a45a8203cd7),
  [#88](https://github.com/mdaines/viz.js/issues/88))
- Use the -Oz optimization option.
  ([<tt>0a7096f</tt>](https://github.com/mdaines/viz.js/commit/0a7096fcb37abaf5b31dac6cc7a55c82244adf07))
- Set NO_DYNAMIC_EXECUTION, which removes uses of eval.
  ([<tt>e2d9ac6</tt>](https://github.com/mdaines/viz.js/commit/e2d9ac6f73e9ab91961ece5e238d4222a90fc709),
  [#75](https://github.com/mdaines/viz.js/issues/75))
- Add version numbers for Graphviz, Expat, and Emscripten to the top of builds.
  ([<tt>83740b6</tt>](https://github.com/mdaines/viz.js/commit/83740b6b39ad50427bc62505d4489f928d2b4e67),
  [<tt>1d87fe4</tt>](https://github.com/mdaines/viz.js/commit/1d87fe40ec65ced18f43923a724acb78fa820136))
- Add "browser" property to package.json.
  ([<tt>1f12dfe</tt>](https://github.com/mdaines/viz.js/commit/1f12dfeb5fcbf1641d75459720f324c8118d1a41),
  [#83](https://github.com/mdaines/viz.js/issues/83))
- Add "files" and "images" options.
  ([<tt>4437a03</tt>](https://github.com/mdaines/viz.js/commit/4437a03c0135dd0bd13b295798d99d355d1dcaf9),
  [<tt>5e0a451</tt>](https://github.com/mdaines/viz.js/commit/5e0a451eb0955e417a6155522e8e1a149ae101e6))

### Viz.js v1.7.1 (2017-03-03)

- Ensure that non-ASCII characters are handled correctly when using the
  png-image-element format or the svgXmlToPng functions.
- Improve error reporting in svgXmlToPngImageElement.

### Viz.js v1.7.0 (2017-01-31)

- Don't allow memory growth. See
  [#74](https://github.com/mdaines/viz.js/issues/74).
- Accept the `totalMemory` option, which sets TOTAL_MEMORY when initializing the
  Module. See [#74](https://github.com/mdaines/viz.js/issues/74).

### Viz.js v1.6.0 (2017-01-26)

- Update to Graphviz 2.40.1

### Viz.js v1.5.1 (2017-01-17)

- Make sure UTF8ToString is included in EXPORTED_RUNTIME_METHODS and include a
  test for characters outside of basic ASCII. This addresses
  [#71](https://github.com/mdaines/viz.js/issues/71).
- Ensure that we return after invoking the callback with an error in
  svgXmlToPngImageElement.

### Viz.js v1.5.0 (2017-01-16)

- Introduced viz-lite.js, a smaller build that omits Expat and the NEATO layout
  plugin for a savings of about 700 KB over the regular version.
  [<tt>b8370ad</tt>](https://github.com/mdaines/viz.js/commit/b8370ad6100ad0d5343c3e8729b29ca4806673dd)
- Changed build settings to ensure that the -Os optimization setting is used for
  Graphviz and Expat as well as Viz.js. This results in a smaller build for both
  the regular and lite versions.
  [<tt>416776e</tt>](https://github.com/mdaines/viz.js/commit/416776e1cde5d9d8911029f654579a4aed3c8518)
- A new Module instance is now created for every call of the Viz JavaScript
  function. This avoids errors that could occur when freeing memory from the
  Viz.js C code and when Graphviz would encounter a syntax error. See issues
  [#65](https://github.com/mdaines/viz.js/issues/65) and
  [#59](https://github.com/mdaines/viz.js/issues/59).
  [<tt>2257a40</tt>](https://github.com/mdaines/viz.js/commit/2257a4017ed3bdc4bbf635279d9cd066091a425b)
- Memory growth is now allowed.
  [<tt>b1df4a9</tt>](https://github.com/mdaines/viz.js/commit/b1df4a9662188fb1aefb0489ae6f1c4667bec81f)
- Introduce Viz.svgXmlToPngBase64 and add a callback API for
  Viz.svgXmlToPngImageElement.
  [<tt>1b317da</tt>](https://github.com/mdaines/viz.js/commit/1b317da40c20ed5f406336d38a08613f94eb4863)

### Viz.js v1.4.1 (2016-11-21)

- Correct license in package.json.
- Expand pre.js to include more information about the software distributed as
  part of Viz.js.

### Viz.js v1.4.0 (2016-11-18)

- Added "scale" option for use with the "png-image-element" format. Previously,
  window.devicePixelRatio or 1 would be used for this value, which is still the
  default if no scale factor is specified.
- Optional support for the "png-image-element" format in IE 10 and 11. Viz.js
  will check for Fabric.js, and if present, use its SVG parser. This works
  around a CORS issue with data URIs in these browsers.
- Fixes for building with the latest emscripten SDK.
- More tests, and added support for cross-browser testing with Sauce Labs.
- Switch to MIT license.

### Viz.js v1.3.0 (2015-11-13)

- Add Viz.svgXmlToPngImageElement and "png-image-element" format.

### Viz.js v1.2.1: Fix that a previous error would cause an exception to be thrown on va… (2015-10-31)

- Fix that a previous error would cause an exception to be thrown on valid
  input.

### Viz.js v1.2.0 (2015-10-27)

- Add node export and use this.namespace-style global

### Viz.js v1.1.0 (2015-10-23)

- Fixed that line numbers for errors were reported incorrectly, and that some
  kinds of syntax errors were not reported
- Viz.js will now throw exceptions on syntax errors rather than logging to the
  console

### Viz.js Viz.js 0.0.3 (2014-04-12)

Includes recent fixes from vmarkovtsev.

### Viz.js Viz.js 0.0.2 (2014-03-04)

Add support for layout engines other than dot via a third parameter, update to
Graphviz 2.36, other fixes.

Thanks to vmarkovtsev.

### Viz.js Viz.js 0.0.1 (2013-10-26)

Rather than checking the viz.js file into the repository, it can now be found
here, released as a 'binary'.
