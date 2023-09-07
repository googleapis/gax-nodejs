/**
 * Viz.js 3.4.0 (Graphviz 2.47.0, Expat 2.2.10, Emscripten 2.0.15)
 * @license magnet:?xt=urn:btih:d3d9a9a6595521f9666a5e94cc830dab83b65699&dn=expat.txt MIT licensed
 *
 * This distribution contains other software in object code form:
 * - [Emscripten](https://github.com/emscripten-core/emscripten/blob/master/LICENSE)
 * - [Expat](https://github.com/libexpat/libexpat/blob/master/expat/COPYING)
 * - [Graphviz](https://graphviz.org/license/)
 */
const{name:e,exports:n}=require("../package.json");const r=require("path");const a=r.join(__dirname,"..",n["."].import);function i(){if(!i.warned){i.warned=true;const n=new Error(`Requiring '${e}' package is deprecated, please use import instead.`);n.name="DeprecationWarning";process.emitWarning(n,"DeprecationWarning")}}i();module.exports=import(a).then((e=>e.default));
