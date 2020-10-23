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

import {Descriptor} from '../descriptor';
import {CallSettings} from '../gax';
import {NormalApiCaller} from '../normalCalls/normalApiCaller';

import {BundleApiCaller} from './bundleApiCaller';
import {BundleExecutor} from './bundleExecutor';

/**
 * Capitalizes the first character of the given string.
 */
function capitalize(str: string) {
  if (str.length === 0) {
    return str;
  }
  return str[0].toUpperCase() + str.slice(1);
}

/**
 * Converts a given string from snake_case (normally used in proto definitions) to
 * camelCase (used by protobuf.js)
 */
function toCamelCase(str: string) {
  // split on spaces, non-alphanumeric, or capital letters
  const splitted = str
    .split(/(?=[A-Z])|[\s\W_]+/)
    .filter(w => w.length > 0)
    .map(word => word.toLowerCase());
  if (splitted.length === 0) {
    return str;
  }
  return [splitted[0], ...splitted.slice(1).map(capitalize)].join('');
}

/**
 * A descriptor for calls that can be bundled into one call.
 */
export class BundleDescriptor implements Descriptor {
  bundledField: string;
  requestDiscriminatorFields: string[];
  subresponseField: string | null;
  byteLengthFunction: Function;

  /**
   * Describes the structure of bundled call.
   *
   * requestDiscriminatorFields may include '.' as a separator, which is used to
   * indicate object traversal. This allows fields in nested objects to be used
   * to determine what request to bundle.
   *
   * @property {String} bundledField
   * @property {String} requestDiscriminatorFields
   * @property {String} subresponseField
   * @property {Function} byteLengthFunction
   *
   * @param {String} bundledField - the repeated field in the request message
   *   that will have its elements aggregated by bundling.
   * @param {String} requestDiscriminatorFields - a list of fields in the
   *   target request message class that are used to detemrine which request
   *   messages should be bundled together.
   * @param {String} subresponseField - an optional field, when present it
   *   indicates the field in the response message that should be used to
   *   demultiplex the response into multiple response messages.
   * @param {Function} byteLengthFunction - a function to obtain the byte
   *   length to be consumed for the bundled field messages. Because Node.JS
   *   protobuf.js/gRPC uses builtin Objects for the user-visible data and
   *   internally they are encoded/decoded in protobuf manner, this function
   *   is actually necessary to calculate the byte length.
   * @constructor
   */
  constructor(
    bundledField: string,
    requestDiscriminatorFields: string[],
    subresponseField: string | null,
    byteLengthFunction: Function
  ) {
    if (!byteLengthFunction && typeof subresponseField === 'function') {
      byteLengthFunction = subresponseField;
      subresponseField = null;
    }
    this.bundledField = bundledField;
    this.requestDiscriminatorFields = requestDiscriminatorFields.map(
      toCamelCase
    );
    this.subresponseField = subresponseField;
    this.byteLengthFunction = byteLengthFunction;
  }

  getApiCaller(settings: CallSettings) {
    if (settings.isBundling === false) {
      return new NormalApiCaller();
    }
    return new BundleApiCaller(
      new BundleExecutor(settings.bundleOptions!, this)
    );
  }
}
