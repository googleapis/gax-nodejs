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

// This file implements gRPC to HTTP transcoding, as described in
// https://cloud.google.com/endpoints/docs/grpc-service-config/reference/rpc/google.api#grpc-transcoding

import {JSONObject, JSONValue} from 'proto3-json-serializer';
import {Field} from 'protobufjs';
import {google} from '../protos/http';
import {camelToSnakeCase, snakeToCamelCase} from './util';

export interface TranscodedRequest {
  httpMethod: 'get' | 'post' | 'put' | 'patch' | 'delete';
  url: string;
  queryString: string;
  data: string | {};
}

const httpOptionName = '(google.api.http)';
const fieldBehaviorOptionName = '(google.api.field_behavior)';
const proto3OptionalName = 'proto3_optional';

// The following type is here only to make tests type safe
type allowedOptions = '(google.api.method_signature)';

// List of methods as defined in google/api/http.proto (see HttpRule)
const supportedHttpMethods: Array<'get' | 'put' | 'post' | 'patch' | 'delete'> =
  ['get', 'post', 'put', 'patch', 'delete'];

export type ParsedOptionsType = Array<
  {
    [httpOptionName]?: google.api.IHttpRule;
  } & {
    [option in allowedOptions]?: {} | string | number;
  }
>;

export function getField(
  request: JSONObject,
  field: string
): JSONValue | undefined {
  const parts = field.split('.');
  let value: JSONValue = request;
  for (const part of parts) {
    if (typeof value !== 'object') {
      return undefined;
    }
    value = (value as JSONObject)[part] as JSONValue;
  }
  if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
    return undefined;
  }
  return value;
}

export function deepCopy(request: JSONObject): JSONObject {
  if (typeof request !== 'object' || request === null) {
    return request;
  }
  const copy = Object.assign({}, request);
  for (const key in copy) {
    if (Array.isArray(copy[key])) {
      copy[key] = (copy[key] as JSONObject[]).map(deepCopy);
    } else if (typeof copy[key] === 'object' && copy[key] !== null) {
      copy[key] = deepCopy(copy[key] as JSONObject);
    }
  }
  return copy;
}

export function deleteField(request: JSONObject, field: string): void {
  const parts = field.split('.');
  while (parts.length > 1) {
    if (typeof request !== 'object') {
      return;
    }
    const part = parts.shift() as string;
    request = request[part] as JSONObject;
  }
  const part = parts.shift() as string;
  if (typeof request !== 'object') {
    return;
  }
  delete request[part];
}

export function buildQueryStringComponents(
  request: JSONObject,
  prefix = ''
): string[] {
  const resultList = [];
  for (const key in request) {
    if (Array.isArray(request[key])) {
      for (const value of request[key] as JSONObject[]) {
        resultList.push(
          `${prefix}${encodeWithoutSlashes(key)}=${encodeWithoutSlashes(
            value.toString()
          )}`
        );
      }
    } else if (typeof request[key] === 'object' && request[key] !== null) {
      resultList.push(
        ...buildQueryStringComponents(request[key] as JSONObject, `${key}.`)
      );
    } else {
      resultList.push(
        `${prefix}${encodeWithoutSlashes(key)}=${encodeWithoutSlashes(
          request[key] === null ? 'null' : request[key]!.toString()
        )}`
      );
    }
  }
  return resultList;
}

export function encodeWithSlashes(str: string): string {
  return str
    .split('')
    .map(c => (c.match(/[-_.~0-9a-zA-Z]/) ? c : encodeURIComponent(c)))
    .join('');
}

export function encodeWithoutSlashes(str: string): string {
  return str
    .split('')
    .map(c => (c.match(/[-_.~0-9a-zA-Z/]/) ? c : encodeURIComponent(c)))
    .join('');
}

function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function applyPattern(
  pattern: string,
  fieldValue: string
): string | undefined {
  if (!pattern || pattern === '*') {
    return encodeWithSlashes(fieldValue);
  }

  if (!pattern.includes('*') && pattern !== fieldValue) {
    return undefined;
  }

  // since we're converting the pattern to a regex, make necessary precautions:
  const regex = new RegExp(
    '^' +
      escapeRegExp(pattern)
        .replace(/\\\*\\\*/g, '(.+)')
        .replace(/\\\*/g, '([^/]+)') +
      '$'
  );

  if (!fieldValue.match(regex)) {
    return undefined;
  }

  return encodeWithoutSlashes(fieldValue);
}

interface MatchResult {
  matchedFields: string[];
  url: string;
}

export function match(
  request: JSONObject,
  pattern: string
): MatchResult | undefined {
  let url = pattern;
  const matchedFields = [];
  for (;;) {
    const match = url.match(/^(.*)\{([^}=]+)(?:=([^}]*))?\}(.*)/);
    if (!match) {
      break;
    }
    const [, before, field, pattern, after] = match;
    matchedFields.push(field);
    const fieldValue = getField(request, field);
    if (typeof fieldValue === 'undefined') {
      return undefined;
    }
    const appliedPattern = applyPattern(
      pattern,
      fieldValue === null ? 'null' : fieldValue!.toString()
    );
    if (typeof appliedPattern === 'undefined') {
      return undefined;
    }
    url = before + appliedPattern + after;
  }

  return {matchedFields, url};
}

export function flattenObject(request: JSONObject): JSONObject {
  const result: JSONObject = {};
  for (const key in request) {
    if (typeof request[key] === 'undefined') {
      continue;
    }

    if (Array.isArray(request[key])) {
      // According to the http.proto comments, a repeated field may only
      // contain primitive types, so no extra recursion here.
      result[key] = request[key];
      continue;
    }

    if (typeof request[key] === 'object' && request[key] !== null) {
      const nested = flattenObject(request[key] as JSONObject);
      for (const nestedKey in nested) {
        result[`${key}.${nestedKey}`] = nested[nestedKey];
      }
      continue;
    }

    result[key] = request[key];
  }

  return result;
}

export function requestChangeCaseAndCleanup(
  request: JSONObject,
  caseChangeFunc: (key: string) => string
) {
  if (!request || typeof request !== 'object') {
    return request;
  }
  const convertedRequest: JSONObject = {};
  for (const field in request) {
    // cleaning up inherited properties
    if (!Object.prototype.hasOwnProperty.call(request, field)) {
      continue;
    }
    const convertedField = caseChangeFunc(field);
    const value = request[field];
    if (Array.isArray(value)) {
      convertedRequest[convertedField] = value.map(v =>
        requestChangeCaseAndCleanup(v as JSONObject, caseChangeFunc)
      );
    } else {
      convertedRequest[convertedField] = requestChangeCaseAndCleanup(
        value as JSONObject,
        caseChangeFunc
      );
    }
  }
  return convertedRequest;
}

export function isProto3OptionalField(field: Field) {
  return field && field.options && field.options![proto3OptionalName];
}

export function isRequiredField(field: Field) {
  return (
    field &&
    field.options &&
    field.options![fieldBehaviorOptionName] === 'REQUIRED'
  );
}

export function getFieldNameOnBehavior(
  fields: {[k: string]: Field} | undefined
) {
  const requiredFields = new Set<string>();
  const optionalFields = new Set<string>();
  for (const fieldName in fields) {
    const field = fields[fieldName];
    if (isRequiredField(field)) {
      requiredFields.add(fieldName);
    }
    if (isProto3OptionalField(field)) {
      optionalFields.add(fieldName);
    }
  }
  return {requiredFields, optionalFields};
}

export function transcode(
  request: JSONObject,
  parsedOptions: ParsedOptionsType,
  requestFields?: {[k: string]: Field}
): TranscodedRequest | undefined {
  const {requiredFields, optionalFields} =
    getFieldNameOnBehavior(requestFields);
  // all fields annotated as REQUIRED MUST be emitted in the body.
  for (const requiredField of requiredFields) {
    if (!(requiredField in request) || request[requiredField] === 'undefined') {
      throw new Error(
        `Required field ${requiredField} is not present in the request.`
      );
    }
  }
  // request is supposed to have keys in camelCase.
  const snakeRequest = requestChangeCaseAndCleanup(request, camelToSnakeCase);
  const httpRules = [];
  for (const option of parsedOptions) {
    if (!(httpOptionName in option)) {
      continue;
    }

    const httpRule = option[httpOptionName] as google.api.IHttpRule;
    httpRules.push(httpRule);

    if (httpRule?.additional_bindings) {
      const additionalBindings = Array.isArray(httpRule.additional_bindings)
        ? httpRule.additional_bindings
        : [httpRule.additional_bindings];
      httpRules.push(...additionalBindings);
    }
  }

  for (const httpRule of httpRules) {
    for (const httpMethod of supportedHttpMethods) {
      if (!(httpMethod in httpRule)) {
        continue;
      }
      const pathTemplate = httpRule[
        httpMethod as keyof google.api.IHttpRule
      ] as string;
      const matchResult = match(snakeRequest, pathTemplate);
      if (typeof matchResult === 'undefined') {
        continue;
      }
      const {url, matchedFields} = matchResult;

      if (httpRule.body === '*') {
        // all fields except the matched fields go to request data
        const data = deepCopy(snakeRequest);
        for (const field of matchedFields) {
          deleteField(data, field);
        }
        // Remove unset proto3 optional field from the request body.
        for (const key in data) {
          if (
            optionalFields.has(snakeToCamelCase(key)) &&
            (!(key in snakeRequest) || snakeRequest[key] === 'undefined')
          ) {
            delete data[key];
          }
        }
        // HTTP endpoint expects camelCase but we have snake_case at this point
        const camelCaseData = requestChangeCaseAndCleanup(
          data,
          snakeToCamelCase
        );
        return {httpMethod, url, queryString: '', data: camelCaseData};
      }

      // one field possibly goes to request data, others go to query string
      const body = httpRule.body;
      let data: string | JSONObject = '';
      const queryStringObject = deepCopy(request); // use camel case for query string
      if (body) {
        deleteField(queryStringObject, snakeToCamelCase(body));
        // Unset optional field should not add in body request.
        data =
          optionalFields.has(body) && snakeRequest[body] === 'undefined'
            ? ''
            : (snakeRequest[body] as JSONObject);
      }
      for (const field of matchedFields) {
        deleteField(queryStringObject, snakeToCamelCase(field));
      }
      // Unset proto3 optional field does not appear in the query params.
      for (const key in queryStringObject) {
        if (optionalFields.has(key) && request[key] === 'undefined') {
          delete queryStringObject[key];
        }
      }
      const queryStringComponents =
        buildQueryStringComponents(queryStringObject);
      const queryString = queryStringComponents.join('&');
      let camelCaseData: string | JSONObject;
      if (typeof data === 'string') {
        camelCaseData = data;
      } else {
        camelCaseData = requestChangeCaseAndCleanup(data, snakeToCamelCase);
      }
      return {httpMethod, url, queryString, data: camelCaseData};
    }
  }
  return undefined;
}

// Override the protobuf json's the http rules.
export function overrideHttpRules(
  httpRules: Array<google.api.IHttpRule>,
  protoJson: protobuf.Root
) {
  for (const rule of httpRules) {
    if (!rule.selector) {
      continue;
    }
    const rpc = protoJson.lookup(rule.selector) as protobuf.Method;
    // Not support override on non-exist RPC or a RPC without an annotation.
    // We could reconsider if we have the use case later.
    if (!rpc || !rpc.parsedOptions) {
      continue;
    }
    for (const item of rpc.parsedOptions) {
      if (!(httpOptionName in item)) {
        continue;
      }
      const httpOptions = item[httpOptionName];
      for (const httpMethod in httpOptions) {
        if (httpMethod in rule) {
          if (httpMethod === 'additional_bindings') {
            continue;
          }
          httpOptions[httpMethod] =
            rule[httpMethod as keyof google.api.IHttpRule];
        }
        if (rule.additional_bindings) {
          httpOptions['additional_bindings'] = !httpOptions[
            'additional_bindings'
          ]
            ? []
            : Array.isArray(httpOptions['additional_bindings'])
            ? httpOptions['additional_bindings']
            : [httpOptions['additional_bindings']];
          // Make the additional_binding to be an array if it is not.
          httpOptions['additional_bindings'].push(...rule.additional_bindings);
        }
      }
    }
  }
}
