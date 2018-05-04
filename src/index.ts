/**
 * Copyright 2016, Google Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above
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

'use strict';

import * as extend from 'extend';
const bundling = require('./bundling');
const gax = require('./gax');
const grpc = require('./grpc');
const streaming = require('./streaming');
const operationsClient = require('./operations_client');
const longrunning = require('./longrunning');
import * as routingHeader from './routing_header';

function lro(options) {
  options = extend(
    {
      scopes: (lro as any).ALL_SCOPES,
    },
    options
  );
  var gaxGrpc = grpc(options);
  return operationsClient(gaxGrpc);
}
(lro as any).SERVICE_ADDRESS = operationsClient.SERVICE_ADDRESS;
(lro as any).ALL_SCOPES = operationsClient.ALL_SCOPES;

exports.lro = lro;
exports.createApiCall = require('./api_callable').createApiCall;
exports.grpc = grpc;
exports.createByteLengthFunction = grpc.createByteLengthFunction;
exports.PathTemplate = require('./path_template').PathTemplate;
exports.PageDescriptor = require('./paged_iteration').PageDescriptor;
exports.BundleDescriptor = bundling.BundleDescriptor;
exports.StreamType = streaming.StreamType;
exports.StreamDescriptor = streaming.StreamDescriptor;
exports.constructSettings = gax.constructSettings;
exports.BundleExecutor = bundling.BundleExecutor;
exports.LongrunningDescriptor = longrunning.LongrunningDescriptor;
exports.operation = longrunning.operation;
exports.routingHeader = routingHeader;
exports.version = require('./package').version;
