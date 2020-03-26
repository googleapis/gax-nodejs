// Copyright 2020 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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
    var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});
    
    $root.google = (function() {
    
        /**
         * Namespace google.
         * @exports google
         * @namespace
         */
        var google = {};
    
        google.iam = (function() {
    
            /**
             * Namespace iam.
             * @memberof google
             * @namespace
             */
            var iam = {};
    
            iam.v1 = (function() {
    
                /**
                 * Namespace v1.
                 * @memberof google.iam
                 * @namespace
                 */
                var v1 = {};
    
                v1.Policy = (function() {
    
                    /**
                     * Properties of a Policy.
                     * @memberof google.iam.v1
                     * @interface IPolicy
                     * @property {number|null} [version] Policy version
                     * @property {Array.<google.iam.v1.IBinding>|null} [bindings] Policy bindings
                     * @property {Uint8Array|null} [etag] Policy etag
                     */
    
                    /**
                     * Constructs a new Policy.
                     * @memberof google.iam.v1
                     * @classdesc Represents a Policy.
                     * @implements IPolicy
                     * @constructor
                     * @param {google.iam.v1.IPolicy=} [properties] Properties to set
                     */
                    function Policy(properties) {
                        this.bindings = [];
                        if (properties)
                            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }
    
                    /**
                     * Policy version.
                     * @member {number} version
                     * @memberof google.iam.v1.Policy
                     * @instance
                     */
                    Policy.prototype.version = 0;
    
                    /**
                     * Policy bindings.
                     * @member {Array.<google.iam.v1.IBinding>} bindings
                     * @memberof google.iam.v1.Policy
                     * @instance
                     */
                    Policy.prototype.bindings = $util.emptyArray;
    
                    /**
                     * Policy etag.
                     * @member {Uint8Array} etag
                     * @memberof google.iam.v1.Policy
                     * @instance
                     */
                    Policy.prototype.etag = $util.newBuffer([]);
    
                    /**
                     * Creates a new Policy instance using the specified properties.
                     * @function create
                     * @memberof google.iam.v1.Policy
                     * @static
                     * @param {google.iam.v1.IPolicy=} [properties] Properties to set
                     * @returns {google.iam.v1.Policy} Policy instance
                     */
                    Policy.create = function create(properties) {
                        return new Policy(properties);
                    };
    
                    /**
                     * Encodes the specified Policy message. Does not implicitly {@link google.iam.v1.Policy.verify|verify} messages.
                     * @function encode
                     * @memberof google.iam.v1.Policy
                     * @static
                     * @param {google.iam.v1.IPolicy} message Policy message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    Policy.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.version != null && message.hasOwnProperty("version"))
                            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.version);
                        if (message.etag != null && message.hasOwnProperty("etag"))
                            writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.etag);
                        if (message.bindings != null && message.bindings.length)
                            for (var i = 0; i < message.bindings.length; ++i)
                                $root.google.iam.v1.Binding.encode(message.bindings[i], writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                        return writer;
                    };
    
                    /**
                     * Encodes the specified Policy message, length delimited. Does not implicitly {@link google.iam.v1.Policy.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof google.iam.v1.Policy
                     * @static
                     * @param {google.iam.v1.IPolicy} message Policy message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    Policy.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };
    
                    /**
                     * Decodes a Policy message from the specified reader or buffer.
                     * @function decode
                     * @memberof google.iam.v1.Policy
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {google.iam.v1.Policy} Policy
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    Policy.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.iam.v1.Policy();
                        while (reader.pos < end) {
                            var tag = reader.uint32();
                            switch (tag >>> 3) {
                            case 1:
                                message.version = reader.int32();
                                break;
                            case 4:
                                if (!(message.bindings && message.bindings.length))
                                    message.bindings = [];
                                message.bindings.push($root.google.iam.v1.Binding.decode(reader, reader.uint32()));
                                break;
                            case 3:
                                message.etag = reader.bytes();
                                break;
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };
    
                    /**
                     * Decodes a Policy message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof google.iam.v1.Policy
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {google.iam.v1.Policy} Policy
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    Policy.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };
    
                    /**
                     * Verifies a Policy message.
                     * @function verify
                     * @memberof google.iam.v1.Policy
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    Policy.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.version != null && message.hasOwnProperty("version"))
                            if (!$util.isInteger(message.version))
                                return "version: integer expected";
                        if (message.bindings != null && message.hasOwnProperty("bindings")) {
                            if (!Array.isArray(message.bindings))
                                return "bindings: array expected";
                            for (var i = 0; i < message.bindings.length; ++i) {
                                var error = $root.google.iam.v1.Binding.verify(message.bindings[i]);
                                if (error)
                                    return "bindings." + error;
                            }
                        }
                        if (message.etag != null && message.hasOwnProperty("etag"))
                            if (!(message.etag && typeof message.etag.length === "number" || $util.isString(message.etag)))
                                return "etag: buffer expected";
                        return null;
                    };
    
                    /**
                     * Creates a Policy message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof google.iam.v1.Policy
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {google.iam.v1.Policy} Policy
                     */
                    Policy.fromObject = function fromObject(object) {
                        if (object instanceof $root.google.iam.v1.Policy)
                            return object;
                        var message = new $root.google.iam.v1.Policy();
                        if (object.version != null)
                            message.version = object.version | 0;
                        if (object.bindings) {
                            if (!Array.isArray(object.bindings))
                                throw TypeError(".google.iam.v1.Policy.bindings: array expected");
                            message.bindings = [];
                            for (var i = 0; i < object.bindings.length; ++i) {
                                if (typeof object.bindings[i] !== "object")
                                    throw TypeError(".google.iam.v1.Policy.bindings: object expected");
                                message.bindings[i] = $root.google.iam.v1.Binding.fromObject(object.bindings[i]);
                            }
                        }
                        if (object.etag != null)
                            if (typeof object.etag === "string")
                                $util.base64.decode(object.etag, message.etag = $util.newBuffer($util.base64.length(object.etag)), 0);
                            else if (object.etag.length)
                                message.etag = object.etag;
                        return message;
                    };
    
                    /**
                     * Creates a plain object from a Policy message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof google.iam.v1.Policy
                     * @static
                     * @param {google.iam.v1.Policy} message Policy
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    Policy.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        var object = {};
                        if (options.arrays || options.defaults)
                            object.bindings = [];
                        if (options.defaults) {
                            object.version = 0;
                            if (options.bytes === String)
                                object.etag = "";
                            else {
                                object.etag = [];
                                if (options.bytes !== Array)
                                    object.etag = $util.newBuffer(object.etag);
                            }
                        }
                        if (message.version != null && message.hasOwnProperty("version"))
                            object.version = message.version;
                        if (message.etag != null && message.hasOwnProperty("etag"))
                            object.etag = options.bytes === String ? $util.base64.encode(message.etag, 0, message.etag.length) : options.bytes === Array ? Array.prototype.slice.call(message.etag) : message.etag;
                        if (message.bindings && message.bindings.length) {
                            object.bindings = [];
                            for (var j = 0; j < message.bindings.length; ++j)
                                object.bindings[j] = $root.google.iam.v1.Binding.toObject(message.bindings[j], options);
                        }
                        return object;
                    };
    
                    /**
                     * Converts this Policy to JSON.
                     * @function toJSON
                     * @memberof google.iam.v1.Policy
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    Policy.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };
    
                    return Policy;
                })();
    
                v1.Binding = (function() {
    
                    /**
                     * Properties of a Binding.
                     * @memberof google.iam.v1
                     * @interface IBinding
                     * @property {string|null} [role] Binding role
                     * @property {Array.<string>|null} [members] Binding members
                     * @property {google.type.IExpr|null} [condition] Binding condition
                     */
    
                    /**
                     * Constructs a new Binding.
                     * @memberof google.iam.v1
                     * @classdesc Represents a Binding.
                     * @implements IBinding
                     * @constructor
                     * @param {google.iam.v1.IBinding=} [properties] Properties to set
                     */
                    function Binding(properties) {
                        this.members = [];
                        if (properties)
                            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }
    
                    /**
                     * Binding role.
                     * @member {string} role
                     * @memberof google.iam.v1.Binding
                     * @instance
                     */
                    Binding.prototype.role = "";
    
                    /**
                     * Binding members.
                     * @member {Array.<string>} members
                     * @memberof google.iam.v1.Binding
                     * @instance
                     */
                    Binding.prototype.members = $util.emptyArray;
    
                    /**
                     * Binding condition.
                     * @member {google.type.IExpr|null|undefined} condition
                     * @memberof google.iam.v1.Binding
                     * @instance
                     */
                    Binding.prototype.condition = null;
    
                    /**
                     * Creates a new Binding instance using the specified properties.
                     * @function create
                     * @memberof google.iam.v1.Binding
                     * @static
                     * @param {google.iam.v1.IBinding=} [properties] Properties to set
                     * @returns {google.iam.v1.Binding} Binding instance
                     */
                    Binding.create = function create(properties) {
                        return new Binding(properties);
                    };
    
                    /**
                     * Encodes the specified Binding message. Does not implicitly {@link google.iam.v1.Binding.verify|verify} messages.
                     * @function encode
                     * @memberof google.iam.v1.Binding
                     * @static
                     * @param {google.iam.v1.IBinding} message Binding message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    Binding.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.role != null && message.hasOwnProperty("role"))
                            writer.uint32(/* id 1, wireType 2 =*/10).string(message.role);
                        if (message.members != null && message.members.length)
                            for (var i = 0; i < message.members.length; ++i)
                                writer.uint32(/* id 2, wireType 2 =*/18).string(message.members[i]);
                        if (message.condition != null && message.hasOwnProperty("condition"))
                            $root.google.type.Expr.encode(message.condition, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                        return writer;
                    };
    
                    /**
                     * Encodes the specified Binding message, length delimited. Does not implicitly {@link google.iam.v1.Binding.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof google.iam.v1.Binding
                     * @static
                     * @param {google.iam.v1.IBinding} message Binding message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    Binding.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };
    
                    /**
                     * Decodes a Binding message from the specified reader or buffer.
                     * @function decode
                     * @memberof google.iam.v1.Binding
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {google.iam.v1.Binding} Binding
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    Binding.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.iam.v1.Binding();
                        while (reader.pos < end) {
                            var tag = reader.uint32();
                            switch (tag >>> 3) {
                            case 1:
                                message.role = reader.string();
                                break;
                            case 2:
                                if (!(message.members && message.members.length))
                                    message.members = [];
                                message.members.push(reader.string());
                                break;
                            case 3:
                                message.condition = $root.google.type.Expr.decode(reader, reader.uint32());
                                break;
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };
    
                    /**
                     * Decodes a Binding message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof google.iam.v1.Binding
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {google.iam.v1.Binding} Binding
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    Binding.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };
    
                    /**
                     * Verifies a Binding message.
                     * @function verify
                     * @memberof google.iam.v1.Binding
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    Binding.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.role != null && message.hasOwnProperty("role"))
                            if (!$util.isString(message.role))
                                return "role: string expected";
                        if (message.members != null && message.hasOwnProperty("members")) {
                            if (!Array.isArray(message.members))
                                return "members: array expected";
                            for (var i = 0; i < message.members.length; ++i)
                                if (!$util.isString(message.members[i]))
                                    return "members: string[] expected";
                        }
                        if (message.condition != null && message.hasOwnProperty("condition")) {
                            var error = $root.google.type.Expr.verify(message.condition);
                            if (error)
                                return "condition." + error;
                        }
                        return null;
                    };
    
                    /**
                     * Creates a Binding message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof google.iam.v1.Binding
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {google.iam.v1.Binding} Binding
                     */
                    Binding.fromObject = function fromObject(object) {
                        if (object instanceof $root.google.iam.v1.Binding)
                            return object;
                        var message = new $root.google.iam.v1.Binding();
                        if (object.role != null)
                            message.role = String(object.role);
                        if (object.members) {
                            if (!Array.isArray(object.members))
                                throw TypeError(".google.iam.v1.Binding.members: array expected");
                            message.members = [];
                            for (var i = 0; i < object.members.length; ++i)
                                message.members[i] = String(object.members[i]);
                        }
                        if (object.condition != null) {
                            if (typeof object.condition !== "object")
                                throw TypeError(".google.iam.v1.Binding.condition: object expected");
                            message.condition = $root.google.type.Expr.fromObject(object.condition);
                        }
                        return message;
                    };
    
                    /**
                     * Creates a plain object from a Binding message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof google.iam.v1.Binding
                     * @static
                     * @param {google.iam.v1.Binding} message Binding
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    Binding.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        var object = {};
                        if (options.arrays || options.defaults)
                            object.members = [];
                        if (options.defaults) {
                            object.role = "";
                            object.condition = null;
                        }
                        if (message.role != null && message.hasOwnProperty("role"))
                            object.role = message.role;
                        if (message.members && message.members.length) {
                            object.members = [];
                            for (var j = 0; j < message.members.length; ++j)
                                object.members[j] = message.members[j];
                        }
                        if (message.condition != null && message.hasOwnProperty("condition"))
                            object.condition = $root.google.type.Expr.toObject(message.condition, options);
                        return object;
                    };
    
                    /**
                     * Converts this Binding to JSON.
                     * @function toJSON
                     * @memberof google.iam.v1.Binding
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    Binding.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };
    
                    return Binding;
                })();
    
                v1.PolicyDelta = (function() {
    
                    /**
                     * Properties of a PolicyDelta.
                     * @memberof google.iam.v1
                     * @interface IPolicyDelta
                     * @property {Array.<google.iam.v1.IBindingDelta>|null} [bindingDeltas] PolicyDelta bindingDeltas
                     * @property {Array.<google.iam.v1.IAuditConfigDelta>|null} [auditConfigDeltas] PolicyDelta auditConfigDeltas
                     */
    
                    /**
                     * Constructs a new PolicyDelta.
                     * @memberof google.iam.v1
                     * @classdesc Represents a PolicyDelta.
                     * @implements IPolicyDelta
                     * @constructor
                     * @param {google.iam.v1.IPolicyDelta=} [properties] Properties to set
                     */
                    function PolicyDelta(properties) {
                        this.bindingDeltas = [];
                        this.auditConfigDeltas = [];
                        if (properties)
                            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }
    
                    /**
                     * PolicyDelta bindingDeltas.
                     * @member {Array.<google.iam.v1.IBindingDelta>} bindingDeltas
                     * @memberof google.iam.v1.PolicyDelta
                     * @instance
                     */
                    PolicyDelta.prototype.bindingDeltas = $util.emptyArray;
    
                    /**
                     * PolicyDelta auditConfigDeltas.
                     * @member {Array.<google.iam.v1.IAuditConfigDelta>} auditConfigDeltas
                     * @memberof google.iam.v1.PolicyDelta
                     * @instance
                     */
                    PolicyDelta.prototype.auditConfigDeltas = $util.emptyArray;
    
                    /**
                     * Creates a new PolicyDelta instance using the specified properties.
                     * @function create
                     * @memberof google.iam.v1.PolicyDelta
                     * @static
                     * @param {google.iam.v1.IPolicyDelta=} [properties] Properties to set
                     * @returns {google.iam.v1.PolicyDelta} PolicyDelta instance
                     */
                    PolicyDelta.create = function create(properties) {
                        return new PolicyDelta(properties);
                    };
    
                    /**
                     * Encodes the specified PolicyDelta message. Does not implicitly {@link google.iam.v1.PolicyDelta.verify|verify} messages.
                     * @function encode
                     * @memberof google.iam.v1.PolicyDelta
                     * @static
                     * @param {google.iam.v1.IPolicyDelta} message PolicyDelta message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    PolicyDelta.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.bindingDeltas != null && message.bindingDeltas.length)
                            for (var i = 0; i < message.bindingDeltas.length; ++i)
                                $root.google.iam.v1.BindingDelta.encode(message.bindingDeltas[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                        if (message.auditConfigDeltas != null && message.auditConfigDeltas.length)
                            for (var i = 0; i < message.auditConfigDeltas.length; ++i)
                                $root.google.iam.v1.AuditConfigDelta.encode(message.auditConfigDeltas[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                        return writer;
                    };
    
                    /**
                     * Encodes the specified PolicyDelta message, length delimited. Does not implicitly {@link google.iam.v1.PolicyDelta.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof google.iam.v1.PolicyDelta
                     * @static
                     * @param {google.iam.v1.IPolicyDelta} message PolicyDelta message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    PolicyDelta.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };
    
                    /**
                     * Decodes a PolicyDelta message from the specified reader or buffer.
                     * @function decode
                     * @memberof google.iam.v1.PolicyDelta
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {google.iam.v1.PolicyDelta} PolicyDelta
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    PolicyDelta.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.iam.v1.PolicyDelta();
                        while (reader.pos < end) {
                            var tag = reader.uint32();
                            switch (tag >>> 3) {
                            case 1:
                                if (!(message.bindingDeltas && message.bindingDeltas.length))
                                    message.bindingDeltas = [];
                                message.bindingDeltas.push($root.google.iam.v1.BindingDelta.decode(reader, reader.uint32()));
                                break;
                            case 2:
                                if (!(message.auditConfigDeltas && message.auditConfigDeltas.length))
                                    message.auditConfigDeltas = [];
                                message.auditConfigDeltas.push($root.google.iam.v1.AuditConfigDelta.decode(reader, reader.uint32()));
                                break;
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };
    
                    /**
                     * Decodes a PolicyDelta message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof google.iam.v1.PolicyDelta
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {google.iam.v1.PolicyDelta} PolicyDelta
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    PolicyDelta.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };
    
                    /**
                     * Verifies a PolicyDelta message.
                     * @function verify
                     * @memberof google.iam.v1.PolicyDelta
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    PolicyDelta.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.bindingDeltas != null && message.hasOwnProperty("bindingDeltas")) {
                            if (!Array.isArray(message.bindingDeltas))
                                return "bindingDeltas: array expected";
                            for (var i = 0; i < message.bindingDeltas.length; ++i) {
                                var error = $root.google.iam.v1.BindingDelta.verify(message.bindingDeltas[i]);
                                if (error)
                                    return "bindingDeltas." + error;
                            }
                        }
                        if (message.auditConfigDeltas != null && message.hasOwnProperty("auditConfigDeltas")) {
                            if (!Array.isArray(message.auditConfigDeltas))
                                return "auditConfigDeltas: array expected";
                            for (var i = 0; i < message.auditConfigDeltas.length; ++i) {
                                var error = $root.google.iam.v1.AuditConfigDelta.verify(message.auditConfigDeltas[i]);
                                if (error)
                                    return "auditConfigDeltas." + error;
                            }
                        }
                        return null;
                    };
    
                    /**
                     * Creates a PolicyDelta message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof google.iam.v1.PolicyDelta
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {google.iam.v1.PolicyDelta} PolicyDelta
                     */
                    PolicyDelta.fromObject = function fromObject(object) {
                        if (object instanceof $root.google.iam.v1.PolicyDelta)
                            return object;
                        var message = new $root.google.iam.v1.PolicyDelta();
                        if (object.bindingDeltas) {
                            if (!Array.isArray(object.bindingDeltas))
                                throw TypeError(".google.iam.v1.PolicyDelta.bindingDeltas: array expected");
                            message.bindingDeltas = [];
                            for (var i = 0; i < object.bindingDeltas.length; ++i) {
                                if (typeof object.bindingDeltas[i] !== "object")
                                    throw TypeError(".google.iam.v1.PolicyDelta.bindingDeltas: object expected");
                                message.bindingDeltas[i] = $root.google.iam.v1.BindingDelta.fromObject(object.bindingDeltas[i]);
                            }
                        }
                        if (object.auditConfigDeltas) {
                            if (!Array.isArray(object.auditConfigDeltas))
                                throw TypeError(".google.iam.v1.PolicyDelta.auditConfigDeltas: array expected");
                            message.auditConfigDeltas = [];
                            for (var i = 0; i < object.auditConfigDeltas.length; ++i) {
                                if (typeof object.auditConfigDeltas[i] !== "object")
                                    throw TypeError(".google.iam.v1.PolicyDelta.auditConfigDeltas: object expected");
                                message.auditConfigDeltas[i] = $root.google.iam.v1.AuditConfigDelta.fromObject(object.auditConfigDeltas[i]);
                            }
                        }
                        return message;
                    };
    
                    /**
                     * Creates a plain object from a PolicyDelta message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof google.iam.v1.PolicyDelta
                     * @static
                     * @param {google.iam.v1.PolicyDelta} message PolicyDelta
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    PolicyDelta.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        var object = {};
                        if (options.arrays || options.defaults) {
                            object.bindingDeltas = [];
                            object.auditConfigDeltas = [];
                        }
                        if (message.bindingDeltas && message.bindingDeltas.length) {
                            object.bindingDeltas = [];
                            for (var j = 0; j < message.bindingDeltas.length; ++j)
                                object.bindingDeltas[j] = $root.google.iam.v1.BindingDelta.toObject(message.bindingDeltas[j], options);
                        }
                        if (message.auditConfigDeltas && message.auditConfigDeltas.length) {
                            object.auditConfigDeltas = [];
                            for (var j = 0; j < message.auditConfigDeltas.length; ++j)
                                object.auditConfigDeltas[j] = $root.google.iam.v1.AuditConfigDelta.toObject(message.auditConfigDeltas[j], options);
                        }
                        return object;
                    };
    
                    /**
                     * Converts this PolicyDelta to JSON.
                     * @function toJSON
                     * @memberof google.iam.v1.PolicyDelta
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    PolicyDelta.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };
    
                    return PolicyDelta;
                })();
    
                v1.BindingDelta = (function() {
    
                    /**
                     * Properties of a BindingDelta.
                     * @memberof google.iam.v1
                     * @interface IBindingDelta
                     * @property {google.iam.v1.BindingDelta.Action|null} [action] BindingDelta action
                     * @property {string|null} [role] BindingDelta role
                     * @property {string|null} [member] BindingDelta member
                     * @property {google.type.IExpr|null} [condition] BindingDelta condition
                     */
    
                    /**
                     * Constructs a new BindingDelta.
                     * @memberof google.iam.v1
                     * @classdesc Represents a BindingDelta.
                     * @implements IBindingDelta
                     * @constructor
                     * @param {google.iam.v1.IBindingDelta=} [properties] Properties to set
                     */
                    function BindingDelta(properties) {
                        if (properties)
                            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }
    
                    /**
                     * BindingDelta action.
                     * @member {google.iam.v1.BindingDelta.Action} action
                     * @memberof google.iam.v1.BindingDelta
                     * @instance
                     */
                    BindingDelta.prototype.action = 0;
    
                    /**
                     * BindingDelta role.
                     * @member {string} role
                     * @memberof google.iam.v1.BindingDelta
                     * @instance
                     */
                    BindingDelta.prototype.role = "";
    
                    /**
                     * BindingDelta member.
                     * @member {string} member
                     * @memberof google.iam.v1.BindingDelta
                     * @instance
                     */
                    BindingDelta.prototype.member = "";
    
                    /**
                     * BindingDelta condition.
                     * @member {google.type.IExpr|null|undefined} condition
                     * @memberof google.iam.v1.BindingDelta
                     * @instance
                     */
                    BindingDelta.prototype.condition = null;
    
                    /**
                     * Creates a new BindingDelta instance using the specified properties.
                     * @function create
                     * @memberof google.iam.v1.BindingDelta
                     * @static
                     * @param {google.iam.v1.IBindingDelta=} [properties] Properties to set
                     * @returns {google.iam.v1.BindingDelta} BindingDelta instance
                     */
                    BindingDelta.create = function create(properties) {
                        return new BindingDelta(properties);
                    };
    
                    /**
                     * Encodes the specified BindingDelta message. Does not implicitly {@link google.iam.v1.BindingDelta.verify|verify} messages.
                     * @function encode
                     * @memberof google.iam.v1.BindingDelta
                     * @static
                     * @param {google.iam.v1.IBindingDelta} message BindingDelta message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    BindingDelta.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.action != null && message.hasOwnProperty("action"))
                            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.action);
                        if (message.role != null && message.hasOwnProperty("role"))
                            writer.uint32(/* id 2, wireType 2 =*/18).string(message.role);
                        if (message.member != null && message.hasOwnProperty("member"))
                            writer.uint32(/* id 3, wireType 2 =*/26).string(message.member);
                        if (message.condition != null && message.hasOwnProperty("condition"))
                            $root.google.type.Expr.encode(message.condition, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                        return writer;
                    };
    
                    /**
                     * Encodes the specified BindingDelta message, length delimited. Does not implicitly {@link google.iam.v1.BindingDelta.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof google.iam.v1.BindingDelta
                     * @static
                     * @param {google.iam.v1.IBindingDelta} message BindingDelta message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    BindingDelta.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };
    
                    /**
                     * Decodes a BindingDelta message from the specified reader or buffer.
                     * @function decode
                     * @memberof google.iam.v1.BindingDelta
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {google.iam.v1.BindingDelta} BindingDelta
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    BindingDelta.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.iam.v1.BindingDelta();
                        while (reader.pos < end) {
                            var tag = reader.uint32();
                            switch (tag >>> 3) {
                            case 1:
                                message.action = reader.int32();
                                break;
                            case 2:
                                message.role = reader.string();
                                break;
                            case 3:
                                message.member = reader.string();
                                break;
                            case 4:
                                message.condition = $root.google.type.Expr.decode(reader, reader.uint32());
                                break;
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };
    
                    /**
                     * Decodes a BindingDelta message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof google.iam.v1.BindingDelta
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {google.iam.v1.BindingDelta} BindingDelta
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    BindingDelta.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };
    
                    /**
                     * Verifies a BindingDelta message.
                     * @function verify
                     * @memberof google.iam.v1.BindingDelta
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    BindingDelta.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.action != null && message.hasOwnProperty("action"))
                            switch (message.action) {
                            default:
                                return "action: enum value expected";
                            case 0:
                            case 1:
                            case 2:
                                break;
                            }
                        if (message.role != null && message.hasOwnProperty("role"))
                            if (!$util.isString(message.role))
                                return "role: string expected";
                        if (message.member != null && message.hasOwnProperty("member"))
                            if (!$util.isString(message.member))
                                return "member: string expected";
                        if (message.condition != null && message.hasOwnProperty("condition")) {
                            var error = $root.google.type.Expr.verify(message.condition);
                            if (error)
                                return "condition." + error;
                        }
                        return null;
                    };
    
                    /**
                     * Creates a BindingDelta message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof google.iam.v1.BindingDelta
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {google.iam.v1.BindingDelta} BindingDelta
                     */
                    BindingDelta.fromObject = function fromObject(object) {
                        if (object instanceof $root.google.iam.v1.BindingDelta)
                            return object;
                        var message = new $root.google.iam.v1.BindingDelta();
                        switch (object.action) {
                        case "ACTION_UNSPECIFIED":
                        case 0:
                            message.action = 0;
                            break;
                        case "ADD":
                        case 1:
                            message.action = 1;
                            break;
                        case "REMOVE":
                        case 2:
                            message.action = 2;
                            break;
                        }
                        if (object.role != null)
                            message.role = String(object.role);
                        if (object.member != null)
                            message.member = String(object.member);
                        if (object.condition != null) {
                            if (typeof object.condition !== "object")
                                throw TypeError(".google.iam.v1.BindingDelta.condition: object expected");
                            message.condition = $root.google.type.Expr.fromObject(object.condition);
                        }
                        return message;
                    };
    
                    /**
                     * Creates a plain object from a BindingDelta message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof google.iam.v1.BindingDelta
                     * @static
                     * @param {google.iam.v1.BindingDelta} message BindingDelta
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    BindingDelta.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        var object = {};
                        if (options.defaults) {
                            object.action = options.enums === String ? "ACTION_UNSPECIFIED" : 0;
                            object.role = "";
                            object.member = "";
                            object.condition = null;
                        }
                        if (message.action != null && message.hasOwnProperty("action"))
                            object.action = options.enums === String ? $root.google.iam.v1.BindingDelta.Action[message.action] : message.action;
                        if (message.role != null && message.hasOwnProperty("role"))
                            object.role = message.role;
                        if (message.member != null && message.hasOwnProperty("member"))
                            object.member = message.member;
                        if (message.condition != null && message.hasOwnProperty("condition"))
                            object.condition = $root.google.type.Expr.toObject(message.condition, options);
                        return object;
                    };
    
                    /**
                     * Converts this BindingDelta to JSON.
                     * @function toJSON
                     * @memberof google.iam.v1.BindingDelta
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    BindingDelta.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };
    
                    /**
                     * Action enum.
                     * @name google.iam.v1.BindingDelta.Action
                     * @enum {string}
                     * @property {number} ACTION_UNSPECIFIED=0 ACTION_UNSPECIFIED value
                     * @property {number} ADD=1 ADD value
                     * @property {number} REMOVE=2 REMOVE value
                     */
                    BindingDelta.Action = (function() {
                        var valuesById = {}, values = Object.create(valuesById);
                        values[valuesById[0] = "ACTION_UNSPECIFIED"] = 0;
                        values[valuesById[1] = "ADD"] = 1;
                        values[valuesById[2] = "REMOVE"] = 2;
                        return values;
                    })();
    
                    return BindingDelta;
                })();
    
                v1.AuditConfigDelta = (function() {
    
                    /**
                     * Properties of an AuditConfigDelta.
                     * @memberof google.iam.v1
                     * @interface IAuditConfigDelta
                     * @property {google.iam.v1.AuditConfigDelta.Action|null} [action] AuditConfigDelta action
                     * @property {string|null} [service] AuditConfigDelta service
                     * @property {string|null} [exemptedMember] AuditConfigDelta exemptedMember
                     * @property {string|null} [logType] AuditConfigDelta logType
                     */
    
                    /**
                     * Constructs a new AuditConfigDelta.
                     * @memberof google.iam.v1
                     * @classdesc Represents an AuditConfigDelta.
                     * @implements IAuditConfigDelta
                     * @constructor
                     * @param {google.iam.v1.IAuditConfigDelta=} [properties] Properties to set
                     */
                    function AuditConfigDelta(properties) {
                        if (properties)
                            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }
    
                    /**
                     * AuditConfigDelta action.
                     * @member {google.iam.v1.AuditConfigDelta.Action} action
                     * @memberof google.iam.v1.AuditConfigDelta
                     * @instance
                     */
                    AuditConfigDelta.prototype.action = 0;
    
                    /**
                     * AuditConfigDelta service.
                     * @member {string} service
                     * @memberof google.iam.v1.AuditConfigDelta
                     * @instance
                     */
                    AuditConfigDelta.prototype.service = "";
    
                    /**
                     * AuditConfigDelta exemptedMember.
                     * @member {string} exemptedMember
                     * @memberof google.iam.v1.AuditConfigDelta
                     * @instance
                     */
                    AuditConfigDelta.prototype.exemptedMember = "";
    
                    /**
                     * AuditConfigDelta logType.
                     * @member {string} logType
                     * @memberof google.iam.v1.AuditConfigDelta
                     * @instance
                     */
                    AuditConfigDelta.prototype.logType = "";
    
                    /**
                     * Creates a new AuditConfigDelta instance using the specified properties.
                     * @function create
                     * @memberof google.iam.v1.AuditConfigDelta
                     * @static
                     * @param {google.iam.v1.IAuditConfigDelta=} [properties] Properties to set
                     * @returns {google.iam.v1.AuditConfigDelta} AuditConfigDelta instance
                     */
                    AuditConfigDelta.create = function create(properties) {
                        return new AuditConfigDelta(properties);
                    };
    
                    /**
                     * Encodes the specified AuditConfigDelta message. Does not implicitly {@link google.iam.v1.AuditConfigDelta.verify|verify} messages.
                     * @function encode
                     * @memberof google.iam.v1.AuditConfigDelta
                     * @static
                     * @param {google.iam.v1.IAuditConfigDelta} message AuditConfigDelta message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    AuditConfigDelta.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.action != null && message.hasOwnProperty("action"))
                            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.action);
                        if (message.service != null && message.hasOwnProperty("service"))
                            writer.uint32(/* id 2, wireType 2 =*/18).string(message.service);
                        if (message.exemptedMember != null && message.hasOwnProperty("exemptedMember"))
                            writer.uint32(/* id 3, wireType 2 =*/26).string(message.exemptedMember);
                        if (message.logType != null && message.hasOwnProperty("logType"))
                            writer.uint32(/* id 4, wireType 2 =*/34).string(message.logType);
                        return writer;
                    };
    
                    /**
                     * Encodes the specified AuditConfigDelta message, length delimited. Does not implicitly {@link google.iam.v1.AuditConfigDelta.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof google.iam.v1.AuditConfigDelta
                     * @static
                     * @param {google.iam.v1.IAuditConfigDelta} message AuditConfigDelta message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    AuditConfigDelta.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };
    
                    /**
                     * Decodes an AuditConfigDelta message from the specified reader or buffer.
                     * @function decode
                     * @memberof google.iam.v1.AuditConfigDelta
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {google.iam.v1.AuditConfigDelta} AuditConfigDelta
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    AuditConfigDelta.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.iam.v1.AuditConfigDelta();
                        while (reader.pos < end) {
                            var tag = reader.uint32();
                            switch (tag >>> 3) {
                            case 1:
                                message.action = reader.int32();
                                break;
                            case 2:
                                message.service = reader.string();
                                break;
                            case 3:
                                message.exemptedMember = reader.string();
                                break;
                            case 4:
                                message.logType = reader.string();
                                break;
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };
    
                    /**
                     * Decodes an AuditConfigDelta message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof google.iam.v1.AuditConfigDelta
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {google.iam.v1.AuditConfigDelta} AuditConfigDelta
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    AuditConfigDelta.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };
    
                    /**
                     * Verifies an AuditConfigDelta message.
                     * @function verify
                     * @memberof google.iam.v1.AuditConfigDelta
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    AuditConfigDelta.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.action != null && message.hasOwnProperty("action"))
                            switch (message.action) {
                            default:
                                return "action: enum value expected";
                            case 0:
                            case 1:
                            case 2:
                                break;
                            }
                        if (message.service != null && message.hasOwnProperty("service"))
                            if (!$util.isString(message.service))
                                return "service: string expected";
                        if (message.exemptedMember != null && message.hasOwnProperty("exemptedMember"))
                            if (!$util.isString(message.exemptedMember))
                                return "exemptedMember: string expected";
                        if (message.logType != null && message.hasOwnProperty("logType"))
                            if (!$util.isString(message.logType))
                                return "logType: string expected";
                        return null;
                    };
    
                    /**
                     * Creates an AuditConfigDelta message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof google.iam.v1.AuditConfigDelta
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {google.iam.v1.AuditConfigDelta} AuditConfigDelta
                     */
                    AuditConfigDelta.fromObject = function fromObject(object) {
                        if (object instanceof $root.google.iam.v1.AuditConfigDelta)
                            return object;
                        var message = new $root.google.iam.v1.AuditConfigDelta();
                        switch (object.action) {
                        case "ACTION_UNSPECIFIED":
                        case 0:
                            message.action = 0;
                            break;
                        case "ADD":
                        case 1:
                            message.action = 1;
                            break;
                        case "REMOVE":
                        case 2:
                            message.action = 2;
                            break;
                        }
                        if (object.service != null)
                            message.service = String(object.service);
                        if (object.exemptedMember != null)
                            message.exemptedMember = String(object.exemptedMember);
                        if (object.logType != null)
                            message.logType = String(object.logType);
                        return message;
                    };
    
                    /**
                     * Creates a plain object from an AuditConfigDelta message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof google.iam.v1.AuditConfigDelta
                     * @static
                     * @param {google.iam.v1.AuditConfigDelta} message AuditConfigDelta
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    AuditConfigDelta.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        var object = {};
                        if (options.defaults) {
                            object.action = options.enums === String ? "ACTION_UNSPECIFIED" : 0;
                            object.service = "";
                            object.exemptedMember = "";
                            object.logType = "";
                        }
                        if (message.action != null && message.hasOwnProperty("action"))
                            object.action = options.enums === String ? $root.google.iam.v1.AuditConfigDelta.Action[message.action] : message.action;
                        if (message.service != null && message.hasOwnProperty("service"))
                            object.service = message.service;
                        if (message.exemptedMember != null && message.hasOwnProperty("exemptedMember"))
                            object.exemptedMember = message.exemptedMember;
                        if (message.logType != null && message.hasOwnProperty("logType"))
                            object.logType = message.logType;
                        return object;
                    };
    
                    /**
                     * Converts this AuditConfigDelta to JSON.
                     * @function toJSON
                     * @memberof google.iam.v1.AuditConfigDelta
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    AuditConfigDelta.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };
    
                    /**
                     * Action enum.
                     * @name google.iam.v1.AuditConfigDelta.Action
                     * @enum {string}
                     * @property {number} ACTION_UNSPECIFIED=0 ACTION_UNSPECIFIED value
                     * @property {number} ADD=1 ADD value
                     * @property {number} REMOVE=2 REMOVE value
                     */
                    AuditConfigDelta.Action = (function() {
                        var valuesById = {}, values = Object.create(valuesById);
                        values[valuesById[0] = "ACTION_UNSPECIFIED"] = 0;
                        values[valuesById[1] = "ADD"] = 1;
                        values[valuesById[2] = "REMOVE"] = 2;
                        return values;
                    })();
    
                    return AuditConfigDelta;
                })();
    
                v1.GetPolicyOptions = (function() {
    
                    /**
                     * Properties of a GetPolicyOptions.
                     * @memberof google.iam.v1
                     * @interface IGetPolicyOptions
                     * @property {number|null} [requestedPolicyVersion] GetPolicyOptions requestedPolicyVersion
                     */
    
                    /**
                     * Constructs a new GetPolicyOptions.
                     * @memberof google.iam.v1
                     * @classdesc Represents a GetPolicyOptions.
                     * @implements IGetPolicyOptions
                     * @constructor
                     * @param {google.iam.v1.IGetPolicyOptions=} [properties] Properties to set
                     */
                    function GetPolicyOptions(properties) {
                        if (properties)
                            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }
    
                    /**
                     * GetPolicyOptions requestedPolicyVersion.
                     * @member {number} requestedPolicyVersion
                     * @memberof google.iam.v1.GetPolicyOptions
                     * @instance
                     */
                    GetPolicyOptions.prototype.requestedPolicyVersion = 0;
    
                    /**
                     * Creates a new GetPolicyOptions instance using the specified properties.
                     * @function create
                     * @memberof google.iam.v1.GetPolicyOptions
                     * @static
                     * @param {google.iam.v1.IGetPolicyOptions=} [properties] Properties to set
                     * @returns {google.iam.v1.GetPolicyOptions} GetPolicyOptions instance
                     */
                    GetPolicyOptions.create = function create(properties) {
                        return new GetPolicyOptions(properties);
                    };
    
                    /**
                     * Encodes the specified GetPolicyOptions message. Does not implicitly {@link google.iam.v1.GetPolicyOptions.verify|verify} messages.
                     * @function encode
                     * @memberof google.iam.v1.GetPolicyOptions
                     * @static
                     * @param {google.iam.v1.IGetPolicyOptions} message GetPolicyOptions message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    GetPolicyOptions.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.requestedPolicyVersion != null && message.hasOwnProperty("requestedPolicyVersion"))
                            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.requestedPolicyVersion);
                        return writer;
                    };
    
                    /**
                     * Encodes the specified GetPolicyOptions message, length delimited. Does not implicitly {@link google.iam.v1.GetPolicyOptions.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof google.iam.v1.GetPolicyOptions
                     * @static
                     * @param {google.iam.v1.IGetPolicyOptions} message GetPolicyOptions message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    GetPolicyOptions.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };
    
                    /**
                     * Decodes a GetPolicyOptions message from the specified reader or buffer.
                     * @function decode
                     * @memberof google.iam.v1.GetPolicyOptions
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {google.iam.v1.GetPolicyOptions} GetPolicyOptions
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    GetPolicyOptions.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.iam.v1.GetPolicyOptions();
                        while (reader.pos < end) {
                            var tag = reader.uint32();
                            switch (tag >>> 3) {
                            case 1:
                                message.requestedPolicyVersion = reader.int32();
                                break;
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };
    
                    /**
                     * Decodes a GetPolicyOptions message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof google.iam.v1.GetPolicyOptions
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {google.iam.v1.GetPolicyOptions} GetPolicyOptions
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    GetPolicyOptions.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };
    
                    /**
                     * Verifies a GetPolicyOptions message.
                     * @function verify
                     * @memberof google.iam.v1.GetPolicyOptions
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    GetPolicyOptions.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.requestedPolicyVersion != null && message.hasOwnProperty("requestedPolicyVersion"))
                            if (!$util.isInteger(message.requestedPolicyVersion))
                                return "requestedPolicyVersion: integer expected";
                        return null;
                    };
    
                    /**
                     * Creates a GetPolicyOptions message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof google.iam.v1.GetPolicyOptions
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {google.iam.v1.GetPolicyOptions} GetPolicyOptions
                     */
                    GetPolicyOptions.fromObject = function fromObject(object) {
                        if (object instanceof $root.google.iam.v1.GetPolicyOptions)
                            return object;
                        var message = new $root.google.iam.v1.GetPolicyOptions();
                        if (object.requestedPolicyVersion != null)
                            message.requestedPolicyVersion = object.requestedPolicyVersion | 0;
                        return message;
                    };
    
                    /**
                     * Creates a plain object from a GetPolicyOptions message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof google.iam.v1.GetPolicyOptions
                     * @static
                     * @param {google.iam.v1.GetPolicyOptions} message GetPolicyOptions
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    GetPolicyOptions.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        var object = {};
                        if (options.defaults)
                            object.requestedPolicyVersion = 0;
                        if (message.requestedPolicyVersion != null && message.hasOwnProperty("requestedPolicyVersion"))
                            object.requestedPolicyVersion = message.requestedPolicyVersion;
                        return object;
                    };
    
                    /**
                     * Converts this GetPolicyOptions to JSON.
                     * @function toJSON
                     * @memberof google.iam.v1.GetPolicyOptions
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    GetPolicyOptions.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };
    
                    return GetPolicyOptions;
                })();
    
                v1.IAMPolicy = (function() {
    
                    /**
                     * Constructs a new IAMPolicy service.
                     * @memberof google.iam.v1
                     * @classdesc Represents a IAMPolicy
                     * @extends $protobuf.rpc.Service
                     * @constructor
                     * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
                     * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
                     * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
                     */
                    function IAMPolicy(rpcImpl, requestDelimited, responseDelimited) {
                        $protobuf.rpc.Service.call(this, rpcImpl, requestDelimited, responseDelimited);
                    }
    
                    (IAMPolicy.prototype = Object.create($protobuf.rpc.Service.prototype)).constructor = IAMPolicy;
    
                    /**
                     * Creates new IAMPolicy service using the specified rpc implementation.
                     * @function create
                     * @memberof google.iam.v1.IAMPolicy
                     * @static
                     * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
                     * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
                     * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
                     * @returns {IAMPolicy} RPC service. Useful where requests and/or responses are streamed.
                     */
                    IAMPolicy.create = function create(rpcImpl, requestDelimited, responseDelimited) {
                        return new this(rpcImpl, requestDelimited, responseDelimited);
                    };
    
                    /**
                     * Callback as used by {@link google.iam.v1.IAMPolicy#setIamPolicy}.
                     * @memberof google.iam.v1.IAMPolicy
                     * @typedef SetIamPolicyCallback
                     * @type {function}
                     * @param {Error|null} error Error, if any
                     * @param {google.iam.v1.Policy} [response] Policy
                     */
    
                    /**
                     * Calls SetIamPolicy.
                     * @function setIamPolicy
                     * @memberof google.iam.v1.IAMPolicy
                     * @instance
                     * @param {google.iam.v1.ISetIamPolicyRequest} request SetIamPolicyRequest message or plain object
                     * @param {google.iam.v1.IAMPolicy.SetIamPolicyCallback} callback Node-style callback called with the error, if any, and Policy
                     * @returns {undefined}
                     * @variation 1
                     */
                    Object.defineProperty(IAMPolicy.prototype.setIamPolicy = function setIamPolicy(request, callback) {
                        return this.rpcCall(setIamPolicy, $root.google.iam.v1.SetIamPolicyRequest, $root.google.iam.v1.Policy, request, callback);
                    }, "name", { value: "SetIamPolicy" });
    
                    /**
                     * Calls SetIamPolicy.
                     * @function setIamPolicy
                     * @memberof google.iam.v1.IAMPolicy
                     * @instance
                     * @param {google.iam.v1.ISetIamPolicyRequest} request SetIamPolicyRequest message or plain object
                     * @returns {Promise<google.iam.v1.Policy>} Promise
                     * @variation 2
                     */
    
                    /**
                     * Callback as used by {@link google.iam.v1.IAMPolicy#getIamPolicy}.
                     * @memberof google.iam.v1.IAMPolicy
                     * @typedef GetIamPolicyCallback
                     * @type {function}
                     * @param {Error|null} error Error, if any
                     * @param {google.iam.v1.Policy} [response] Policy
                     */
    
                    /**
                     * Calls GetIamPolicy.
                     * @function getIamPolicy
                     * @memberof google.iam.v1.IAMPolicy
                     * @instance
                     * @param {google.iam.v1.IGetIamPolicyRequest} request GetIamPolicyRequest message or plain object
                     * @param {google.iam.v1.IAMPolicy.GetIamPolicyCallback} callback Node-style callback called with the error, if any, and Policy
                     * @returns {undefined}
                     * @variation 1
                     */
                    Object.defineProperty(IAMPolicy.prototype.getIamPolicy = function getIamPolicy(request, callback) {
                        return this.rpcCall(getIamPolicy, $root.google.iam.v1.GetIamPolicyRequest, $root.google.iam.v1.Policy, request, callback);
                    }, "name", { value: "GetIamPolicy" });
    
                    /**
                     * Calls GetIamPolicy.
                     * @function getIamPolicy
                     * @memberof google.iam.v1.IAMPolicy
                     * @instance
                     * @param {google.iam.v1.IGetIamPolicyRequest} request GetIamPolicyRequest message or plain object
                     * @returns {Promise<google.iam.v1.Policy>} Promise
                     * @variation 2
                     */
    
                    /**
                     * Callback as used by {@link google.iam.v1.IAMPolicy#testIamPermissions}.
                     * @memberof google.iam.v1.IAMPolicy
                     * @typedef TestIamPermissionsCallback
                     * @type {function}
                     * @param {Error|null} error Error, if any
                     * @param {google.iam.v1.TestIamPermissionsResponse} [response] TestIamPermissionsResponse
                     */
    
                    /**
                     * Calls TestIamPermissions.
                     * @function testIamPermissions
                     * @memberof google.iam.v1.IAMPolicy
                     * @instance
                     * @param {google.iam.v1.ITestIamPermissionsRequest} request TestIamPermissionsRequest message or plain object
                     * @param {google.iam.v1.IAMPolicy.TestIamPermissionsCallback} callback Node-style callback called with the error, if any, and TestIamPermissionsResponse
                     * @returns {undefined}
                     * @variation 1
                     */
                    Object.defineProperty(IAMPolicy.prototype.testIamPermissions = function testIamPermissions(request, callback) {
                        return this.rpcCall(testIamPermissions, $root.google.iam.v1.TestIamPermissionsRequest, $root.google.iam.v1.TestIamPermissionsResponse, request, callback);
                    }, "name", { value: "TestIamPermissions" });
    
                    /**
                     * Calls TestIamPermissions.
                     * @function testIamPermissions
                     * @memberof google.iam.v1.IAMPolicy
                     * @instance
                     * @param {google.iam.v1.ITestIamPermissionsRequest} request TestIamPermissionsRequest message or plain object
                     * @returns {Promise<google.iam.v1.TestIamPermissionsResponse>} Promise
                     * @variation 2
                     */
    
                    return IAMPolicy;
                })();
    
                v1.SetIamPolicyRequest = (function() {
    
                    /**
                     * Properties of a SetIamPolicyRequest.
                     * @memberof google.iam.v1
                     * @interface ISetIamPolicyRequest
                     * @property {string|null} [resource] SetIamPolicyRequest resource
                     * @property {google.iam.v1.IPolicy|null} [policy] SetIamPolicyRequest policy
                     */
    
                    /**
                     * Constructs a new SetIamPolicyRequest.
                     * @memberof google.iam.v1
                     * @classdesc Represents a SetIamPolicyRequest.
                     * @implements ISetIamPolicyRequest
                     * @constructor
                     * @param {google.iam.v1.ISetIamPolicyRequest=} [properties] Properties to set
                     */
                    function SetIamPolicyRequest(properties) {
                        if (properties)
                            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }
    
                    /**
                     * SetIamPolicyRequest resource.
                     * @member {string} resource
                     * @memberof google.iam.v1.SetIamPolicyRequest
                     * @instance
                     */
                    SetIamPolicyRequest.prototype.resource = "";
    
                    /**
                     * SetIamPolicyRequest policy.
                     * @member {google.iam.v1.IPolicy|null|undefined} policy
                     * @memberof google.iam.v1.SetIamPolicyRequest
                     * @instance
                     */
                    SetIamPolicyRequest.prototype.policy = null;
    
                    /**
                     * Creates a new SetIamPolicyRequest instance using the specified properties.
                     * @function create
                     * @memberof google.iam.v1.SetIamPolicyRequest
                     * @static
                     * @param {google.iam.v1.ISetIamPolicyRequest=} [properties] Properties to set
                     * @returns {google.iam.v1.SetIamPolicyRequest} SetIamPolicyRequest instance
                     */
                    SetIamPolicyRequest.create = function create(properties) {
                        return new SetIamPolicyRequest(properties);
                    };
    
                    /**
                     * Encodes the specified SetIamPolicyRequest message. Does not implicitly {@link google.iam.v1.SetIamPolicyRequest.verify|verify} messages.
                     * @function encode
                     * @memberof google.iam.v1.SetIamPolicyRequest
                     * @static
                     * @param {google.iam.v1.ISetIamPolicyRequest} message SetIamPolicyRequest message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    SetIamPolicyRequest.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.resource != null && message.hasOwnProperty("resource"))
                            writer.uint32(/* id 1, wireType 2 =*/10).string(message.resource);
                        if (message.policy != null && message.hasOwnProperty("policy"))
                            $root.google.iam.v1.Policy.encode(message.policy, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                        return writer;
                    };
    
                    /**
                     * Encodes the specified SetIamPolicyRequest message, length delimited. Does not implicitly {@link google.iam.v1.SetIamPolicyRequest.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof google.iam.v1.SetIamPolicyRequest
                     * @static
                     * @param {google.iam.v1.ISetIamPolicyRequest} message SetIamPolicyRequest message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    SetIamPolicyRequest.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };
    
                    /**
                     * Decodes a SetIamPolicyRequest message from the specified reader or buffer.
                     * @function decode
                     * @memberof google.iam.v1.SetIamPolicyRequest
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {google.iam.v1.SetIamPolicyRequest} SetIamPolicyRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    SetIamPolicyRequest.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.iam.v1.SetIamPolicyRequest();
                        while (reader.pos < end) {
                            var tag = reader.uint32();
                            switch (tag >>> 3) {
                            case 1:
                                message.resource = reader.string();
                                break;
                            case 2:
                                message.policy = $root.google.iam.v1.Policy.decode(reader, reader.uint32());
                                break;
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };
    
                    /**
                     * Decodes a SetIamPolicyRequest message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof google.iam.v1.SetIamPolicyRequest
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {google.iam.v1.SetIamPolicyRequest} SetIamPolicyRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    SetIamPolicyRequest.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };
    
                    /**
                     * Verifies a SetIamPolicyRequest message.
                     * @function verify
                     * @memberof google.iam.v1.SetIamPolicyRequest
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    SetIamPolicyRequest.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.resource != null && message.hasOwnProperty("resource"))
                            if (!$util.isString(message.resource))
                                return "resource: string expected";
                        if (message.policy != null && message.hasOwnProperty("policy")) {
                            var error = $root.google.iam.v1.Policy.verify(message.policy);
                            if (error)
                                return "policy." + error;
                        }
                        return null;
                    };
    
                    /**
                     * Creates a SetIamPolicyRequest message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof google.iam.v1.SetIamPolicyRequest
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {google.iam.v1.SetIamPolicyRequest} SetIamPolicyRequest
                     */
                    SetIamPolicyRequest.fromObject = function fromObject(object) {
                        if (object instanceof $root.google.iam.v1.SetIamPolicyRequest)
                            return object;
                        var message = new $root.google.iam.v1.SetIamPolicyRequest();
                        if (object.resource != null)
                            message.resource = String(object.resource);
                        if (object.policy != null) {
                            if (typeof object.policy !== "object")
                                throw TypeError(".google.iam.v1.SetIamPolicyRequest.policy: object expected");
                            message.policy = $root.google.iam.v1.Policy.fromObject(object.policy);
                        }
                        return message;
                    };
    
                    /**
                     * Creates a plain object from a SetIamPolicyRequest message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof google.iam.v1.SetIamPolicyRequest
                     * @static
                     * @param {google.iam.v1.SetIamPolicyRequest} message SetIamPolicyRequest
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    SetIamPolicyRequest.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        var object = {};
                        if (options.defaults) {
                            object.resource = "";
                            object.policy = null;
                        }
                        if (message.resource != null && message.hasOwnProperty("resource"))
                            object.resource = message.resource;
                        if (message.policy != null && message.hasOwnProperty("policy"))
                            object.policy = $root.google.iam.v1.Policy.toObject(message.policy, options);
                        return object;
                    };
    
                    /**
                     * Converts this SetIamPolicyRequest to JSON.
                     * @function toJSON
                     * @memberof google.iam.v1.SetIamPolicyRequest
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    SetIamPolicyRequest.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };
    
                    return SetIamPolicyRequest;
                })();
    
                v1.GetIamPolicyRequest = (function() {
    
                    /**
                     * Properties of a GetIamPolicyRequest.
                     * @memberof google.iam.v1
                     * @interface IGetIamPolicyRequest
                     * @property {string|null} [resource] GetIamPolicyRequest resource
                     * @property {google.iam.v1.IGetPolicyOptions|null} [options] GetIamPolicyRequest options
                     */
    
                    /**
                     * Constructs a new GetIamPolicyRequest.
                     * @memberof google.iam.v1
                     * @classdesc Represents a GetIamPolicyRequest.
                     * @implements IGetIamPolicyRequest
                     * @constructor
                     * @param {google.iam.v1.IGetIamPolicyRequest=} [properties] Properties to set
                     */
                    function GetIamPolicyRequest(properties) {
                        if (properties)
                            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }
    
                    /**
                     * GetIamPolicyRequest resource.
                     * @member {string} resource
                     * @memberof google.iam.v1.GetIamPolicyRequest
                     * @instance
                     */
                    GetIamPolicyRequest.prototype.resource = "";
    
                    /**
                     * GetIamPolicyRequest options.
                     * @member {google.iam.v1.IGetPolicyOptions|null|undefined} options
                     * @memberof google.iam.v1.GetIamPolicyRequest
                     * @instance
                     */
                    GetIamPolicyRequest.prototype.options = null;
    
                    /**
                     * Creates a new GetIamPolicyRequest instance using the specified properties.
                     * @function create
                     * @memberof google.iam.v1.GetIamPolicyRequest
                     * @static
                     * @param {google.iam.v1.IGetIamPolicyRequest=} [properties] Properties to set
                     * @returns {google.iam.v1.GetIamPolicyRequest} GetIamPolicyRequest instance
                     */
                    GetIamPolicyRequest.create = function create(properties) {
                        return new GetIamPolicyRequest(properties);
                    };
    
                    /**
                     * Encodes the specified GetIamPolicyRequest message. Does not implicitly {@link google.iam.v1.GetIamPolicyRequest.verify|verify} messages.
                     * @function encode
                     * @memberof google.iam.v1.GetIamPolicyRequest
                     * @static
                     * @param {google.iam.v1.IGetIamPolicyRequest} message GetIamPolicyRequest message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    GetIamPolicyRequest.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.resource != null && message.hasOwnProperty("resource"))
                            writer.uint32(/* id 1, wireType 2 =*/10).string(message.resource);
                        if (message.options != null && message.hasOwnProperty("options"))
                            $root.google.iam.v1.GetPolicyOptions.encode(message.options, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                        return writer;
                    };
    
                    /**
                     * Encodes the specified GetIamPolicyRequest message, length delimited. Does not implicitly {@link google.iam.v1.GetIamPolicyRequest.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof google.iam.v1.GetIamPolicyRequest
                     * @static
                     * @param {google.iam.v1.IGetIamPolicyRequest} message GetIamPolicyRequest message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    GetIamPolicyRequest.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };
    
                    /**
                     * Decodes a GetIamPolicyRequest message from the specified reader or buffer.
                     * @function decode
                     * @memberof google.iam.v1.GetIamPolicyRequest
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {google.iam.v1.GetIamPolicyRequest} GetIamPolicyRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    GetIamPolicyRequest.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.iam.v1.GetIamPolicyRequest();
                        while (reader.pos < end) {
                            var tag = reader.uint32();
                            switch (tag >>> 3) {
                            case 1:
                                message.resource = reader.string();
                                break;
                            case 2:
                                message.options = $root.google.iam.v1.GetPolicyOptions.decode(reader, reader.uint32());
                                break;
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };
    
                    /**
                     * Decodes a GetIamPolicyRequest message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof google.iam.v1.GetIamPolicyRequest
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {google.iam.v1.GetIamPolicyRequest} GetIamPolicyRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    GetIamPolicyRequest.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };
    
                    /**
                     * Verifies a GetIamPolicyRequest message.
                     * @function verify
                     * @memberof google.iam.v1.GetIamPolicyRequest
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    GetIamPolicyRequest.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.resource != null && message.hasOwnProperty("resource"))
                            if (!$util.isString(message.resource))
                                return "resource: string expected";
                        if (message.options != null && message.hasOwnProperty("options")) {
                            var error = $root.google.iam.v1.GetPolicyOptions.verify(message.options);
                            if (error)
                                return "options." + error;
                        }
                        return null;
                    };
    
                    /**
                     * Creates a GetIamPolicyRequest message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof google.iam.v1.GetIamPolicyRequest
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {google.iam.v1.GetIamPolicyRequest} GetIamPolicyRequest
                     */
                    GetIamPolicyRequest.fromObject = function fromObject(object) {
                        if (object instanceof $root.google.iam.v1.GetIamPolicyRequest)
                            return object;
                        var message = new $root.google.iam.v1.GetIamPolicyRequest();
                        if (object.resource != null)
                            message.resource = String(object.resource);
                        if (object.options != null) {
                            if (typeof object.options !== "object")
                                throw TypeError(".google.iam.v1.GetIamPolicyRequest.options: object expected");
                            message.options = $root.google.iam.v1.GetPolicyOptions.fromObject(object.options);
                        }
                        return message;
                    };
    
                    /**
                     * Creates a plain object from a GetIamPolicyRequest message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof google.iam.v1.GetIamPolicyRequest
                     * @static
                     * @param {google.iam.v1.GetIamPolicyRequest} message GetIamPolicyRequest
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    GetIamPolicyRequest.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        var object = {};
                        if (options.defaults) {
                            object.resource = "";
                            object.options = null;
                        }
                        if (message.resource != null && message.hasOwnProperty("resource"))
                            object.resource = message.resource;
                        if (message.options != null && message.hasOwnProperty("options"))
                            object.options = $root.google.iam.v1.GetPolicyOptions.toObject(message.options, options);
                        return object;
                    };
    
                    /**
                     * Converts this GetIamPolicyRequest to JSON.
                     * @function toJSON
                     * @memberof google.iam.v1.GetIamPolicyRequest
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    GetIamPolicyRequest.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };
    
                    return GetIamPolicyRequest;
                })();
    
                v1.TestIamPermissionsRequest = (function() {
    
                    /**
                     * Properties of a TestIamPermissionsRequest.
                     * @memberof google.iam.v1
                     * @interface ITestIamPermissionsRequest
                     * @property {string|null} [resource] TestIamPermissionsRequest resource
                     * @property {Array.<string>|null} [permissions] TestIamPermissionsRequest permissions
                     */
    
                    /**
                     * Constructs a new TestIamPermissionsRequest.
                     * @memberof google.iam.v1
                     * @classdesc Represents a TestIamPermissionsRequest.
                     * @implements ITestIamPermissionsRequest
                     * @constructor
                     * @param {google.iam.v1.ITestIamPermissionsRequest=} [properties] Properties to set
                     */
                    function TestIamPermissionsRequest(properties) {
                        this.permissions = [];
                        if (properties)
                            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }
    
                    /**
                     * TestIamPermissionsRequest resource.
                     * @member {string} resource
                     * @memberof google.iam.v1.TestIamPermissionsRequest
                     * @instance
                     */
                    TestIamPermissionsRequest.prototype.resource = "";
    
                    /**
                     * TestIamPermissionsRequest permissions.
                     * @member {Array.<string>} permissions
                     * @memberof google.iam.v1.TestIamPermissionsRequest
                     * @instance
                     */
                    TestIamPermissionsRequest.prototype.permissions = $util.emptyArray;
    
                    /**
                     * Creates a new TestIamPermissionsRequest instance using the specified properties.
                     * @function create
                     * @memberof google.iam.v1.TestIamPermissionsRequest
                     * @static
                     * @param {google.iam.v1.ITestIamPermissionsRequest=} [properties] Properties to set
                     * @returns {google.iam.v1.TestIamPermissionsRequest} TestIamPermissionsRequest instance
                     */
                    TestIamPermissionsRequest.create = function create(properties) {
                        return new TestIamPermissionsRequest(properties);
                    };
    
                    /**
                     * Encodes the specified TestIamPermissionsRequest message. Does not implicitly {@link google.iam.v1.TestIamPermissionsRequest.verify|verify} messages.
                     * @function encode
                     * @memberof google.iam.v1.TestIamPermissionsRequest
                     * @static
                     * @param {google.iam.v1.ITestIamPermissionsRequest} message TestIamPermissionsRequest message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    TestIamPermissionsRequest.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.resource != null && message.hasOwnProperty("resource"))
                            writer.uint32(/* id 1, wireType 2 =*/10).string(message.resource);
                        if (message.permissions != null && message.permissions.length)
                            for (var i = 0; i < message.permissions.length; ++i)
                                writer.uint32(/* id 2, wireType 2 =*/18).string(message.permissions[i]);
                        return writer;
                    };
    
                    /**
                     * Encodes the specified TestIamPermissionsRequest message, length delimited. Does not implicitly {@link google.iam.v1.TestIamPermissionsRequest.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof google.iam.v1.TestIamPermissionsRequest
                     * @static
                     * @param {google.iam.v1.ITestIamPermissionsRequest} message TestIamPermissionsRequest message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    TestIamPermissionsRequest.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };
    
                    /**
                     * Decodes a TestIamPermissionsRequest message from the specified reader or buffer.
                     * @function decode
                     * @memberof google.iam.v1.TestIamPermissionsRequest
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {google.iam.v1.TestIamPermissionsRequest} TestIamPermissionsRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    TestIamPermissionsRequest.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.iam.v1.TestIamPermissionsRequest();
                        while (reader.pos < end) {
                            var tag = reader.uint32();
                            switch (tag >>> 3) {
                            case 1:
                                message.resource = reader.string();
                                break;
                            case 2:
                                if (!(message.permissions && message.permissions.length))
                                    message.permissions = [];
                                message.permissions.push(reader.string());
                                break;
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };
    
                    /**
                     * Decodes a TestIamPermissionsRequest message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof google.iam.v1.TestIamPermissionsRequest
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {google.iam.v1.TestIamPermissionsRequest} TestIamPermissionsRequest
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    TestIamPermissionsRequest.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };
    
                    /**
                     * Verifies a TestIamPermissionsRequest message.
                     * @function verify
                     * @memberof google.iam.v1.TestIamPermissionsRequest
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    TestIamPermissionsRequest.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.resource != null && message.hasOwnProperty("resource"))
                            if (!$util.isString(message.resource))
                                return "resource: string expected";
                        if (message.permissions != null && message.hasOwnProperty("permissions")) {
                            if (!Array.isArray(message.permissions))
                                return "permissions: array expected";
                            for (var i = 0; i < message.permissions.length; ++i)
                                if (!$util.isString(message.permissions[i]))
                                    return "permissions: string[] expected";
                        }
                        return null;
                    };
    
                    /**
                     * Creates a TestIamPermissionsRequest message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof google.iam.v1.TestIamPermissionsRequest
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {google.iam.v1.TestIamPermissionsRequest} TestIamPermissionsRequest
                     */
                    TestIamPermissionsRequest.fromObject = function fromObject(object) {
                        if (object instanceof $root.google.iam.v1.TestIamPermissionsRequest)
                            return object;
                        var message = new $root.google.iam.v1.TestIamPermissionsRequest();
                        if (object.resource != null)
                            message.resource = String(object.resource);
                        if (object.permissions) {
                            if (!Array.isArray(object.permissions))
                                throw TypeError(".google.iam.v1.TestIamPermissionsRequest.permissions: array expected");
                            message.permissions = [];
                            for (var i = 0; i < object.permissions.length; ++i)
                                message.permissions[i] = String(object.permissions[i]);
                        }
                        return message;
                    };
    
                    /**
                     * Creates a plain object from a TestIamPermissionsRequest message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof google.iam.v1.TestIamPermissionsRequest
                     * @static
                     * @param {google.iam.v1.TestIamPermissionsRequest} message TestIamPermissionsRequest
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    TestIamPermissionsRequest.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        var object = {};
                        if (options.arrays || options.defaults)
                            object.permissions = [];
                        if (options.defaults)
                            object.resource = "";
                        if (message.resource != null && message.hasOwnProperty("resource"))
                            object.resource = message.resource;
                        if (message.permissions && message.permissions.length) {
                            object.permissions = [];
                            for (var j = 0; j < message.permissions.length; ++j)
                                object.permissions[j] = message.permissions[j];
                        }
                        return object;
                    };
    
                    /**
                     * Converts this TestIamPermissionsRequest to JSON.
                     * @function toJSON
                     * @memberof google.iam.v1.TestIamPermissionsRequest
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    TestIamPermissionsRequest.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };
    
                    return TestIamPermissionsRequest;
                })();
    
                v1.TestIamPermissionsResponse = (function() {
    
                    /**
                     * Properties of a TestIamPermissionsResponse.
                     * @memberof google.iam.v1
                     * @interface ITestIamPermissionsResponse
                     * @property {Array.<string>|null} [permissions] TestIamPermissionsResponse permissions
                     */
    
                    /**
                     * Constructs a new TestIamPermissionsResponse.
                     * @memberof google.iam.v1
                     * @classdesc Represents a TestIamPermissionsResponse.
                     * @implements ITestIamPermissionsResponse
                     * @constructor
                     * @param {google.iam.v1.ITestIamPermissionsResponse=} [properties] Properties to set
                     */
                    function TestIamPermissionsResponse(properties) {
                        this.permissions = [];
                        if (properties)
                            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }
    
                    /**
                     * TestIamPermissionsResponse permissions.
                     * @member {Array.<string>} permissions
                     * @memberof google.iam.v1.TestIamPermissionsResponse
                     * @instance
                     */
                    TestIamPermissionsResponse.prototype.permissions = $util.emptyArray;
    
                    /**
                     * Creates a new TestIamPermissionsResponse instance using the specified properties.
                     * @function create
                     * @memberof google.iam.v1.TestIamPermissionsResponse
                     * @static
                     * @param {google.iam.v1.ITestIamPermissionsResponse=} [properties] Properties to set
                     * @returns {google.iam.v1.TestIamPermissionsResponse} TestIamPermissionsResponse instance
                     */
                    TestIamPermissionsResponse.create = function create(properties) {
                        return new TestIamPermissionsResponse(properties);
                    };
    
                    /**
                     * Encodes the specified TestIamPermissionsResponse message. Does not implicitly {@link google.iam.v1.TestIamPermissionsResponse.verify|verify} messages.
                     * @function encode
                     * @memberof google.iam.v1.TestIamPermissionsResponse
                     * @static
                     * @param {google.iam.v1.ITestIamPermissionsResponse} message TestIamPermissionsResponse message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    TestIamPermissionsResponse.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.permissions != null && message.permissions.length)
                            for (var i = 0; i < message.permissions.length; ++i)
                                writer.uint32(/* id 1, wireType 2 =*/10).string(message.permissions[i]);
                        return writer;
                    };
    
                    /**
                     * Encodes the specified TestIamPermissionsResponse message, length delimited. Does not implicitly {@link google.iam.v1.TestIamPermissionsResponse.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof google.iam.v1.TestIamPermissionsResponse
                     * @static
                     * @param {google.iam.v1.ITestIamPermissionsResponse} message TestIamPermissionsResponse message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    TestIamPermissionsResponse.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };
    
                    /**
                     * Decodes a TestIamPermissionsResponse message from the specified reader or buffer.
                     * @function decode
                     * @memberof google.iam.v1.TestIamPermissionsResponse
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {google.iam.v1.TestIamPermissionsResponse} TestIamPermissionsResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    TestIamPermissionsResponse.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.iam.v1.TestIamPermissionsResponse();
                        while (reader.pos < end) {
                            var tag = reader.uint32();
                            switch (tag >>> 3) {
                            case 1:
                                if (!(message.permissions && message.permissions.length))
                                    message.permissions = [];
                                message.permissions.push(reader.string());
                                break;
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };
    
                    /**
                     * Decodes a TestIamPermissionsResponse message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof google.iam.v1.TestIamPermissionsResponse
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {google.iam.v1.TestIamPermissionsResponse} TestIamPermissionsResponse
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    TestIamPermissionsResponse.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };
    
                    /**
                     * Verifies a TestIamPermissionsResponse message.
                     * @function verify
                     * @memberof google.iam.v1.TestIamPermissionsResponse
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    TestIamPermissionsResponse.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.permissions != null && message.hasOwnProperty("permissions")) {
                            if (!Array.isArray(message.permissions))
                                return "permissions: array expected";
                            for (var i = 0; i < message.permissions.length; ++i)
                                if (!$util.isString(message.permissions[i]))
                                    return "permissions: string[] expected";
                        }
                        return null;
                    };
    
                    /**
                     * Creates a TestIamPermissionsResponse message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof google.iam.v1.TestIamPermissionsResponse
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {google.iam.v1.TestIamPermissionsResponse} TestIamPermissionsResponse
                     */
                    TestIamPermissionsResponse.fromObject = function fromObject(object) {
                        if (object instanceof $root.google.iam.v1.TestIamPermissionsResponse)
                            return object;
                        var message = new $root.google.iam.v1.TestIamPermissionsResponse();
                        if (object.permissions) {
                            if (!Array.isArray(object.permissions))
                                throw TypeError(".google.iam.v1.TestIamPermissionsResponse.permissions: array expected");
                            message.permissions = [];
                            for (var i = 0; i < object.permissions.length; ++i)
                                message.permissions[i] = String(object.permissions[i]);
                        }
                        return message;
                    };
    
                    /**
                     * Creates a plain object from a TestIamPermissionsResponse message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof google.iam.v1.TestIamPermissionsResponse
                     * @static
                     * @param {google.iam.v1.TestIamPermissionsResponse} message TestIamPermissionsResponse
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    TestIamPermissionsResponse.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        var object = {};
                        if (options.arrays || options.defaults)
                            object.permissions = [];
                        if (message.permissions && message.permissions.length) {
                            object.permissions = [];
                            for (var j = 0; j < message.permissions.length; ++j)
                                object.permissions[j] = message.permissions[j];
                        }
                        return object;
                    };
    
                    /**
                     * Converts this TestIamPermissionsResponse to JSON.
                     * @function toJSON
                     * @memberof google.iam.v1.TestIamPermissionsResponse
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    TestIamPermissionsResponse.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };
    
                    return TestIamPermissionsResponse;
                })();
    
                v1.logging = (function() {
    
                    /**
                     * Namespace logging.
                     * @memberof google.iam.v1
                     * @namespace
                     */
                    var logging = {};
    
                    logging.AuditData = (function() {
    
                        /**
                         * Properties of an AuditData.
                         * @memberof google.iam.v1.logging
                         * @interface IAuditData
                         * @property {google.iam.v1.IPolicyDelta|null} [policyDelta] AuditData policyDelta
                         */
    
                        /**
                         * Constructs a new AuditData.
                         * @memberof google.iam.v1.logging
                         * @classdesc Represents an AuditData.
                         * @implements IAuditData
                         * @constructor
                         * @param {google.iam.v1.logging.IAuditData=} [properties] Properties to set
                         */
                        function AuditData(properties) {
                            if (properties)
                                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                    if (properties[keys[i]] != null)
                                        this[keys[i]] = properties[keys[i]];
                        }
    
                        /**
                         * AuditData policyDelta.
                         * @member {google.iam.v1.IPolicyDelta|null|undefined} policyDelta
                         * @memberof google.iam.v1.logging.AuditData
                         * @instance
                         */
                        AuditData.prototype.policyDelta = null;
    
                        /**
                         * Creates a new AuditData instance using the specified properties.
                         * @function create
                         * @memberof google.iam.v1.logging.AuditData
                         * @static
                         * @param {google.iam.v1.logging.IAuditData=} [properties] Properties to set
                         * @returns {google.iam.v1.logging.AuditData} AuditData instance
                         */
                        AuditData.create = function create(properties) {
                            return new AuditData(properties);
                        };
    
                        /**
                         * Encodes the specified AuditData message. Does not implicitly {@link google.iam.v1.logging.AuditData.verify|verify} messages.
                         * @function encode
                         * @memberof google.iam.v1.logging.AuditData
                         * @static
                         * @param {google.iam.v1.logging.IAuditData} message AuditData message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        AuditData.encode = function encode(message, writer) {
                            if (!writer)
                                writer = $Writer.create();
                            if (message.policyDelta != null && message.hasOwnProperty("policyDelta"))
                                $root.google.iam.v1.PolicyDelta.encode(message.policyDelta, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                            return writer;
                        };
    
                        /**
                         * Encodes the specified AuditData message, length delimited. Does not implicitly {@link google.iam.v1.logging.AuditData.verify|verify} messages.
                         * @function encodeDelimited
                         * @memberof google.iam.v1.logging.AuditData
                         * @static
                         * @param {google.iam.v1.logging.IAuditData} message AuditData message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        AuditData.encodeDelimited = function encodeDelimited(message, writer) {
                            return this.encode(message, writer).ldelim();
                        };
    
                        /**
                         * Decodes an AuditData message from the specified reader or buffer.
                         * @function decode
                         * @memberof google.iam.v1.logging.AuditData
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @param {number} [length] Message length if known beforehand
                         * @returns {google.iam.v1.logging.AuditData} AuditData
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        AuditData.decode = function decode(reader, length) {
                            if (!(reader instanceof $Reader))
                                reader = $Reader.create(reader);
                            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.iam.v1.logging.AuditData();
                            while (reader.pos < end) {
                                var tag = reader.uint32();
                                switch (tag >>> 3) {
                                case 2:
                                    message.policyDelta = $root.google.iam.v1.PolicyDelta.decode(reader, reader.uint32());
                                    break;
                                default:
                                    reader.skipType(tag & 7);
                                    break;
                                }
                            }
                            return message;
                        };
    
                        /**
                         * Decodes an AuditData message from the specified reader or buffer, length delimited.
                         * @function decodeDelimited
                         * @memberof google.iam.v1.logging.AuditData
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @returns {google.iam.v1.logging.AuditData} AuditData
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        AuditData.decodeDelimited = function decodeDelimited(reader) {
                            if (!(reader instanceof $Reader))
                                reader = new $Reader(reader);
                            return this.decode(reader, reader.uint32());
                        };
    
                        /**
                         * Verifies an AuditData message.
                         * @function verify
                         * @memberof google.iam.v1.logging.AuditData
                         * @static
                         * @param {Object.<string,*>} message Plain object to verify
                         * @returns {string|null} `null` if valid, otherwise the reason why it is not
                         */
                        AuditData.verify = function verify(message) {
                            if (typeof message !== "object" || message === null)
                                return "object expected";
                            if (message.policyDelta != null && message.hasOwnProperty("policyDelta")) {
                                var error = $root.google.iam.v1.PolicyDelta.verify(message.policyDelta);
                                if (error)
                                    return "policyDelta." + error;
                            }
                            return null;
                        };
    
                        /**
                         * Creates an AuditData message from a plain object. Also converts values to their respective internal types.
                         * @function fromObject
                         * @memberof google.iam.v1.logging.AuditData
                         * @static
                         * @param {Object.<string,*>} object Plain object
                         * @returns {google.iam.v1.logging.AuditData} AuditData
                         */
                        AuditData.fromObject = function fromObject(object) {
                            if (object instanceof $root.google.iam.v1.logging.AuditData)
                                return object;
                            var message = new $root.google.iam.v1.logging.AuditData();
                            if (object.policyDelta != null) {
                                if (typeof object.policyDelta !== "object")
                                    throw TypeError(".google.iam.v1.logging.AuditData.policyDelta: object expected");
                                message.policyDelta = $root.google.iam.v1.PolicyDelta.fromObject(object.policyDelta);
                            }
                            return message;
                        };
    
                        /**
                         * Creates a plain object from an AuditData message. Also converts values to other types if specified.
                         * @function toObject
                         * @memberof google.iam.v1.logging.AuditData
                         * @static
                         * @param {google.iam.v1.logging.AuditData} message AuditData
                         * @param {$protobuf.IConversionOptions} [options] Conversion options
                         * @returns {Object.<string,*>} Plain object
                         */
                        AuditData.toObject = function toObject(message, options) {
                            if (!options)
                                options = {};
                            var object = {};
                            if (options.defaults)
                                object.policyDelta = null;
                            if (message.policyDelta != null && message.hasOwnProperty("policyDelta"))
                                object.policyDelta = $root.google.iam.v1.PolicyDelta.toObject(message.policyDelta, options);
                            return object;
                        };
    
                        /**
                         * Converts this AuditData to JSON.
                         * @function toJSON
                         * @memberof google.iam.v1.logging.AuditData
                         * @instance
                         * @returns {Object.<string,*>} JSON object
                         */
                        AuditData.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                        };
    
                        return AuditData;
                    })();
    
                    return logging;
                })();
    
                return v1;
            })();
    
            return iam;
        })();
    })
})
