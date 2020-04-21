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

import * as grpcProtoLoader from '@grpc/proto-loader';
import * as fs from 'fs';
import {GoogleAuth, GoogleAuthOptions} from 'google-auth-library';
import * as grpc from '@grpc/grpc-js';
import {OutgoingHttpHeaders} from 'http';
import * as path from 'path';
import * as protobuf from 'protobufjs';
import * as semver from 'semver';
import * as walk from 'walkdir';

import * as gax from './gax';
import {ClientOptions} from '@grpc/grpc-js/build/src/client';

const googleProtoFilesDir = path.join(__dirname, '..', '..', 'protos');

// INCLUDE_DIRS is passed to @grpc/proto-loader
const INCLUDE_DIRS: string[] = [];
INCLUDE_DIRS.push(googleProtoFilesDir);

// COMMON_PROTO_FILES logic is here for protobufjs loads (see
// GoogleProtoFilesRoot below)
const COMMON_PROTO_FILES = walk
  .sync(googleProtoFilesDir)
  .filter(f => path.extname(f) === '.proto')
  .map(f => path.normalize(f).substring(googleProtoFilesDir.length + 1));

export interface GrpcClientOptions extends GoogleAuthOptions {
  auth?: GoogleAuth;
  grpc?: GrpcModule;
}

export interface MetadataValue {
  equals: Function;
}

export interface Metadata {
  // eslint-disable-next-line @typescript-eslint/no-misused-new
  new (): Metadata;
  set: (key: {}, value?: {} | null) => void;
  clone: () => Metadata;
  value: MetadataValue;
  get: (key: {}) => {};
}

export type GrpcModule = typeof grpc;

export interface ClientStubOptions {
  protocol?: string;
  servicePath?: string;
  port?: number;
  sslCreds?: grpc.ChannelCredentials;
  [index: string]: string | number | undefined | {};
}

export class ClientStub extends grpc.Client {
  [name: string]: Function;
}

export class GrpcClient {
  auth: GoogleAuth;
  grpc: GrpcModule;
  grpcVersion: string;
  fallback: boolean;

  /**
   * A class which keeps the context of gRPC and auth for the gRPC.
   *
   * @param {Object=} options - The optional parameters. It will be directly
   *   passed to google-auth-library library, so parameters like keyFile or
   *   credentials will be valid.
   * @param {Object=} options.auth - An instance of google-auth-library.
   *   When specified, this auth instance will be used instead of creating
   *   a new one.
   * @param {Object=} options.grpc - When specified, this will be used
   *   for the 'grpc' module in this context. By default, it will load the grpc
   *   module in the standard way.
   * @constructor
   */
  constructor(options: GrpcClientOptions = {}) {
    this.auth = options.auth || new GoogleAuth(options);
    this.fallback = false;

    const minimumVersion = '10.0.0';
    if (semver.lt(process.version, minimumVersion)) {
      const errorMessage =
        `Node.js v${minimumVersion} is a minimum requirement. To learn about legacy version support visit: ` +
        'https://github.com/googleapis/google-cloud-node#supported-nodejs-versions';
      throw new Error(errorMessage);
    }

    if ('grpc' in options) {
      this.grpc = options.grpc!;
      this.grpcVersion = '';
    } else {
      this.grpc = grpc;
      this.grpcVersion = require('@grpc/grpc-js/package.json').version;
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
  async _getCredentials(opts: ClientStubOptions) {
    if (opts.sslCreds) {
      return opts.sslCreds;
    }
    const grpc = this.grpc;
    const sslCreds = grpc.credentials.createSsl();
    const client = await this.auth.getClient();
    const credentials = grpc.credentials.combineChannelCredentials(
      sslCreds,
      grpc.credentials.createFromGoogleCredential(client)
    );
    return credentials;
  }

  /**
   * Loads the gRPC service from the proto file(s) at the given path and with the
   * given options.
   * @param filename The path to the proto file(s).
   * @param options Options for loading the proto file.
   */
  loadFromProto(filename: string | string[], options: grpcProtoLoader.Options) {
    const packageDef = grpcProtoLoader.loadSync(filename, options);
    return this.grpc.loadPackageDefinition(packageDef);
  }

  /**
   * Load grpc proto service from a filename hooking in googleapis common protos
   * when necessary.
   * @param {String} protoPath - The directory to search for the protofile.
   * @param {String|String[]} filename - The filename(s) of the proto(s) to be loaded.
   *   If omitted, protoPath will be treated as a file path to load.
   * @return {Object<string, *>} The gRPC loaded result (the toplevel namespace
   *   object).
   */
  loadProto(protoPath: string, filename?: string | string[]) {
    if (!filename) {
      filename = path.basename(protoPath);
      protoPath = path.dirname(protoPath);
    }

    if (Array.isArray(filename) && filename.length === 0) {
      return {};
    }
    // This set of @grpc/proto-loader options
    // 'closely approximates the existing behavior of grpc.load'
    const includeDirs = INCLUDE_DIRS.slice();
    includeDirs.unshift(protoPath);
    const options = {
      keepCase: false,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
      includeDirs,
    };
    return this.loadFromProto(filename, options);
  }

  static _resolveFile(protoPath: string, filename: string) {
    if (fs.existsSync(path.join(protoPath, filename))) {
      return path.join(protoPath, filename);
    } else if (COMMON_PROTO_FILES.indexOf(filename) > -1) {
      return path.join(googleProtoFilesDir, filename);
    }
    throw new Error(filename + ' could not be found in ' + protoPath);
  }

  metadataBuilder(headers: OutgoingHttpHeaders) {
    const Metadata = this.grpc.Metadata;
    const baseMetadata = new Metadata();
    for (const key in headers) {
      const value = headers[key];
      if (Array.isArray(value)) {
        value.forEach(v => baseMetadata.add(key, v));
      } else {
        baseMetadata.set(key, `${value}`);
      }
    }
    return function buildMetadata(
      abTests?: {},
      moreHeaders?: OutgoingHttpHeaders
    ) {
      // TODO: bring the A/B testing info into the metadata.
      let copied = false;
      let metadata = baseMetadata;
      if (moreHeaders) {
        for (const key in moreHeaders) {
          if (key.toLowerCase() !== 'x-goog-api-client') {
            if (!copied) {
              copied = true;
              metadata = metadata.clone();
            }
            const value = moreHeaders[key];
            if (Array.isArray(value)) {
              value.forEach(v => metadata.add(key, v));
            } else {
              metadata.set(key, `${value}`);
            }
          }
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
    serviceName: string,
    clientConfig: gax.ClientConfig,
    configOverrides: gax.ClientConfig,
    headers: OutgoingHttpHeaders
  ) {
    return gax.constructSettings(
      serviceName,
      clientConfig,
      configOverrides,
      this.grpc.status,
      {metadataBuilder: this.metadataBuilder(headers)}
    );
  }

  /**
   * Creates a gRPC stub with current gRPC and auth.
   * @param {function} CreateStub - The constructor function of the stub.
   * @param {Object} options - The optional arguments to customize
   *   gRPC connection. This options will be passed to the constructor of
   *   gRPC client too.
   * @param {string} options.servicePath - The name of the server of the service.
   * @param {number} options.port - The port of the service.
   * @param {grpcTypes.ClientCredentials=} options.sslCreds - The credentials to be used
   *   to set up gRPC connection.
   * @return {Promise} A promise which resolves to a gRPC stub instance.
   */
  async createStub(CreateStub: typeof ClientStub, options: ClientStubOptions) {
    const serviceAddress = options.servicePath + ':' + options.port;
    const creds = await this._getCredentials(options);
    const grpcOptions: ClientOptions = {};
    // @grpc/grpc-js limits max receive message length starting from v0.8.0
    // https://github.com/grpc/grpc-node/releases/tag/%40grpc%2Fgrpc-js%400.8.0
    // To keep the existing behavior and avoid libraries breakage, we pass -1 there as suggested.
    grpcOptions['grpc.max_receive_message_length'] = -1;
    Object.keys(options).forEach(key => {
      // the older versions had a bug which required users to call an option
      // grpc.grpc.* to make it actually pass to gRPC as grpc.*, let's handle
      // this here until the next major release
      if (key.startsWith('grpc.grpc.')) {
        key = key.replace(/^grpc\./, '');
      }
      if (key.startsWith('grpc.')) {
        grpcOptions[key] = options[key] as string | number;
      }
    });
    const stub = new CreateStub(
      serviceAddress,
      creds,
      grpcOptions as ClientOptions
    );
    return stub;
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
    encode: (obj: {}) => {
      finish: () => Array<{}>;
    };
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
  // proto. If it is a common proto, use the bundled proto.
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
