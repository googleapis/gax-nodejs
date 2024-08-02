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
import { GaxCallPromise } from '../../src/apitypes';
import * as gax from '../../src/gax';
import { Descriptor } from '../../src/descriptor';
export declare const FAKE_STATUS_CODE_1 = 1;
export declare function fail(argument: {}, metadata: {}, options: Options, callback: Function): void;
export interface Options {
    settings?: gax.CallOptions;
    descriptor?: Descriptor;
    returnCancelFunc?: boolean;
    cancel?: Function;
    deadline?: string;
}
export declare function createApiCall(func: Function, opts?: Options): GaxCallPromise;
export declare function createRetryOptions(backoffSettingsOrInitialRetryDelayMillis: number | gax.BackoffSettings, retryDelayMultiplier?: number, maxRetryDelayMillis?: number, initialRpcTimeoutMillis?: number, rpcTimeoutMultiplier?: number, maxRpcTimeoutMillis?: number, totalTimeoutMillis?: number): gax.RetryOptions;
export declare function toProtobufJSON(protobufType: protobuf.Type, json: {}): {
    [k: string]: any;
};
