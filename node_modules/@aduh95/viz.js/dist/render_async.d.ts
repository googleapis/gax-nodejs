import type { RenderOptions } from "./types";
/**
 * Renders a DOT graph to the specified format.
 * @param src DOT representation of the graph to render.
 * @param options Options for the rendering engine.
 * @returns Raw output of Graphviz as a string.
 */
export default function renderStringAsync(src: string, options?: RenderOptions): Promise<string>;
