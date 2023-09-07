export type SerializedError = {
  message: string;
  lineNumber?: number;
  fileName?: string;
};
export type RenderRequestListener = (
  error: SerializedError,
  result?: string
) => void;

export type RenderRequest = {
  id: number;
  src: string;
  options: RenderOptions;
};
export type RenderResponse = {
  id: number;
  error?: SerializedError;
  result?: string;
};

export type Image = {
  path: string;
  height: string | number;
  width: string | number;
};

export type File = {
  path: string;
  data: string;
};

export type RenderOptions = {
  engine?: "circo" | "dot" | "fdp" | "neato" | "osage" | "twopi";
  format?:
    | "svg"
    | "dot"
    | "xdot"
    | "plain"
    | "plain-ext"
    | "ps"
    | "ps2"
    | "json"
    | "json0";
  yInvert?: boolean;
  images?: Image[];
  files?: File[];
  nop?: number;
};

export type GraphvizJSONOutput = {
  name: string;
  directed: boolean;
  strict: boolean;
  _subgraph_cnt: number;
  objects?: GraphvizJSONOutput[];
  [key: string]: any;
};
