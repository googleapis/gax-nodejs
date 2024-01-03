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

/**
 * Provides behavior that supports request bundling.
 */

import {RequestType} from '../apitypes';

/**
 * Compute the identifier of the `obj`. The objects of the same ID
 * will be bundled together.
 *
 * @param {RequestType} obj - The request object.
 * @param {String[]} discriminatorFields - The array of field names.
 *   A field name may include '.' as a separator, which is used to
 *   indicate object traversal.
 * @return {String|undefined} - the identifier string, or undefined if any
 *   discriminator fields do not exist.
 */
export function computeBundleId(
  obj: RequestType,
  discriminatorFields: string[]
) {
  const ids: unknown[] = [];
  let hasIds = false;
  for (const field of discriminatorFields) {
    const id = at(obj, field);
    if (id === undefined) {
      ids.push(null);
    } else {
      hasIds = true;
      ids.push(id);
    }
  }
  if (!hasIds) {
    return undefined;
  }
  return JSON.stringify(ids);
}

/**
 * Given an object field path that may contain dots, dig into the obj and find
 * the value at the given path.
 * @example
 * const obj = {
 *   a: {
 *     b: 5
 *   }
 * }
 * const id = at(obj, 'a.b');
 * // id = 5
 * @param field Path to the property with `.` notation
 * @param obj The object to traverse
 * @returns the value at the given path
 */
function at(obj: {}, field: string) {
  const pathParts = field.split('.');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let currentObj: any = obj;
  for (const pathPart of pathParts) {
    currentObj = currentObj?.[pathPart];
  }
  return currentObj;
}
