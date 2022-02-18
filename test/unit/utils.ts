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

import {GaxCallPromise} from '../../src/apitypes';
import {createApiCall as realCreateApiCall} from '../../src/createApiCall';
import * as gax from '../../src/gax';
import {GoogleError} from '../../src/googleError';
import {Descriptor} from '../../src/descriptor';
import {serializer} from '../../src';
import {defaultToObjectOptions} from '../../src/fallback';

export const FAKE_STATUS_CODE_1 = (exports.FAKE_STATUS_CODE_1 = 1);

export function fail(
  argument: {},
  metadata: {},
  options: Options,
  callback: Function
) {
  const error = new GoogleError();
  error.code = FAKE_STATUS_CODE_1;
  callback(error);
}

export interface Options {
  settings?: gax.CallOptions;
  descriptor?: Descriptor;
  returnCancelFunc?: boolean;
  cancel?: Function;
  deadline?: string;
}

export function createApiCall(func: Function, opts?: Options) {
  const settings = new gax.CallSettings((opts && opts.settings) || {});
  const descriptor = opts && opts.descriptor;
  return realCreateApiCall(
    Promise.resolve((argument, metadata, options, callback) => {
      if (opts && opts.returnCancelFunc) {
        return {
          cancel: func(argument, metadata, options, callback),
          completed: true,
          call: () => {
            throw new Error('should not be run');
          },
        };
      }
      const conceller = func(argument, metadata, options, callback);
      if (conceller instanceof Promise) {
        conceller.catch((err: string) => {
          callback(new GoogleError(err));
        });
      }
      return {
        cancel:
          (opts && opts.cancel) ||
          (() => {
            callback(new Error('canceled'));
          }),
        completed: true,
        call: () => {
          throw new Error('should not be run');
        },
      };
    }),
    settings,
    descriptor
  ) as GaxCallPromise;
}

export function createRetryOptions(
  backoffSettingsOrInitialRetryDelayMillis: number | gax.BackoffSettings,
  retryDelayMultiplier?: number,
  maxRetryDelayMillis?: number,
  initialRpcTimeoutMillis?: number,
  rpcTimeoutMultiplier?: number,
  maxRpcTimeoutMillis?: number,
  totalTimeoutMillis?: number
) {
  const backoff =
    typeof backoffSettingsOrInitialRetryDelayMillis === 'number'
      ? gax.createBackoffSettings(
          backoffSettingsOrInitialRetryDelayMillis,
          retryDelayMultiplier!,
          maxRetryDelayMillis!,
          initialRpcTimeoutMillis!,
          rpcTimeoutMultiplier!,
          maxRpcTimeoutMillis!,
          totalTimeoutMillis!
        )
      : backoffSettingsOrInitialRetryDelayMillis;
  return gax.createRetryOptions([FAKE_STATUS_CODE_1], backoff);
}

export function toProtobufJSON(protobufType: protobuf.Type, json: {}) {
  const message = serializer.fromProto3JSON(protobufType, json);
  if (!message) {
    throw new Error(
      `Internal Error: fail to convert JSON to protobuf specific JSON, protobuf type: ${protobufType}`
    );
  }
  return protobufType.toObject(message, defaultToObjectOptions);
}
