/*
 * Copyright 2019 Google LLC
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of Google Inc. nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import {Status} from '../status';

import {APICallback, GRPCCallResult, SimpleCallbackFunction} from '../apitypes';
import {GoogleError} from '../googleError';

export interface SubResponseInfo {
  field: string;
  start?: number;
  end?: number;
}

export interface TaskElement {}

export interface TaskData {
  elements: TaskElement[];
  bytes: number;
  callback: TaskCallback;
  cancelled?: boolean;
}

export interface TaskCallback extends APICallback {
  id?: string;
}

/**
 * Creates a deep copy of the object with the consideration of subresponse
 * fields for bundling.
 *
 * @param {Object} obj - The source object.
 * @param {Object?} subresponseInfo - The information to copy the subset of
 *   the field for the response. Do nothing if it's null.
 * @param {String} subresponseInfo.field - The field name.
 * @param {number} subresponseInfo.start - The offset where the copying
 *   element should starts with.
 * @param {number} subresponseInfo.end - The ending index where the copying
 *   region of the elements ends.
 * @return {Object} The copied object.
 * @private
 */
export function deepCopyForResponse(
  // tslint:disable-next-line no-any
  obj: any,
  subresponseInfo: SubResponseInfo | null
) {
  // tslint:disable-next-line no-any
  let result: any;
  if (obj === null) {
    return null;
  }
  if (obj === undefined) {
    return undefined;
  }
  if (Array.isArray(obj)) {
    result = [];
    obj.forEach(element => {
      result.push(deepCopyForResponse(element, null));
    });
    return result;
  }
  // Some objects (such as ByteBuffer) have copy method.
  if (obj.copy !== undefined) {
    return obj.copy();
  }
  // ArrayBuffer should be copied through slice().
  if (obj instanceof ArrayBuffer) {
    return (obj as ArrayBuffer).slice(0);
  }
  if (typeof obj === 'object') {
    result = {};
    Object.keys(obj).forEach(key => {
      if (
        subresponseInfo &&
        key === subresponseInfo.field &&
        Array.isArray(obj[key])
      ) {
        // Note that subresponses are not deep-copied. This is safe because
        // those subresponses are not shared among callbacks.
        result[key] = obj[key].slice(
          subresponseInfo.start,
          subresponseInfo.end
        );
      } else {
        result[key] = deepCopyForResponse(obj[key], null);
      }
    });
    return result;
  }
  return obj;
}

export class Task {
  _apiCall: SimpleCallbackFunction;
  _request: {[index: string]: TaskElement[]};
  _bundledField: string;
  _subresponseField?: string | null;
  _data: TaskData[];
  callCanceller?: GRPCCallResult;
  /**
   * A task coordinates the execution of a single bundle.
   *
   * @param {function} apiCall - The function to conduct calling API.
   * @param {Object} bundlingRequest - The base request object to be used
   *   for the actual API call.
   * @param {string} bundledField - The name of the field in bundlingRequest
   *   to be bundled.
   * @param {string=} subresponseField - The name of the field in the response
   *   to be passed to the callback.
   * @constructor
   * @private
   */
  constructor(
    apiCall: SimpleCallbackFunction,
    bundlingRequest: {},
    bundledField: string,
    subresponseField?: string | null
  ) {
    this._apiCall = apiCall;
    this._request = bundlingRequest;
    this._bundledField = bundledField;
    this._subresponseField = subresponseField;
    this._data = [];
  }
  /**
   * Returns the number of elements in a task.
   * @return {number} The number of elements.
   */
  getElementCount() {
    let count = 0;
    for (let i = 0; i < this._data.length; ++i) {
      count += this._data[i].elements.length;
    }
    return count;
  }
  /**
   * Returns the total byte size of the elements in a task.
   * @return {number} The byte size.
   */
  getRequestByteSize() {
    let size = 0;
    for (let i = 0; i < this._data.length; ++i) {
      size += this._data[i].bytes;
    }
    return size;
  }
  /**
   * Invokes the actual API call with current elements.
   * @return {string[]} - the list of ids for invocations to be run.
   */
  run() {
    if (this._data.length === 0) {
      return [];
    }
    const request = this._request;
    const elements: TaskElement[] = [];
    const ids: string[] = [];
    for (let i = 0; i < this._data.length; ++i) {
      elements.push.apply(elements, this._data[i].elements);
      ids.push(this._data[i].callback.id!);
    }
    request[this._bundledField] = elements;
    const self = this;
    this.callCanceller = this._apiCall(
      request,
      (err: GoogleError | null, response?: {} | null) => {
        const responses: Array<{} | undefined> = [];
        if (err) {
          self._data.forEach(() => {
            responses.push(undefined);
          });
        } else {
          let subresponseInfo: SubResponseInfo | null = null;
          if (self._subresponseField) {
            subresponseInfo = {
              field: self._subresponseField,
              start: 0,
            };
          }
          self._data.forEach(data => {
            if (subresponseInfo) {
              subresponseInfo.end =
                subresponseInfo.start! + data.elements.length;
            }
            responses.push(deepCopyForResponse(response, subresponseInfo));
            if (subresponseInfo) {
              subresponseInfo.start = subresponseInfo.end;
            }
          });
        }
        for (let i = 0; i < self._data.length; ++i) {
          if (self._data[i].cancelled) {
            const error = new GoogleError('cancelled');
            error.code = Status.CANCELLED;
            self._data[i].callback(error);
          } else {
            self._data[i].callback(err, responses[i]);
          }
        }
      }
    );
    return ids;
  }
  /**
   * Appends the list of elements into the task.
   * @param {Object[]} elements - the new list of elements.
   * @param {number} bytes - the byte size required to encode elements in the API.
   * @param {APICallback} callback - the callback of the method call.
   */
  extend(elements: TaskElement[], bytes: number, callback: TaskCallback) {
    this._data.push({
      elements,
      bytes,
      callback,
    });
  }
  /**
   * Cancels a part of elements.
   * @param {string} id - The identifier of the part of elements.
   * @return {boolean} Whether the entire task will be canceled or not.
   */
  cancel(id: string) {
    if (this.callCanceller) {
      let allCancelled = true;
      this._data.forEach(d => {
        if (d.callback.id === id) {
          d.cancelled = true;
        }
        if (!d.cancelled) {
          allCancelled = false;
        }
      });
      if (allCancelled) {
        this.callCanceller.cancel();
      }
      return allCancelled;
    }
    for (let i = 0; i < this._data.length; ++i) {
      if (this._data[i].callback.id === id) {
        const error = new GoogleError('cancelled');
        error.code = Status.CANCELLED;
        this._data[i].callback(error);
        this._data.splice(i, 1);
        break;
      }
    }
    return this._data.length === 0;
  }
}
