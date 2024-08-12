// Copyright 2021-2024 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {EventEmitter} from 'node:events';
import * as process from 'node:process';
import * as util from 'node:util';

/**
 * This module defines an ad-hoc debug logger for Google Cloud Platform
 * client libraries in Node. An ad-hoc debug logger is a tool which lets
 * users use an external, unified interface (in this case, environment
 * variables) to determine what logging they want to see at runtime. This
 * isn't necessarily fed into the console, but is meant to be under the
 * control of the user. The kind of logging that will be produced by this
 * is more like "call retry happened", not "event you'd want to record
 * in Cloud Logger".
 *
 * More for Googlers implementing libraries with it:
 * go/cloud-client-logging-design
 */

/**
 * Possible log levels. These are a subset of Cloud Observability levels.
 * https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry#LogSeverity
 */
export enum LogSeverity {
  DEFAULT = 'DEFAULT',
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
}

export interface LogFields {
  /**
   * Log level - undefined/null === DEFAULT.
   */
  severity?: LogSeverity;

  /**
   * If this log is associated with an OpenTelemetry trace, you can put the
   * trace ID here to pass on that association.
   */
  telemetryTraceId?: string;

  /**
   * If this log is associated with an OpenTelemetry trace, you can put the
   * span ID here to pass on that association.
   */
  telemetrySpanId?: string;

  /**
   * This is a catch-all for any other items you might want to go into
   * structured logs. Library implementers, please see the spec docs above
   * for the items envisioned to go here.
   */
  other?: unknown;
}

/**
 * Adds typings for event sinks.
 */
export declare interface AdhocDebugLogger {
  on(
    event: 'log',
    listener: (fields: LogFields, args: unknown[]) => void
  ): this;
  on(event: string, listener: Function): this;
}

/**
 * Our logger instance. This actually contains the meat of dealing
 * with log lines, including EventEmitter.
 */
export class AdhocDebugLogger extends EventEmitter {
  // The function we'll call with new log lines.
  // Should be built in Node util stuff, or the "debug" package, or whatever.
  upstream: AdhocDebugLogCallable;

  // Self-referential function wrapper that calls invoke() on us.
  func: AdhocDebugLogFunction;

  constructor(upstream: AdhocDebugLogCallable) {
    super();

    this.upstream = upstream;
    this.func = Object.assign(this.invoke.bind(this), {
      // Also add an instance pointer back to us.
      instance: this,

      // And pull over the EventEmitter functionality.
      on: (event: string, listener: (args: unknown[]) => void) =>
        this.on(event, listener),
    }) as unknown as AdhocDebugLogFunction;
  }

  invoke(fields: LogFields, ...args: unknown[]): void {
    // Push out any upstream logger first.
    if (this.upstream) {
      this.upstream(fields, ...args);
    }

    // Emit sink events.
    this.emit('log', fields, args);
  }
}

/**
 * This can be used in place of a real logger while waiting for Promises or disabling logging.
 */
export const placeholder = new AdhocDebugLogger(() => {}).func;

/**
 * When the user receives a log function (below), this will be the function
 * call interface for it.
 */
export interface AdhocDebugLogCallable {
  (fields: LogFields, ...args: unknown[]): void;
}

/**
 * Adds typing info for the EventEmitter we're adding to the returned function.
 */
export interface AdhocDebugLogFunction extends AdhocDebugLogCallable {
  instance: AdhocDebugLogger;
  on(
    event: 'log',
    listener: (fields: LogFields, args: unknown[]) => void
  ): this;
}

/**
 * One of these can be passed to support a third-party backend, like "debug".
 * We're splitting this out because ESM can complicate optional module loading.
 *
 * Note that this interface may change at any time, as we're reserving the
 * right to add new backends at the logger level.
 *
 * @private
 * @internal
 */
export interface DebugLogBackend {
  makeLogger(namespace: string): AdhocDebugLogCallable;
  addEnables(enables: string[]): void;
}

// The Node util.debuglog-based backend. This one definitely works, but
// it's less feature-filled.
class NodeBackend implements DebugLogBackend {
  varsSet = false;

  constructor() {}

  makeLogger(namespace: string): AdhocDebugLogCallable {
    const nodeLogger = util.debuglog(namespace);
    return (fields: LogFields, ...args: unknown[]) => {
      // TODO: `fields` needs to be turned into a string here.
      nodeLogger('', ...args);
    };
  }

  addEnables(enables: string[]): void {
    if (!this.varsSet) {
      // Also copy over any GCP global enables.
      const existingEnables = process.env['NODE_DEBUG'] ?? '';
      process.env['NODE_DEBUG'] = `${existingEnables}${
        existingEnables ? ',' : ''
      }${enables.join(',')}`;
      this.varsSet = true;
    }
  }
}

/**
 * @returns A backend based on Node util.debuglog; this is the default.
 */
export function getNodeBackend(): DebugLogBackend {
  return new NodeBackend();
}

// Based on the npm "debug" package. Adds colour, time offsets, and other
// useful things, but requires the user to import another package.
class DebugBackend implements DebugLogBackend {
  debugPkg: debug.Debug;
  varsSet = false;

  constructor(pkg: debug.Debug) {
    this.debugPkg = pkg;
  }

  makeLogger(namespace: string): AdhocDebugLogCallable {
    const debugLogger = util.debuglog(namespace);
    return (fields: LogFields, ...args: unknown[]) => {
      // TODO: `fields` needs to be turned into a string here.
      debugLogger('', ...args);
    };
  }

  addEnables(enables: string[]): void {
    if (!this.varsSet) {
      // Also copy over any GCP global enables.
      const existingEnables = process.env['NODE_DEBUG'] ?? '';
      process.env['NODE_DEBUG'] = `${existingEnables}${
        existingEnables ? ',' : ''
      }${enables.join(',')}`;
      this.varsSet = true;
    }
  }
}

/**
 * Creates a "debug" package backend. The user must call require('debug') and pass
 * the resulting object to this function.
 *
 * ```
 *  setBackend(getDebugBackend(require('debug')))
 * ```
 *
 * https://www.npmjs.com/package/debug
 *
 * Note: Google does not explicitly endorse or recommend this package; it's just
 * being provided as an option.
 *
 * @returns A backend based on the npm "debug" package.
 */
export function getDebugBackend(debugPkg: debug.Debug): DebugLogBackend {
  return new DebugBackend(debugPkg);
}

/**
 * This pretty much works like the Node logger, but it outputs structured
 * logging JSON matching Google Cloud's ingestion specs.
 */
class StructuredBackend implements DebugLogBackend {
  varsSet = false;

  constructor() {}

  makeLogger(namespace: string): AdhocDebugLogCallable {
    const debugLogger = util.debuglog(namespace);
    return (fields: LogFields, ...args: unknown[]) => {
      // TODO: `fields` needs to be turned into a JSON string here.
      debugLogger('', ...args);
    };
  }

  addEnables(enables: string[]): void {
    if (!this.varsSet) {
      // Also copy over any GCP global enables.
      const existingEnables = process.env['NODE_DEBUG'] ?? '';
      process.env['NODE_DEBUG'] = `${existingEnables}${
        existingEnables ? ',' : ''
      }${enables.join(',')}`;
      this.varsSet = true;
    }
  }
}

/**
 * Creates a "structured logging" backend. This pretty much works like the
 * Node logger, but it outputs structured logging JSON matching Google
 * Cloud's ingestion specs instead of plain text.
 *
 * ```
 *  setBackend(getStructuredBackend())
 * ```
 *
 * @returns A backend based on Google Cloud structured logging.
 */
export function getStructuredBackend(): DebugLogBackend {
  return new StructuredBackend();
}

let cachedBackend: DebugLogBackend | null | undefined = undefined;

/**
 * Set the backend to use for our log output.
 *
 * @param backend Results from one of the get*Backend() functions.
 */
export function setBackend(backend: DebugLogBackend | null) {
  cachedBackend = backend;
}

// Keep a copy of all namespaced loggers so users can reliably .on() them.
const loggerCache = new Map<string, AdhocDebugLogger>();

/**
 * Creates a logging function. Multiple calls to this with the same namespace
 * will produce the same logger, with the same event emitter hooks.
 *
 * Namespaces can be a simple string (module name), or a qualified string
 * (module:submodule), which can be used for filtering, or for "module:*".
 *
 * @param namespace The namespace, a descriptive text string.
 * @returns A function you can call that works like console.log().
 */
export default function makeLogger(namespace: string): AdhocDebugLogFunction {
  // Reuse loggers so things like sinks are persistent.
  if (loggerCache.has(namespace)) {
    return loggerCache.get(namespace)!.func;
  }

  // Did the user pass a custom backend?
  if (cachedBackend === null) {
    // Explicitly disabled.
    return placeholder;
  } else if (cachedBackend === undefined) {
    // One hasn't been made yet, so default to Node.
    cachedBackend = getNodeBackend();
  }

  // Look for the GCP debug variable shared across languages.
  // Not sure what the format of this will be yet.
  const gcpEnv = (process.env['GCP_DEBUG'] ?? '').split(',');

  const logOutput = cachedBackend.makeLogger(namespace);
  cachedBackend.addEnables(gcpEnv);

  const logger = new AdhocDebugLogger(logOutput);
  loggerCache.set(namespace, logger);
  return logger.func;
}
