/// <reference types="node" />
import type { Worker as NodeJSWorker } from "worker_threads";
import type { RenderOptions, GraphvizJSONOutput } from "./types";
declare type VizConstructorOptionsWorkerURL = {
    workerURL: string | URL;
};
declare type VizConstructorOptionsWorker = {
    worker: Worker | NodeJSWorker;
};
export declare type VizConstructorOptions = VizConstructorOptionsWorkerURL | VizConstructorOptionsWorker;
/**
 * The Viz class provides an interface between the rendering worker(s) and the
 * "main" thread.
 */
declare class Viz {
    private _wrapper;
    /**
     * Constructs a new Viz instance.
     *
     * If the `workerURL` option is given, its value must be the URL of one of the
     * rendering script files included in the distribution (E.G.:
     * `render.browser.js`).
     * If the worker option is given, its value must be a `Worker` object
     * constructed with the URL or path of one of the rendering script files
     * included in the distribution (E.G.: `render.node.js`).
     *
     * @param options An object containing option properties on the worker to use.
     * @throws {Error} if no options are given.
     */
    constructor(options: VizConstructorOptions);
    /**
     * Renders a DOT graph to the specified format.
     * @param src DOT representation of the graph to render.
     * @param options Options for the rendering engine.
     * @returns Raw output of Graphviz as a string.
     */
    renderString(src: string, { format, engine, files, images, yInvert, nop, }?: RenderOptions): Promise<string>;
    /**
     * Renders the graph as a JSON object.
     * @param src DOT representation of the graph to render
     * @param options Options for the rendering engine. `format` is ignored,
     *                unless it is json or json0.
     * @returns Parsed JSON object from Graphviz.
     * @see https://graphviz.gitlab.io/_pages/doc/info/output.html#d:json
     */
    renderJSONObject(src: string, options?: RenderOptions): Promise<GraphvizJSONOutput>;
    /**
     * Terminates the worker, clearing all on-going work.
     */
    terminateWorker(): Promise<number> | void;
}
export default Viz;
export type { RenderOptions, GraphvizJSONOutput };
