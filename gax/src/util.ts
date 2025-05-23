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

const PROTO_TYPE_PREFIX = 'type.googleapis.com/';
const NUM_OF_PARTS_IN_PROTO_TYPE_NAME = 2;

const randomUUID = () =>
  globalThis.crypto?.randomUUID() || require('crypto').randomUUID();

function words(str: string, normalize = false) {
  if (normalize) {
    // strings like somethingABCSomething are special case for protobuf.js,
    // they should be split as "something", "abc", "something".
    // Deal with sequences of capital letters first.
    str = str.replace(/([A-Z])([A-Z]+)([A-Z])/g, (str: string) => {
      return (
        str[0] +
        str.slice(1, str.length - 1).toLowerCase() +
        str[str.length - 1]
      );
    });
  }
  // split on spaces, non-alphanumeric, or capital letters
  // note: we keep the capitalization of the first word (special case: IPProtocol)
  return str
    .split(/(?=[A-Z])|[^A-Za-z0-9.]+/)
    .filter(w => w.length > 0)
    .map((w, index) => (index === 0 ? w : w.toLowerCase()));
}

/**
 * Converts the first character of the given string to lower case.
 */
function lowercase(str: string) {
  if (str.length === 0) {
    return str;
  }
  return str[0].toLowerCase() + str.slice(1);
}

/**
 * Converts a given string from camelCase (used by protobuf.js and in JSON)
 * to snake_case (normally used in proto definitions).
 */
export function camelToSnakeCase(str: string) {
  // Keep the first position capitalization, otherwise decapitalize with underscore.
  const wordsList = words(str);
  if (wordsList.length === 0) {
    return str;
  }
  const result = [wordsList[0]];
  result.push(...wordsList.slice(1).map(lowercase));
  return result.join('_');
}

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
 * Converts a given string from snake_case (normally used in proto definitions) or
 * PascalCase (also used in proto definitions) to camelCase (used by protobuf.js).
 * Preserves capitalization of the first character.
 */
export function toCamelCase(str: string) {
  const wordsList = words(str, /*normalize:*/ true);
  if (wordsList.length === 0) {
    return str;
  }
  const result = [wordsList[0]];
  result.push(
    ...wordsList.slice(1).map(w => {
      if (w.match(/^\d+$/)) {
        return '_' + w;
      }
      return capitalize(w);
    }),
  );
  return result.join('');
}

/**
 * Converts a given string to lower camel case (forcing the first character to be
 * in lower case).
 */
export function toLowerCamelCase(str: string) {
  const camelCase = toCamelCase(str);
  if (camelCase.length === 0) {
    return camelCase;
  }
  return camelCase[0].toLowerCase() + camelCase.slice(1);
}

/**
 * Converts a given string to lower camel case (forcing the first character to be
 * in lower case).
 */
export function makeUUID() {
  return randomUUID();
}

// Get proto type name removing the prefix. For example full type name: type.googleapis.com/google.rpc.Help, the function returns google.rpc.Help.
export const getProtoNameFromFullName = (fullTypeName: string): string => {
  const parts = fullTypeName.split(PROTO_TYPE_PREFIX);
  if (parts.length !== NUM_OF_PARTS_IN_PROTO_TYPE_NAME) {
    throw Error("Can't get proto name");
  }
  return parts[1];
};

// Given a proto Any and a set of protos, decode using the set of protos.
export const decodeProtobufAny = (
  anyValue: any,
  protobuf: protobuf.Type,
): protobuf.Message<{}> => {
  if (anyValue.type_url === '') {
    throw new Error('Any type_url is not set');
  }
  const typeName: string = getProtoNameFromFullName(anyValue.type_url);
  const type: protobuf.Type = protobuf.lookupType(typeName);
  return type.decode(anyValue.value);
};

// Given list of protos, if any of them are Any proto try to decode them with protos in given protobuf.
export const decodeAnyProtosInArray = (
  protoList: Array<{}>,
  protobuf: protobuf.Type,
): Array<{}> => {
  const protoListDecoded: Array<{}> = [];
  for (const proto of protoList) {
    if (proto.constructor.name === 'Any') {
      try {
        // Proto is Any we try to decode with protos in protobuf.
        const decodedAnyProto = decodeProtobufAny(proto, protobuf);
        protoListDecoded.push(decodedAnyProto);
      } catch (e: any) {
        // Skip we can't process it.
      }
      continue;
    }
    protoListDecoded.push(proto);
  }
  return protoListDecoded;
};
