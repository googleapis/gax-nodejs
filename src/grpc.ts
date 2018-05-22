/*
 * Copyright 2016, Google Inc.
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
 *
 */
'use strict';

const autoAuth = require('google-auto-auth');

import * as fs from 'fs';
import * as util from 'util';
import * as globby from 'globby';
import * as path from 'path';
import * as protobuf from 'protobufjs';
import * as gax from './gax';
import {IncomingHttpHeaders} from 'http';
import {AnyDecoder} from './longrunning';
let googleProtoFilesDir = require('google-proto-files')('..');

googleProtoFilesDir = path.normalize(googleProtoFilesDir);

const COMMON_PROTO_DIRS = [
  // This list of directories is defined here:
  // https://github.com/googleapis/googleapis/blob/master/gapic/packaging/common_protos.yaml
  'api',
  path.join('iam', 'v1'),
  path.join('logging', 'type'),
  'longrunning',
  'protobuf',  // This is an additional path that the common protos depend on.
  'rpc',
  'type',
];

const COMMON_PROTO_GLOB_PATTERNS = COMMON_PROTO_DIRS.map(dir => {
  return path.join(googleProtoFilesDir, 'google', dir, '**', '*.proto');
});

const COMMON_PROTO_FILES =
    globby.sync(COMMON_PROTO_GLOB_PATTERNS)
        .map(filename => {
          return path.normalize(filename);
        })
        .map(filename => {
          return filename.substring(googleProtoFilesDir.length + 1);
        });

export interface GoogleAutoAuth {
  getAuthClient: (callback: (err: Error|null, client?: {}) => void) => void;
}

export interface GrpcClientOptions {
  auth: GoogleAutoAuth;
  promise?: PromiseConstructor;
  grpc?: GrpcModule;
}

export interface MetadataValue {
  equals: Function;
}

export interface Metadata {
  new(): Metadata;
  set: (key: {}, value?: {}|null) => void;
  clone: () => Metadata;
  value: MetadataValue;
  get: (key: {}) => {};
}

export interface GrpcModule {
  credentials: {
    createSsl(): void; combineChannelCredentials: Function;
    createFromGoogleCredential: Function;
  };
  load: Function;
  loadObject: Function;
  Metadata: Metadata;
  status: {[index: string]: number;};
}

export interface StubOptions {
  [index: string]: {};
  servicePath: string;
  port: number;
  sslCreds: boolean;
}

export interface Stub {
  new(serviceAddress: string, credentials: {}, grpcOptions: {}): Stub;
}

export class GrpcClient {
  auth: GoogleAutoAuth;
  promise: PromiseConstructor;
  grpc: GrpcModule;
  grpcVersion: string;

  /**
   * A class which keeps the context of gRPC and auth for the gRPC.
   *
   * @param {Object=} options - The optional parameters. It will be directly
   *   passed to google-auto-auth library, so parameters like keyFile or
   *   credentials will be valid.
   * @param {Object=} options.auth - An instance of google-auto-auth.
   *   When specified, this auth instance will be used instead of creating
   *   a new one.
   * @param {Object=} options.grpc - When specified, this will be used
   *   for the 'grpc' module in this context. By default, it will load the grpc
   *   module in the standard way.
   * @param {Function=} options.promise - A constructor for a promise that
   * implements the ES6 specification of promise. If not provided, native
   * promises will be used.
   * @constructor
   */
  constructor(options: GrpcClientOptions) {
    // if (!(this instanceof GrpcClient)) {
    //   return new GrpcClient(options);
    // }
    options = options || {};
    this.auth = options.auth || autoAuth(options);
    this.promise = options.promise || Promise;
    if ('grpc' in options) {
      this.grpc = options.grpc!;
      this.grpcVersion = '';
    } else {
      this.grpc = require('grpc');
      this.grpcVersion = require('grpc/package.json').version;
    }
  }

  /**
   * Creates a gRPC credentials. It asks the auth data if necessary.
   * @private
   * @param {Object} opts - options values for configuring credentials.
   * @param {Object=} opts.sslCreds - when specified, this is used instead
   *   of default channel credentials.
   * @return {Promise} The promise which will be resolved to the gRPC credential.
   */
  _getCredentials(opts: StubOptions) {
    // tslint:disable-next-line variable-name
    const PromiseCtor = this.promise;
    if (opts.sslCreds) {
      return PromiseCtor.resolve(opts.sslCreds);
    }
    const grpc = this.grpc;
    const getAuthClient = this.auth.getAuthClient.bind(this.auth);
    const sslCreds = grpc.credentials.createSsl();
    return new PromiseCtor((resolve, reject) => {
      getAuthClient((err: Error|null, auth: {}) => {
        if (err) {
          reject(err);
        } else {
          const credentials = grpc.credentials.combineChannelCredentials(
              sslCreds, grpc.credentials.createFromGoogleCredential(auth));
          resolve(credentials);
        }
      });
    });
  }

  /**
   * Load grpc proto services with the specific arguments.
   * @param {Array=} args - The argument list to be passed to grpc.load().
   * @return {Object} The gRPC loaded result (the toplevel namespace object).
   */
  load(args: Array<{}>) {
    if (!args) {
      args = [];
    } else if (!Array.isArray(args)) {
      args = [args];
    }
    if (args.length === 1) {
      args.push('proto', {convertFieldsToCamelCase: true});
    }
    return this.grpc.load.apply(this.grpc, args);
  }

  /**
   * Load grpc proto service from a filename hooking in googleapis common protos
   * when necessary.
   * @param {String} protoPath - The directory to search for the protofile.
   * @param {String} filename - The filename of the proto to be loaded.
   * @return {Object<string, *>} The gRPC loaded result (the toplevel namespace
   *   object).
   */
  loadProto(protoPath: string, filename: string) {
    const resolvedPath = GrpcClient._resolveFile(protoPath, filename);
    return this.grpc.loadObject(
        protobuf.loadSync(resolvedPath, new GoogleProtoFilesRoot()));
  }

  static _resolveFile(protoPath: string, filename: string) {
    if (fs.existsSync(path.join(protoPath, filename))) {
      return path.join(protoPath, filename);
    } else if (COMMON_PROTO_FILES.indexOf(filename) > -1) {
      return path.join(googleProtoFilesDir, filename);
    }
    throw new Error(filename + ' could not be found in ' + protoPath);
  }

  metadataBuilder(headers: IncomingHttpHeaders) {
    const Metadata = this.grpc.Metadata;
    const baseMetadata = new Metadata();
    // tslint:disable-next-line forin
    for (const key in headers) {
      baseMetadata.set(key, headers[key]);
    }
    return function buildMetadata(
        abTests?: {}, moreHeaders?: IncomingHttpHeaders) {
      // TODO: bring the A/B testing info into the metadata.
      let copied = false;
      let metadata = baseMetadata;
      for (const key in moreHeaders!) {
        if (key.toLowerCase() !== 'x-goog-api-client' &&
            moreHeaders!.hasOwnProperty(key)) {
          if (!copied) {
            copied = true;
            metadata = metadata.clone();
          }
          metadata.set(key, moreHeaders![key]);
        }
      }
      return metadata;
    };
  }

  /**
   * A wrapper of {@link constructSettings} function under the gRPC context.
   *
   * Most of parameters are common among constructSettings, please take a look.
   * @param {string} serviceName - The fullly-qualified name of the service.
   * @param {Object} clientConfig - A dictionary of the client config.
   * @param {Object} configOverrides - A dictionary of overriding configs.
   * @param {Object} headers - A dictionary of additional HTTP header name to
   *   its value.
   * @return {Object} A mapping of method names to CallSettings.
   */
  constructSettings(
      serviceName: string, clientConfig: gax.ClientConfig,
      configOverrides: gax.ClientConfig, headers: IncomingHttpHeaders) {
    return gax.constructSettings(
        serviceName, clientConfig, configOverrides, this.grpc.status,
        {metadataBuilder: this.metadataBuilder(headers)}, this.promise);
  }

  /**
   * Creates a gRPC stub with current gRPC and auth.
   * @param {function} CreateStub - The constructor function of the stub.
   * @param {Object} options - The optional arguments to customize
   *   gRPC connection. This options will be passed to the constructor of
   *   gRPC client too.
   * @param {string} options.servicePath - The name of the server of the service.
   * @param {number} options.port - The port of the service.
   * @param {grpc.ClientCredentials=} options.sslCreds - The credentials to be used
   *   to set up gRPC connection.
   * @return {Promise} A promse which resolves to a gRPC stub instance.
   */
  // tslint:disable-next-line variable-name
  createStub(CreateStub: Stub, options: StubOptions) {
    const serviceAddress = options.servicePath + ':' + options.port;
    return this._getCredentials(options).then(credentials => {
      const grpcOptions: {[index: string]: {}} = {};
      Object.keys(options).forEach(key => {
        if (key.indexOf('grpc.') === 0) {
          grpcOptions[key] = options[key];
        }
      });
      return new CreateStub(serviceAddress, credentials, grpcOptions);
    });
  }

  /**
   * Creates a 'bytelength' function for a given proto message class.
   *
   * See {@link BundleDescriptor} about the meaning of the return value.
   *
   * @param {function} message - a constructor function that is generated by
   *   protobuf.js. Assumes 'encoder' field in the message.
   * @return {function(Object):number} - a function to compute the byte length
   *   for an object.
   */
  static createByteLengthFunction(message: {
    encode:
        (obj: {}) => {
          finish: () => Array<{}>
        }
  }) {
    return function getByteLength(obj: {}) {
      return message.encode(obj).finish().length;
    };
  }
}

export class GoogleProtoFilesRoot extends protobuf.Root {
  constructor(...args: Array<{}>) {
    super(...args);
  }

  // Causes the loading of an included proto to check if it is a common
  // proto. If it is a common proto, use the google-proto-files proto.
  resolvePath(originPath: string, includePath: string) {
    originPath = path.normalize(originPath);
    includePath = path.normalize(includePath);

    // Fully qualified paths don't need to be resolved.
    if (path.isAbsolute(includePath)) {
      if (!fs.existsSync(includePath)) {
        throw new Error('The include `' + includePath + '` was not found.');
      }
      return includePath;
    }

    if (COMMON_PROTO_FILES.indexOf(includePath) > -1) {
      return path.join(googleProtoFilesDir, includePath);
    }

    return GoogleProtoFilesRoot._findIncludePath(originPath, includePath);
  }

  static _findIncludePath(originPath: string, includePath: string) {
    originPath = path.normalize(originPath);
    includePath = path.normalize(includePath);

    let current = originPath;
    let found = fs.existsSync(path.join(current, includePath));
    while (!found && current.length > 0) {
      current = current.substring(0, current.lastIndexOf(path.sep));
      found = fs.existsSync(path.join(current, includePath));
    }
    if (!found) {
      throw new Error('The include `' + includePath + '` was not found.');
    }
    return path.join(current, includePath);
  }
}
