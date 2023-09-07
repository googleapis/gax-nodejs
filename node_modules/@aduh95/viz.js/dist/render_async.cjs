/**
 * Viz.js 3.4.0 (Graphviz 2.47.0, Expat 2.2.10, Emscripten 2.0.15)
 * @license magnet:?xt=urn:btih:d3d9a9a6595521f9666a5e94cc830dab83b65699&dn=expat.txt MIT licensed
 *
 * This distribution contains other software in object code form:
 * - [Emscripten](https://github.com/emscripten-core/emscripten/blob/master/LICENSE)
 * - [Expat](https://github.com/libexpat/libexpat/blob/master/expat/COPYING)
 * - [Graphviz](https://graphviz.org/license/)
 */
let r;module.exports=async function e(t,i){if(r==null){const[e,t]=await Promise.all([import("@aduh95/viz.js"),import("@aduh95/viz.js/worker")]);r=new e.default({worker:t.default()})}return r.renderString(t,i)};
