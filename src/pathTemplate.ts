/**
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
 * Path template utility.
 */

import has = require('lodash.has');
import * as util from 'util';
import * as extras from './parserExtras';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const parser = require('./pathTemplateParser');

export interface ParseResult {
  size: number;
  segments: Segment[];
}

export interface Segment {
  kind: number;
  literal: string;
}

export interface Bindings {
  [index: string]: string | number;
}

export class PathTemplate {
  private readonly parseResult: ParseResult;

  get size(): number {
    return this.parseResult.size;
  }

  get segments(): Segment[] {
    return this.parseResult.segments;
  }

  /**
   * @param {String} data the of the template
   *
   * @constructor
   */
  constructor(data: string) {
    this.parseResult = extras.finishParse(parser.parse(data));
  }

  /**
   * Matches a fully-qualified path template string.
   *
   * @param {String} path a fully-qualified path template string
   * @return {Object} contains const names matched to binding values
   * @throws {TypeError} if path can't be matched to this template
   */
  match(path: string): Bindings {
    const pathSegments = path.split('/');
    const bindings: Bindings = {};
    let segmentCount = this.size;
    let current: string;
    let index = 0;
    this.segments.forEach(segment => {
      if (index > pathSegments.length) {
        return;
      }
      if (segment.kind === extras.BINDING) {
        current = segment.literal;
      } else if (segment.kind === extras.TERMINAL) {
        if (segment.literal === '*') {
          bindings[current] = pathSegments[index];
          index += 1;
        } else if (segment.literal === '**') {
          const size = pathSegments.length - segmentCount + 1;
          segmentCount += size - 1;
          bindings[current] = pathSegments.slice(index, index + size).join('/');
          index += size;
        } else if (segment.literal === pathSegments[index]) {
          index += 1;
        } else {
          const msg = util.format(
            "mismatched literal (index=%d): '%s' != '%s'",
            index,
            segment.literal,
            pathSegments[index]
          );
          throw new TypeError(msg);
        }
      }
    });
    if (index !== pathSegments.length || index !== segmentCount) {
      const msg = util.format(
        'match error: could not instantiate a path template from %s',
        path
      );
      throw new TypeError(msg);
    }
    return bindings;
  }

  /**
   * Renders a path template using the provided bindings.
   *
   * @param {Object} bindings a mapping of const names to binding strings
   * @return {String} a rendered representation of the path template
   * @throws {TypeError} if a key is missing, or if a sub-template cannot be
   *   parsed
   */
  render(bindings: Bindings): string {
    const out: Segment[] = [];
    let inABinding = false;
    this.segments.forEach(segment => {
      if (segment.kind === extras.BINDING) {
        if (!has(bindings, segment.literal)) {
          const msg = util.format(
            'Value for key %s is not provided in %s',
            segment.literal,
            bindings
          );
          throw new TypeError(msg);
        }
        const tmp = new PathTemplate(bindings[segment.literal].toString());
        Array.prototype.push.apply(out, tmp.segments);
        inABinding = true;
      } else if (segment.kind === extras.END_BINDING) {
        inABinding = false;
      } else if (inABinding) {
        return;
      } else {
        out.push(segment);
      }
    });

    const result = formatSegments(out);
    this.match(result);
    return result;
  }

  /**
   * Renders the path template.
   *
   * @return {string} contains const names matched to binding values
   */
  inspect() {
    return formatSegments(this.segments);
  }
}

/**
 * Creates the string representattion for the segments.
 * @param {Object[]} segments - The array of segments.
 * @return {string} - A string representing segments in the path template
 *   format.
 */
function formatSegments(segments: Segment[]): string {
  let out = '';
  let slash = true;
  segments.forEach(segment => {
    if (segment.kind === extras.TERMINAL) {
      if (slash) {
        out += '/';
      }
      out += segment.literal;
      return;
    }
    slash = true;
    if (segment.kind === extras.BINDING) {
      out += '/{' + segment.literal + '=';
      slash = false;
    } else {
      out += segment.literal + '}';
    }
  });
  return out.substring(1);
}
