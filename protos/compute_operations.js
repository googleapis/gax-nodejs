/**
 * Copyright 2022 Google LLC
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

/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
(function(global, factory) { /* global define, require, module */

    /* AMD */ if (typeof define === 'function' && define.amd)
        define(["protobufjs/minimal"], factory);

    /* CommonJS */ else if (typeof require === 'function' && typeof module === 'object' && module && module.exports)
        module.exports = factory(require("protobufjs/minimal"));

})(this, function($protobuf) {
    "use strict";

    // Common aliases
    var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

    // Exported root namespace
    var $root = $protobuf.roots.compute_operations_protos || ($protobuf.roots.compute_operations_protos = {});

    $root.Operation = (function() {

        /**
         * Properties of an Operation.
         * @exports IOperation
         * @interface IOperation
         * @property {string|null} [clientOperationId] Operation clientOperationId
         * @property {string|null} [creationTimestamp] Operation creationTimestamp
         * @property {string|null} [description] Operation description
         * @property {string|null} [endTime] Operation endTime
         * @property {IError|null} [error] Operation error
         * @property {string|null} [httpErrorMessage] Operation httpErrorMessage
         * @property {number|null} [httpErrorStatusCode] Operation httpErrorStatusCode
         * @property {number|Long|null} [id] Operation id
         * @property {string|null} [insertTime] Operation insertTime
         * @property {string|null} [kind] Operation kind
         * @property {string|null} [name] Operation name
         * @property {string|null} [operationGroupId] Operation operationGroupId
         * @property {string|null} [operationType] Operation operationType
         * @property {number|null} [progress] Operation progress
         * @property {string|null} [region] Operation region
         * @property {string|null} [selfLink] Operation selfLink
         * @property {string|null} [startTime] Operation startTime
         * @property {Operation.Status|null} [status] Operation status
         * @property {string|null} [statusMessage] Operation statusMessage
         * @property {number|Long|null} [targetId] Operation targetId
         * @property {string|null} [targetLink] Operation targetLink
         * @property {string|null} [user] Operation user
         * @property {Array.<IWarnings>|null} [warnings] Operation warnings
         * @property {string|null} [zone] Operation zone
         */

        /**
         * Constructs a new Operation.
         * @exports Operation
         * @classdesc Represents an Operation.
         * @implements IOperation
         * @constructor
         * @param {IOperation=} [properties] Properties to set
         */
        function Operation(properties) {
            this.warnings = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Operation clientOperationId.
         * @member {string} clientOperationId
         * @memberof Operation
         * @instance
         */
        Operation.prototype.clientOperationId = "";

        /**
         * Operation creationTimestamp.
         * @member {string} creationTimestamp
         * @memberof Operation
         * @instance
         */
        Operation.prototype.creationTimestamp = "";

        /**
         * Operation description.
         * @member {string} description
         * @memberof Operation
         * @instance
         */
        Operation.prototype.description = "";

        /**
         * Operation endTime.
         * @member {string} endTime
         * @memberof Operation
         * @instance
         */
        Operation.prototype.endTime = "";

        /**
         * Operation error.
         * @member {IError|null|undefined} error
         * @memberof Operation
         * @instance
         */
        Operation.prototype.error = null;

        /**
         * Operation httpErrorMessage.
         * @member {string} httpErrorMessage
         * @memberof Operation
         * @instance
         */
        Operation.prototype.httpErrorMessage = "";

        /**
         * Operation httpErrorStatusCode.
         * @member {number} httpErrorStatusCode
         * @memberof Operation
         * @instance
         */
        Operation.prototype.httpErrorStatusCode = 0;

        /**
         * Operation id.
         * @member {number|Long} id
         * @memberof Operation
         * @instance
         */
        Operation.prototype.id = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * Operation insertTime.
         * @member {string} insertTime
         * @memberof Operation
         * @instance
         */
        Operation.prototype.insertTime = "";

        /**
         * Operation kind.
         * @member {string} kind
         * @memberof Operation
         * @instance
         */
        Operation.prototype.kind = "";

        /**
         * Operation name.
         * @member {string} name
         * @memberof Operation
         * @instance
         */
        Operation.prototype.name = "";

        /**
         * Operation operationGroupId.
         * @member {string} operationGroupId
         * @memberof Operation
         * @instance
         */
        Operation.prototype.operationGroupId = "";

        /**
         * Operation operationType.
         * @member {string} operationType
         * @memberof Operation
         * @instance
         */
        Operation.prototype.operationType = "";

        /**
         * Operation progress.
         * @member {number} progress
         * @memberof Operation
         * @instance
         */
        Operation.prototype.progress = 0;

        /**
         * Operation region.
         * @member {string} region
         * @memberof Operation
         * @instance
         */
        Operation.prototype.region = "";

        /**
         * Operation selfLink.
         * @member {string} selfLink
         * @memberof Operation
         * @instance
         */
        Operation.prototype.selfLink = "";

        /**
         * Operation startTime.
         * @member {string} startTime
         * @memberof Operation
         * @instance
         */
        Operation.prototype.startTime = "";

        /**
         * Operation status.
         * @member {Operation.Status} status
         * @memberof Operation
         * @instance
         */
        Operation.prototype.status = 0;

        /**
         * Operation statusMessage.
         * @member {string} statusMessage
         * @memberof Operation
         * @instance
         */
        Operation.prototype.statusMessage = "";

        /**
         * Operation targetId.
         * @member {number|Long} targetId
         * @memberof Operation
         * @instance
         */
        Operation.prototype.targetId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * Operation targetLink.
         * @member {string} targetLink
         * @memberof Operation
         * @instance
         */
        Operation.prototype.targetLink = "";

        /**
         * Operation user.
         * @member {string} user
         * @memberof Operation
         * @instance
         */
        Operation.prototype.user = "";

        /**
         * Operation warnings.
         * @member {Array.<IWarnings>} warnings
         * @memberof Operation
         * @instance
         */
        Operation.prototype.warnings = $util.emptyArray;

        /**
         * Operation zone.
         * @member {string} zone
         * @memberof Operation
         * @instance
         */
        Operation.prototype.zone = "";

        /**
         * Creates a new Operation instance using the specified properties.
         * @function create
         * @memberof Operation
         * @static
         * @param {IOperation=} [properties] Properties to set
         * @returns {Operation} Operation instance
         */
        Operation.create = function create(properties) {
            return new Operation(properties);
        };

        /**
         * Encodes the specified Operation message. Does not implicitly {@link Operation.verify|verify} messages.
         * @function encode
         * @memberof Operation
         * @static
         * @param {IOperation} message Operation message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Operation.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                writer.uint32(/* id 3355, wireType 0 =*/26840).uint64(message.id);
            if (message.kind != null && Object.hasOwnProperty.call(message, "kind"))
                writer.uint32(/* id 3292052, wireType 2 =*/26336418).string(message.kind);
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 3373707, wireType 2 =*/26989658).string(message.name);
            if (message.user != null && Object.hasOwnProperty.call(message, "user"))
                writer.uint32(/* id 3599307, wireType 2 =*/28794458).string(message.user);
            if (message.zone != null && Object.hasOwnProperty.call(message, "zone"))
                writer.uint32(/* id 3744684, wireType 2 =*/29957474).string(message.zone);
            if (message.creationTimestamp != null && Object.hasOwnProperty.call(message, "creationTimestamp"))
                writer.uint32(/* id 30525366, wireType 2 =*/244202930).string(message.creationTimestamp);
            if (message.startTime != null && Object.hasOwnProperty.call(message, "startTime"))
                writer.uint32(/* id 37467274, wireType 2 =*/299738194).string(message.startTime);
            if (message.operationGroupId != null && Object.hasOwnProperty.call(message, "operationGroupId"))
                writer.uint32(/* id 40171187, wireType 2 =*/321369498).string(message.operationGroupId);
            if (message.targetLink != null && Object.hasOwnProperty.call(message, "targetLink"))
                writer.uint32(/* id 62671336, wireType 2 =*/501370690).string(message.targetLink);
            if (message.progress != null && Object.hasOwnProperty.call(message, "progress"))
                writer.uint32(/* id 72663597, wireType 0 =*/581308776).int32(message.progress);
            if (message.error != null && Object.hasOwnProperty.call(message, "error"))
                $root.Error.encode(message.error, writer.uint32(/* id 96784904, wireType 2 =*/774279234).fork()).ldelim();
            if (message.endTime != null && Object.hasOwnProperty.call(message, "endTime"))
                writer.uint32(/* id 114938801, wireType 2 =*/919510410).string(message.endTime);
            if (message.region != null && Object.hasOwnProperty.call(message, "region"))
                writer.uint32(/* id 138946292, wireType 2 =*/1111570338).string(message.region);
            if (message.operationType != null && Object.hasOwnProperty.call(message, "operationType"))
                writer.uint32(/* id 177650450, wireType 2 =*/1421203602).string(message.operationType);
            if (message.status != null && Object.hasOwnProperty.call(message, "status"))
                writer.uint32(/* id 181260274, wireType 0 =*/1450082192).int32(message.status);
            if (message.httpErrorMessage != null && Object.hasOwnProperty.call(message, "httpErrorMessage"))
                writer.uint32(/* id 202521945, wireType 2 =*/1620175562).string(message.httpErrorMessage);
            if (message.targetId != null && Object.hasOwnProperty.call(message, "targetId"))
                writer.uint32(/* id 258165385, wireType 0 =*/2065323080).uint64(message.targetId);
            if (message.clientOperationId != null && Object.hasOwnProperty.call(message, "clientOperationId"))
                writer.uint32(/* id 297240295, wireType 2 =*/2377922362).string(message.clientOperationId);
            if (message.statusMessage != null && Object.hasOwnProperty.call(message, "statusMessage"))
                writer.uint32(/* id 297428154, wireType 2 =*/2379425234).string(message.statusMessage);
            if (message.httpErrorStatusCode != null && Object.hasOwnProperty.call(message, "httpErrorStatusCode"))
                writer.uint32(/* id 312345196, wireType 0 =*/2498761568).int32(message.httpErrorStatusCode);
            if (message.description != null && Object.hasOwnProperty.call(message, "description"))
                writer.uint32(/* id 422937596, wireType 2 =*/3383500770).string(message.description);
            if (message.insertTime != null && Object.hasOwnProperty.call(message, "insertTime"))
                writer.uint32(/* id 433722515, wireType 2 =*/3469780122).string(message.insertTime);
            if (message.selfLink != null && Object.hasOwnProperty.call(message, "selfLink"))
                writer.uint32(/* id 456214797, wireType 2 =*/3649718378).string(message.selfLink);
            if (message.warnings != null && message.warnings.length)
                for (var i = 0; i < message.warnings.length; ++i)
                    $root.Warnings.encode(message.warnings[i], writer.uint32(/* id 498091095, wireType 2 =*/3984728762).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified Operation message, length delimited. Does not implicitly {@link Operation.verify|verify} messages.
         * @function encodeDelimited
         * @memberof Operation
         * @static
         * @param {IOperation} message Operation message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Operation.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an Operation message from the specified reader or buffer.
         * @function decode
         * @memberof Operation
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Operation} Operation
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Operation.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Operation();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 297240295:
                    message.clientOperationId = reader.string();
                    break;
                case 30525366:
                    message.creationTimestamp = reader.string();
                    break;
                case 422937596:
                    message.description = reader.string();
                    break;
                case 114938801:
                    message.endTime = reader.string();
                    break;
                case 96784904:
                    message.error = $root.Error.decode(reader, reader.uint32());
                    break;
                case 202521945:
                    message.httpErrorMessage = reader.string();
                    break;
                case 312345196:
                    message.httpErrorStatusCode = reader.int32();
                    break;
                case 3355:
                    message.id = reader.uint64();
                    break;
                case 433722515:
                    message.insertTime = reader.string();
                    break;
                case 3292052:
                    message.kind = reader.string();
                    break;
                case 3373707:
                    message.name = reader.string();
                    break;
                case 40171187:
                    message.operationGroupId = reader.string();
                    break;
                case 177650450:
                    message.operationType = reader.string();
                    break;
                case 72663597:
                    message.progress = reader.int32();
                    break;
                case 138946292:
                    message.region = reader.string();
                    break;
                case 456214797:
                    message.selfLink = reader.string();
                    break;
                case 37467274:
                    message.startTime = reader.string();
                    break;
                case 181260274:
                    message.status = reader.int32();
                    break;
                case 297428154:
                    message.statusMessage = reader.string();
                    break;
                case 258165385:
                    message.targetId = reader.uint64();
                    break;
                case 62671336:
                    message.targetLink = reader.string();
                    break;
                case 3599307:
                    message.user = reader.string();
                    break;
                case 498091095:
                    if (!(message.warnings && message.warnings.length))
                        message.warnings = [];
                    message.warnings.push($root.Warnings.decode(reader, reader.uint32()));
                    break;
                case 3744684:
                    message.zone = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an Operation message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof Operation
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {Operation} Operation
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Operation.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an Operation message.
         * @function verify
         * @memberof Operation
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Operation.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.clientOperationId != null && message.hasOwnProperty("clientOperationId"))
                if (!$util.isString(message.clientOperationId))
                    return "clientOperationId: string expected";
            if (message.creationTimestamp != null && message.hasOwnProperty("creationTimestamp"))
                if (!$util.isString(message.creationTimestamp))
                    return "creationTimestamp: string expected";
            if (message.description != null && message.hasOwnProperty("description"))
                if (!$util.isString(message.description))
                    return "description: string expected";
            if (message.endTime != null && message.hasOwnProperty("endTime"))
                if (!$util.isString(message.endTime))
                    return "endTime: string expected";
            if (message.error != null && message.hasOwnProperty("error")) {
                var error = $root.Error.verify(message.error);
                if (error)
                    return "error." + error;
            }
            if (message.httpErrorMessage != null && message.hasOwnProperty("httpErrorMessage"))
                if (!$util.isString(message.httpErrorMessage))
                    return "httpErrorMessage: string expected";
            if (message.httpErrorStatusCode != null && message.hasOwnProperty("httpErrorStatusCode"))
                if (!$util.isInteger(message.httpErrorStatusCode))
                    return "httpErrorStatusCode: integer expected";
            if (message.id != null && message.hasOwnProperty("id"))
                if (!$util.isInteger(message.id) && !(message.id && $util.isInteger(message.id.low) && $util.isInteger(message.id.high)))
                    return "id: integer|Long expected";
            if (message.insertTime != null && message.hasOwnProperty("insertTime"))
                if (!$util.isString(message.insertTime))
                    return "insertTime: string expected";
            if (message.kind != null && message.hasOwnProperty("kind"))
                if (!$util.isString(message.kind))
                    return "kind: string expected";
            if (message.name != null && message.hasOwnProperty("name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            if (message.operationGroupId != null && message.hasOwnProperty("operationGroupId"))
                if (!$util.isString(message.operationGroupId))
                    return "operationGroupId: string expected";
            if (message.operationType != null && message.hasOwnProperty("operationType"))
                if (!$util.isString(message.operationType))
                    return "operationType: string expected";
            if (message.progress != null && message.hasOwnProperty("progress"))
                if (!$util.isInteger(message.progress))
                    return "progress: integer expected";
            if (message.region != null && message.hasOwnProperty("region"))
                if (!$util.isString(message.region))
                    return "region: string expected";
            if (message.selfLink != null && message.hasOwnProperty("selfLink"))
                if (!$util.isString(message.selfLink))
                    return "selfLink: string expected";
            if (message.startTime != null && message.hasOwnProperty("startTime"))
                if (!$util.isString(message.startTime))
                    return "startTime: string expected";
            if (message.status != null && message.hasOwnProperty("status"))
                switch (message.status) {
                default:
                    return "status: enum value expected";
                case 0:
                case 2104194:
                case 35394935:
                case 121282975:
                    break;
                }
            if (message.statusMessage != null && message.hasOwnProperty("statusMessage"))
                if (!$util.isString(message.statusMessage))
                    return "statusMessage: string expected";
            if (message.targetId != null && message.hasOwnProperty("targetId"))
                if (!$util.isInteger(message.targetId) && !(message.targetId && $util.isInteger(message.targetId.low) && $util.isInteger(message.targetId.high)))
                    return "targetId: integer|Long expected";
            if (message.targetLink != null && message.hasOwnProperty("targetLink"))
                if (!$util.isString(message.targetLink))
                    return "targetLink: string expected";
            if (message.user != null && message.hasOwnProperty("user"))
                if (!$util.isString(message.user))
                    return "user: string expected";
            if (message.warnings != null && message.hasOwnProperty("warnings")) {
                if (!Array.isArray(message.warnings))
                    return "warnings: array expected";
                for (var i = 0; i < message.warnings.length; ++i) {
                    var error = $root.Warnings.verify(message.warnings[i]);
                    if (error)
                        return "warnings." + error;
                }
            }
            if (message.zone != null && message.hasOwnProperty("zone"))
                if (!$util.isString(message.zone))
                    return "zone: string expected";
            return null;
        };

        /**
         * Creates an Operation message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof Operation
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {Operation} Operation
         */
        Operation.fromObject = function fromObject(object) {
            if (object instanceof $root.Operation)
                return object;
            var message = new $root.Operation();
            if (object.clientOperationId != null)
                message.clientOperationId = String(object.clientOperationId);
            if (object.creationTimestamp != null)
                message.creationTimestamp = String(object.creationTimestamp);
            if (object.description != null)
                message.description = String(object.description);
            if (object.endTime != null)
                message.endTime = String(object.endTime);
            if (object.error != null) {
                if (typeof object.error !== "object")
                    throw TypeError(".Operation.error: object expected");
                message.error = $root.Error.fromObject(object.error);
            }
            if (object.httpErrorMessage != null)
                message.httpErrorMessage = String(object.httpErrorMessage);
            if (object.httpErrorStatusCode != null)
                message.httpErrorStatusCode = object.httpErrorStatusCode | 0;
            if (object.id != null)
                if ($util.Long)
                    (message.id = $util.Long.fromValue(object.id)).unsigned = true;
                else if (typeof object.id === "string")
                    message.id = parseInt(object.id, 10);
                else if (typeof object.id === "number")
                    message.id = object.id;
                else if (typeof object.id === "object")
                    message.id = new $util.LongBits(object.id.low >>> 0, object.id.high >>> 0).toNumber(true);
            if (object.insertTime != null)
                message.insertTime = String(object.insertTime);
            if (object.kind != null)
                message.kind = String(object.kind);
            if (object.name != null)
                message.name = String(object.name);
            if (object.operationGroupId != null)
                message.operationGroupId = String(object.operationGroupId);
            if (object.operationType != null)
                message.operationType = String(object.operationType);
            if (object.progress != null)
                message.progress = object.progress | 0;
            if (object.region != null)
                message.region = String(object.region);
            if (object.selfLink != null)
                message.selfLink = String(object.selfLink);
            if (object.startTime != null)
                message.startTime = String(object.startTime);
            switch (object.status) {
            case "UNDEFINED_STATUS":
            case 0:
                message.status = 0;
                break;
            case "DONE":
            case 2104194:
                message.status = 2104194;
                break;
            case "PENDING":
            case 35394935:
                message.status = 35394935;
                break;
            case "RUNNING":
            case 121282975:
                message.status = 121282975;
                break;
            }
            if (object.statusMessage != null)
                message.statusMessage = String(object.statusMessage);
            if (object.targetId != null)
                if ($util.Long)
                    (message.targetId = $util.Long.fromValue(object.targetId)).unsigned = true;
                else if (typeof object.targetId === "string")
                    message.targetId = parseInt(object.targetId, 10);
                else if (typeof object.targetId === "number")
                    message.targetId = object.targetId;
                else if (typeof object.targetId === "object")
                    message.targetId = new $util.LongBits(object.targetId.low >>> 0, object.targetId.high >>> 0).toNumber(true);
            if (object.targetLink != null)
                message.targetLink = String(object.targetLink);
            if (object.user != null)
                message.user = String(object.user);
            if (object.warnings) {
                if (!Array.isArray(object.warnings))
                    throw TypeError(".Operation.warnings: array expected");
                message.warnings = [];
                for (var i = 0; i < object.warnings.length; ++i) {
                    if (typeof object.warnings[i] !== "object")
                        throw TypeError(".Operation.warnings: object expected");
                    message.warnings[i] = $root.Warnings.fromObject(object.warnings[i]);
                }
            }
            if (object.zone != null)
                message.zone = String(object.zone);
            return message;
        };

        /**
         * Creates a plain object from an Operation message. Also converts values to other types if specified.
         * @function toObject
         * @memberof Operation
         * @static
         * @param {Operation} message Operation
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Operation.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.warnings = [];
            if (options.defaults) {
                if ($util.Long) {
                    var long = new $util.Long(0, 0, true);
                    object.id = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.id = options.longs === String ? "0" : 0;
                object.kind = "";
                object.name = "";
                object.user = "";
                object.zone = "";
                object.creationTimestamp = "";
                object.startTime = "";
                object.operationGroupId = "";
                object.targetLink = "";
                object.progress = 0;
                object.error = null;
                object.endTime = "";
                object.region = "";
                object.operationType = "";
                object.status = options.enums === String ? "UNDEFINED_STATUS" : 0;
                object.httpErrorMessage = "";
                if ($util.Long) {
                    var long = new $util.Long(0, 0, true);
                    object.targetId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.targetId = options.longs === String ? "0" : 0;
                object.clientOperationId = "";
                object.statusMessage = "";
                object.httpErrorStatusCode = 0;
                object.description = "";
                object.insertTime = "";
                object.selfLink = "";
            }
            if (message.id != null && message.hasOwnProperty("id"))
                if (typeof message.id === "number")
                    object.id = options.longs === String ? String(message.id) : message.id;
                else
                    object.id = options.longs === String ? $util.Long.prototype.toString.call(message.id) : options.longs === Number ? new $util.LongBits(message.id.low >>> 0, message.id.high >>> 0).toNumber(true) : message.id;
            if (message.kind != null && message.hasOwnProperty("kind"))
                object.kind = message.kind;
            if (message.name != null && message.hasOwnProperty("name"))
                object.name = message.name;
            if (message.user != null && message.hasOwnProperty("user"))
                object.user = message.user;
            if (message.zone != null && message.hasOwnProperty("zone"))
                object.zone = message.zone;
            if (message.creationTimestamp != null && message.hasOwnProperty("creationTimestamp"))
                object.creationTimestamp = message.creationTimestamp;
            if (message.startTime != null && message.hasOwnProperty("startTime"))
                object.startTime = message.startTime;
            if (message.operationGroupId != null && message.hasOwnProperty("operationGroupId"))
                object.operationGroupId = message.operationGroupId;
            if (message.targetLink != null && message.hasOwnProperty("targetLink"))
                object.targetLink = message.targetLink;
            if (message.progress != null && message.hasOwnProperty("progress"))
                object.progress = message.progress;
            if (message.error != null && message.hasOwnProperty("error"))
                object.error = $root.Error.toObject(message.error, options);
            if (message.endTime != null && message.hasOwnProperty("endTime"))
                object.endTime = message.endTime;
            if (message.region != null && message.hasOwnProperty("region"))
                object.region = message.region;
            if (message.operationType != null && message.hasOwnProperty("operationType"))
                object.operationType = message.operationType;
            if (message.status != null && message.hasOwnProperty("status"))
                object.status = options.enums === String ? $root.Operation.Status[message.status] : message.status;
            if (message.httpErrorMessage != null && message.hasOwnProperty("httpErrorMessage"))
                object.httpErrorMessage = message.httpErrorMessage;
            if (message.targetId != null && message.hasOwnProperty("targetId"))
                if (typeof message.targetId === "number")
                    object.targetId = options.longs === String ? String(message.targetId) : message.targetId;
                else
                    object.targetId = options.longs === String ? $util.Long.prototype.toString.call(message.targetId) : options.longs === Number ? new $util.LongBits(message.targetId.low >>> 0, message.targetId.high >>> 0).toNumber(true) : message.targetId;
            if (message.clientOperationId != null && message.hasOwnProperty("clientOperationId"))
                object.clientOperationId = message.clientOperationId;
            if (message.statusMessage != null && message.hasOwnProperty("statusMessage"))
                object.statusMessage = message.statusMessage;
            if (message.httpErrorStatusCode != null && message.hasOwnProperty("httpErrorStatusCode"))
                object.httpErrorStatusCode = message.httpErrorStatusCode;
            if (message.description != null && message.hasOwnProperty("description"))
                object.description = message.description;
            if (message.insertTime != null && message.hasOwnProperty("insertTime"))
                object.insertTime = message.insertTime;
            if (message.selfLink != null && message.hasOwnProperty("selfLink"))
                object.selfLink = message.selfLink;
            if (message.warnings && message.warnings.length) {
                object.warnings = [];
                for (var j = 0; j < message.warnings.length; ++j)
                    object.warnings[j] = $root.Warnings.toObject(message.warnings[j], options);
            }
            return object;
        };

        /**
         * Converts this Operation to JSON.
         * @function toJSON
         * @memberof Operation
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Operation.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Status enum.
         * @name Operation.Status
         * @enum {number}
         * @property {number} UNDEFINED_STATUS=0 UNDEFINED_STATUS value
         * @property {number} DONE=2104194 DONE value
         * @property {number} PENDING=35394935 PENDING value
         * @property {number} RUNNING=121282975 RUNNING value
         */
        Operation.Status = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "UNDEFINED_STATUS"] = 0;
            values[valuesById[2104194] = "DONE"] = 2104194;
            values[valuesById[35394935] = "PENDING"] = 35394935;
            values[valuesById[121282975] = "RUNNING"] = 121282975;
            return values;
        })();

        return Operation;
    })();

    $root.Warnings = (function() {

        /**
         * Properties of a Warnings.
         * @exports IWarnings
         * @interface IWarnings
         * @property {string|null} [code] Warnings code
         * @property {Array.<IData>|null} [data] Warnings data
         * @property {string|null} [message] Warnings message
         */

        /**
         * Constructs a new Warnings.
         * @exports Warnings
         * @classdesc Represents a Warnings.
         * @implements IWarnings
         * @constructor
         * @param {IWarnings=} [properties] Properties to set
         */
        function Warnings(properties) {
            this.data = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Warnings code.
         * @member {string} code
         * @memberof Warnings
         * @instance
         */
        Warnings.prototype.code = "";

        /**
         * Warnings data.
         * @member {Array.<IData>} data
         * @memberof Warnings
         * @instance
         */
        Warnings.prototype.data = $util.emptyArray;

        /**
         * Warnings message.
         * @member {string} message
         * @memberof Warnings
         * @instance
         */
        Warnings.prototype.message = "";

        /**
         * Creates a new Warnings instance using the specified properties.
         * @function create
         * @memberof Warnings
         * @static
         * @param {IWarnings=} [properties] Properties to set
         * @returns {Warnings} Warnings instance
         */
        Warnings.create = function create(properties) {
            return new Warnings(properties);
        };

        /**
         * Encodes the specified Warnings message. Does not implicitly {@link Warnings.verify|verify} messages.
         * @function encode
         * @memberof Warnings
         * @static
         * @param {IWarnings} message Warnings message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Warnings.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.code != null && Object.hasOwnProperty.call(message, "code"))
                writer.uint32(/* id 3059181, wireType 2 =*/24473450).string(message.code);
            if (message.data != null && message.data.length)
                for (var i = 0; i < message.data.length; ++i)
                    $root.Data.encode(message.data[i], writer.uint32(/* id 3076010, wireType 2 =*/24608082).fork()).ldelim();
            if (message.message != null && Object.hasOwnProperty.call(message, "message"))
                writer.uint32(/* id 418054151, wireType 2 =*/3344433210).string(message.message);
            return writer;
        };

        /**
         * Encodes the specified Warnings message, length delimited. Does not implicitly {@link Warnings.verify|verify} messages.
         * @function encodeDelimited
         * @memberof Warnings
         * @static
         * @param {IWarnings} message Warnings message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Warnings.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Warnings message from the specified reader or buffer.
         * @function decode
         * @memberof Warnings
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Warnings} Warnings
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Warnings.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Warnings();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 3059181:
                    message.code = reader.string();
                    break;
                case 3076010:
                    if (!(message.data && message.data.length))
                        message.data = [];
                    message.data.push($root.Data.decode(reader, reader.uint32()));
                    break;
                case 418054151:
                    message.message = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Warnings message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof Warnings
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {Warnings} Warnings
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Warnings.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Warnings message.
         * @function verify
         * @memberof Warnings
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Warnings.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.code != null && message.hasOwnProperty("code"))
                if (!$util.isString(message.code))
                    return "code: string expected";
            if (message.data != null && message.hasOwnProperty("data")) {
                if (!Array.isArray(message.data))
                    return "data: array expected";
                for (var i = 0; i < message.data.length; ++i) {
                    var error = $root.Data.verify(message.data[i]);
                    if (error)
                        return "data." + error;
                }
            }
            if (message.message != null && message.hasOwnProperty("message"))
                if (!$util.isString(message.message))
                    return "message: string expected";
            return null;
        };

        /**
         * Creates a Warnings message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof Warnings
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {Warnings} Warnings
         */
        Warnings.fromObject = function fromObject(object) {
            if (object instanceof $root.Warnings)
                return object;
            var message = new $root.Warnings();
            if (object.code != null)
                message.code = String(object.code);
            if (object.data) {
                if (!Array.isArray(object.data))
                    throw TypeError(".Warnings.data: array expected");
                message.data = [];
                for (var i = 0; i < object.data.length; ++i) {
                    if (typeof object.data[i] !== "object")
                        throw TypeError(".Warnings.data: object expected");
                    message.data[i] = $root.Data.fromObject(object.data[i]);
                }
            }
            if (object.message != null)
                message.message = String(object.message);
            return message;
        };

        /**
         * Creates a plain object from a Warnings message. Also converts values to other types if specified.
         * @function toObject
         * @memberof Warnings
         * @static
         * @param {Warnings} message Warnings
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Warnings.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.data = [];
            if (options.defaults) {
                object.code = "";
                object.message = "";
            }
            if (message.code != null && message.hasOwnProperty("code"))
                object.code = message.code;
            if (message.data && message.data.length) {
                object.data = [];
                for (var j = 0; j < message.data.length; ++j)
                    object.data[j] = $root.Data.toObject(message.data[j], options);
            }
            if (message.message != null && message.hasOwnProperty("message"))
                object.message = message.message;
            return object;
        };

        /**
         * Converts this Warnings to JSON.
         * @function toJSON
         * @memberof Warnings
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Warnings.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Code enum.
         * @name Warnings.Code
         * @enum {number}
         * @property {number} UNDEFINED_CODE=0 UNDEFINED_CODE value
         * @property {number} CLEANUP_FAILED=150308440 CLEANUP_FAILED value
         * @property {number} DEPRECATED_RESOURCE_USED=391835586 DEPRECATED_RESOURCE_USED value
         * @property {number} DEPRECATED_TYPE_USED=346526230 DEPRECATED_TYPE_USED value
         * @property {number} DISK_SIZE_LARGER_THAN_IMAGE_SIZE=369442967 DISK_SIZE_LARGER_THAN_IMAGE_SIZE value
         * @property {number} EXPERIMENTAL_TYPE_USED=451954443 EXPERIMENTAL_TYPE_USED value
         * @property {number} EXTERNAL_API_WARNING=175546307 EXTERNAL_API_WARNING value
         * @property {number} FIELD_VALUE_OVERRIDEN=329669423 FIELD_VALUE_OVERRIDEN value
         * @property {number} INJECTED_KERNELS_DEPRECATED=417377419 INJECTED_KERNELS_DEPRECATED value
         * @property {number} LARGE_DEPLOYMENT_WARNING=481440678 LARGE_DEPLOYMENT_WARNING value
         * @property {number} MISSING_TYPE_DEPENDENCY=344505463 MISSING_TYPE_DEPENDENCY value
         * @property {number} NEXT_HOP_ADDRESS_NOT_ASSIGNED=324964999 NEXT_HOP_ADDRESS_NOT_ASSIGNED value
         * @property {number} NEXT_HOP_CANNOT_IP_FORWARD=383382887 NEXT_HOP_CANNOT_IP_FORWARD value
         * @property {number} NEXT_HOP_INSTANCE_NOT_FOUND=464250446 NEXT_HOP_INSTANCE_NOT_FOUND value
         * @property {number} NEXT_HOP_INSTANCE_NOT_ON_NETWORK=243758146 NEXT_HOP_INSTANCE_NOT_ON_NETWORK value
         * @property {number} NEXT_HOP_NOT_RUNNING=417081265 NEXT_HOP_NOT_RUNNING value
         * @property {number} NOT_CRITICAL_ERROR=105763924 NOT_CRITICAL_ERROR value
         * @property {number} NO_RESULTS_ON_PAGE=30036744 NO_RESULTS_ON_PAGE value
         * @property {number} PARTIAL_SUCCESS=39966469 PARTIAL_SUCCESS value
         * @property {number} REQUIRED_TOS_AGREEMENT=3745539 REQUIRED_TOS_AGREEMENT value
         * @property {number} RESOURCE_IN_USE_BY_OTHER_RESOURCE_WARNING=496728641 RESOURCE_IN_USE_BY_OTHER_RESOURCE_WARNING value
         * @property {number} RESOURCE_NOT_DELETED=168598460 RESOURCE_NOT_DELETED value
         * @property {number} SCHEMA_VALIDATION_IGNORED=275245642 SCHEMA_VALIDATION_IGNORED value
         * @property {number} SINGLE_INSTANCE_PROPERTY_TEMPLATE=268305617 SINGLE_INSTANCE_PROPERTY_TEMPLATE value
         * @property {number} UNDECLARED_PROPERTIES=390513439 UNDECLARED_PROPERTIES value
         * @property {number} UNREACHABLE=13328052 UNREACHABLE value
         */
        Warnings.Code = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "UNDEFINED_CODE"] = 0;
            values[valuesById[150308440] = "CLEANUP_FAILED"] = 150308440;
            values[valuesById[391835586] = "DEPRECATED_RESOURCE_USED"] = 391835586;
            values[valuesById[346526230] = "DEPRECATED_TYPE_USED"] = 346526230;
            values[valuesById[369442967] = "DISK_SIZE_LARGER_THAN_IMAGE_SIZE"] = 369442967;
            values[valuesById[451954443] = "EXPERIMENTAL_TYPE_USED"] = 451954443;
            values[valuesById[175546307] = "EXTERNAL_API_WARNING"] = 175546307;
            values[valuesById[329669423] = "FIELD_VALUE_OVERRIDEN"] = 329669423;
            values[valuesById[417377419] = "INJECTED_KERNELS_DEPRECATED"] = 417377419;
            values[valuesById[481440678] = "LARGE_DEPLOYMENT_WARNING"] = 481440678;
            values[valuesById[344505463] = "MISSING_TYPE_DEPENDENCY"] = 344505463;
            values[valuesById[324964999] = "NEXT_HOP_ADDRESS_NOT_ASSIGNED"] = 324964999;
            values[valuesById[383382887] = "NEXT_HOP_CANNOT_IP_FORWARD"] = 383382887;
            values[valuesById[464250446] = "NEXT_HOP_INSTANCE_NOT_FOUND"] = 464250446;
            values[valuesById[243758146] = "NEXT_HOP_INSTANCE_NOT_ON_NETWORK"] = 243758146;
            values[valuesById[417081265] = "NEXT_HOP_NOT_RUNNING"] = 417081265;
            values[valuesById[105763924] = "NOT_CRITICAL_ERROR"] = 105763924;
            values[valuesById[30036744] = "NO_RESULTS_ON_PAGE"] = 30036744;
            values[valuesById[39966469] = "PARTIAL_SUCCESS"] = 39966469;
            values[valuesById[3745539] = "REQUIRED_TOS_AGREEMENT"] = 3745539;
            values[valuesById[496728641] = "RESOURCE_IN_USE_BY_OTHER_RESOURCE_WARNING"] = 496728641;
            values[valuesById[168598460] = "RESOURCE_NOT_DELETED"] = 168598460;
            values[valuesById[275245642] = "SCHEMA_VALIDATION_IGNORED"] = 275245642;
            values[valuesById[268305617] = "SINGLE_INSTANCE_PROPERTY_TEMPLATE"] = 268305617;
            values[valuesById[390513439] = "UNDECLARED_PROPERTIES"] = 390513439;
            values[valuesById[13328052] = "UNREACHABLE"] = 13328052;
            return values;
        })();

        return Warnings;
    })();

    $root.Error = (function() {

        /**
         * Properties of an Error.
         * @exports IError
         * @interface IError
         * @property {Array.<IErrors>|null} [errors] Error errors
         */

        /**
         * Constructs a new Error.
         * @exports Error
         * @classdesc Represents an Error.
         * @implements IError
         * @constructor
         * @param {IError=} [properties] Properties to set
         */
        function Error(properties) {
            this.errors = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Error errors.
         * @member {Array.<IErrors>} errors
         * @memberof Error
         * @instance
         */
        Error.prototype.errors = $util.emptyArray;

        /**
         * Creates a new Error instance using the specified properties.
         * @function create
         * @memberof Error
         * @static
         * @param {IError=} [properties] Properties to set
         * @returns {Error} Error instance
         */
        Error.create = function create(properties) {
            return new Error(properties);
        };

        /**
         * Encodes the specified Error message. Does not implicitly {@link Error.verify|verify} messages.
         * @function encode
         * @memberof Error
         * @static
         * @param {IError} message Error message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Error.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.errors != null && message.errors.length)
                for (var i = 0; i < message.errors.length; ++i)
                    $root.Errors.encode(message.errors[i], writer.uint32(/* id 315977579, wireType 2 =*/2527820634).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified Error message, length delimited. Does not implicitly {@link Error.verify|verify} messages.
         * @function encodeDelimited
         * @memberof Error
         * @static
         * @param {IError} message Error message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Error.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an Error message from the specified reader or buffer.
         * @function decode
         * @memberof Error
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Error} Error
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Error.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Error();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 315977579:
                    if (!(message.errors && message.errors.length))
                        message.errors = [];
                    message.errors.push($root.Errors.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an Error message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof Error
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {Error} Error
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Error.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an Error message.
         * @function verify
         * @memberof Error
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Error.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.errors != null && message.hasOwnProperty("errors")) {
                if (!Array.isArray(message.errors))
                    return "errors: array expected";
                for (var i = 0; i < message.errors.length; ++i) {
                    var error = $root.Errors.verify(message.errors[i]);
                    if (error)
                        return "errors." + error;
                }
            }
            return null;
        };

        /**
         * Creates an Error message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof Error
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {Error} Error
         */
        Error.fromObject = function fromObject(object) {
            if (object instanceof $root.Error)
                return object;
            var message = new $root.Error();
            if (object.errors) {
                if (!Array.isArray(object.errors))
                    throw TypeError(".Error.errors: array expected");
                message.errors = [];
                for (var i = 0; i < object.errors.length; ++i) {
                    if (typeof object.errors[i] !== "object")
                        throw TypeError(".Error.errors: object expected");
                    message.errors[i] = $root.Errors.fromObject(object.errors[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from an Error message. Also converts values to other types if specified.
         * @function toObject
         * @memberof Error
         * @static
         * @param {Error} message Error
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Error.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.errors = [];
            if (message.errors && message.errors.length) {
                object.errors = [];
                for (var j = 0; j < message.errors.length; ++j)
                    object.errors[j] = $root.Errors.toObject(message.errors[j], options);
            }
            return object;
        };

        /**
         * Converts this Error to JSON.
         * @function toJSON
         * @memberof Error
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Error.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Error;
    })();

    $root.Errors = (function() {

        /**
         * Properties of an Errors.
         * @exports IErrors
         * @interface IErrors
         * @property {string|null} [code] Errors code
         * @property {string|null} [location] Errors location
         * @property {string|null} [message] Errors message
         */

        /**
         * Constructs a new Errors.
         * @exports Errors
         * @classdesc Represents an Errors.
         * @implements IErrors
         * @constructor
         * @param {IErrors=} [properties] Properties to set
         */
        function Errors(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Errors code.
         * @member {string} code
         * @memberof Errors
         * @instance
         */
        Errors.prototype.code = "";

        /**
         * Errors location.
         * @member {string} location
         * @memberof Errors
         * @instance
         */
        Errors.prototype.location = "";

        /**
         * Errors message.
         * @member {string} message
         * @memberof Errors
         * @instance
         */
        Errors.prototype.message = "";

        /**
         * Creates a new Errors instance using the specified properties.
         * @function create
         * @memberof Errors
         * @static
         * @param {IErrors=} [properties] Properties to set
         * @returns {Errors} Errors instance
         */
        Errors.create = function create(properties) {
            return new Errors(properties);
        };

        /**
         * Encodes the specified Errors message. Does not implicitly {@link Errors.verify|verify} messages.
         * @function encode
         * @memberof Errors
         * @static
         * @param {IErrors} message Errors message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Errors.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.code != null && Object.hasOwnProperty.call(message, "code"))
                writer.uint32(/* id 3059181, wireType 2 =*/24473450).string(message.code);
            if (message.location != null && Object.hasOwnProperty.call(message, "location"))
                writer.uint32(/* id 290430901, wireType 2 =*/2323447210).string(message.location);
            if (message.message != null && Object.hasOwnProperty.call(message, "message"))
                writer.uint32(/* id 418054151, wireType 2 =*/3344433210).string(message.message);
            return writer;
        };

        /**
         * Encodes the specified Errors message, length delimited. Does not implicitly {@link Errors.verify|verify} messages.
         * @function encodeDelimited
         * @memberof Errors
         * @static
         * @param {IErrors} message Errors message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Errors.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an Errors message from the specified reader or buffer.
         * @function decode
         * @memberof Errors
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Errors} Errors
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Errors.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Errors();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 3059181:
                    message.code = reader.string();
                    break;
                case 290430901:
                    message.location = reader.string();
                    break;
                case 418054151:
                    message.message = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an Errors message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof Errors
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {Errors} Errors
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Errors.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an Errors message.
         * @function verify
         * @memberof Errors
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Errors.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.code != null && message.hasOwnProperty("code"))
                if (!$util.isString(message.code))
                    return "code: string expected";
            if (message.location != null && message.hasOwnProperty("location"))
                if (!$util.isString(message.location))
                    return "location: string expected";
            if (message.message != null && message.hasOwnProperty("message"))
                if (!$util.isString(message.message))
                    return "message: string expected";
            return null;
        };

        /**
         * Creates an Errors message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof Errors
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {Errors} Errors
         */
        Errors.fromObject = function fromObject(object) {
            if (object instanceof $root.Errors)
                return object;
            var message = new $root.Errors();
            if (object.code != null)
                message.code = String(object.code);
            if (object.location != null)
                message.location = String(object.location);
            if (object.message != null)
                message.message = String(object.message);
            return message;
        };

        /**
         * Creates a plain object from an Errors message. Also converts values to other types if specified.
         * @function toObject
         * @memberof Errors
         * @static
         * @param {Errors} message Errors
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Errors.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.code = "";
                object.location = "";
                object.message = "";
            }
            if (message.code != null && message.hasOwnProperty("code"))
                object.code = message.code;
            if (message.location != null && message.hasOwnProperty("location"))
                object.location = message.location;
            if (message.message != null && message.hasOwnProperty("message"))
                object.message = message.message;
            return object;
        };

        /**
         * Converts this Errors to JSON.
         * @function toJSON
         * @memberof Errors
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Errors.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Errors;
    })();

    $root.Data = (function() {

        /**
         * Properties of a Data.
         * @exports IData
         * @interface IData
         * @property {string|null} [key] Data key
         * @property {string|null} [value] Data value
         */

        /**
         * Constructs a new Data.
         * @exports Data
         * @classdesc Represents a Data.
         * @implements IData
         * @constructor
         * @param {IData=} [properties] Properties to set
         */
        function Data(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Data key.
         * @member {string} key
         * @memberof Data
         * @instance
         */
        Data.prototype.key = "";

        /**
         * Data value.
         * @member {string} value
         * @memberof Data
         * @instance
         */
        Data.prototype.value = "";

        /**
         * Creates a new Data instance using the specified properties.
         * @function create
         * @memberof Data
         * @static
         * @param {IData=} [properties] Properties to set
         * @returns {Data} Data instance
         */
        Data.create = function create(properties) {
            return new Data(properties);
        };

        /**
         * Encodes the specified Data message. Does not implicitly {@link Data.verify|verify} messages.
         * @function encode
         * @memberof Data
         * @static
         * @param {IData} message Data message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Data.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.key != null && Object.hasOwnProperty.call(message, "key"))
                writer.uint32(/* id 106079, wireType 2 =*/848634).string(message.key);
            if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                writer.uint32(/* id 111972721, wireType 2 =*/895781770).string(message.value);
            return writer;
        };

        /**
         * Encodes the specified Data message, length delimited. Does not implicitly {@link Data.verify|verify} messages.
         * @function encodeDelimited
         * @memberof Data
         * @static
         * @param {IData} message Data message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Data.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Data message from the specified reader or buffer.
         * @function decode
         * @memberof Data
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {Data} Data
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Data.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Data();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 106079:
                    message.key = reader.string();
                    break;
                case 111972721:
                    message.value = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Data message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof Data
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {Data} Data
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Data.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Data message.
         * @function verify
         * @memberof Data
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Data.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.key != null && message.hasOwnProperty("key"))
                if (!$util.isString(message.key))
                    return "key: string expected";
            if (message.value != null && message.hasOwnProperty("value"))
                if (!$util.isString(message.value))
                    return "value: string expected";
            return null;
        };

        /**
         * Creates a Data message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof Data
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {Data} Data
         */
        Data.fromObject = function fromObject(object) {
            if (object instanceof $root.Data)
                return object;
            var message = new $root.Data();
            if (object.key != null)
                message.key = String(object.key);
            if (object.value != null)
                message.value = String(object.value);
            return message;
        };

        /**
         * Creates a plain object from a Data message. Also converts values to other types if specified.
         * @function toObject
         * @memberof Data
         * @static
         * @param {Data} message Data
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Data.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.key = "";
                object.value = "";
            }
            if (message.key != null && message.hasOwnProperty("key"))
                object.key = message.key;
            if (message.value != null && message.hasOwnProperty("value"))
                object.value = message.value;
            return object;
        };

        /**
         * Converts this Data to JSON.
         * @function toJSON
         * @memberof Data
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Data.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Data;
    })();

    return $root;
});
