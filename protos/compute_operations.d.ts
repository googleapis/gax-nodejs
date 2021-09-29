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

import * as $protobuf from "protobufjs";
/** Properties of an Operation. */
export interface IOperation {

    /** Operation clientOperationId */
    clientOperationId?: (string|null);

    /** Operation creationTimestamp */
    creationTimestamp?: (string|null);

    /** Operation description */
    description?: (string|null);

    /** Operation endTime */
    endTime?: (string|null);

    /** Operation error */
    error?: (IError|null);

    /** Operation httpErrorMessage */
    httpErrorMessage?: (string|null);

    /** Operation httpErrorStatusCode */
    httpErrorStatusCode?: (number|null);

    /** Operation id */
    id?: (number|Long|null);

    /** Operation insertTime */
    insertTime?: (string|null);

    /** Operation kind */
    kind?: (string|null);

    /** Operation name */
    name?: (string|null);

    /** Operation operationGroupId */
    operationGroupId?: (string|null);

    /** Operation operationType */
    operationType?: (string|null);

    /** Operation progress */
    progress?: (number|null);

    /** Operation region */
    region?: (string|null);

    /** Operation selfLink */
    selfLink?: (string|null);

    /** Operation startTime */
    startTime?: (string|null);

    /** Operation status */
    status?: (Operation.Status|null);

    /** Operation statusMessage */
    statusMessage?: (string|null);

    /** Operation targetId */
    targetId?: (number|Long|null);

    /** Operation targetLink */
    targetLink?: (string|null);

    /** Operation user */
    user?: (string|null);

    /** Operation warnings */
    warnings?: (IWarnings[]|null);

    /** Operation zone */
    zone?: (string|null);
}

/** Represents an Operation. */
export class Operation implements IOperation {

    /**
     * Constructs a new Operation.
     * @param [properties] Properties to set
     */
    constructor(properties?: IOperation);

    /** Operation clientOperationId. */
    public clientOperationId: string;

    /** Operation creationTimestamp. */
    public creationTimestamp: string;

    /** Operation description. */
    public description: string;

    /** Operation endTime. */
    public endTime: string;

    /** Operation error. */
    public error?: (IError|null);

    /** Operation httpErrorMessage. */
    public httpErrorMessage: string;

    /** Operation httpErrorStatusCode. */
    public httpErrorStatusCode: number;

    /** Operation id. */
    public id: (number|Long);

    /** Operation insertTime. */
    public insertTime: string;

    /** Operation kind. */
    public kind: string;

    /** Operation name. */
    public name: string;

    /** Operation operationGroupId. */
    public operationGroupId: string;

    /** Operation operationType. */
    public operationType: string;

    /** Operation progress. */
    public progress: number;

    /** Operation region. */
    public region: string;

    /** Operation selfLink. */
    public selfLink: string;

    /** Operation startTime. */
    public startTime: string;

    /** Operation status. */
    public status: Operation.Status;

    /** Operation statusMessage. */
    public statusMessage: string;

    /** Operation targetId. */
    public targetId: (number|Long);

    /** Operation targetLink. */
    public targetLink: string;

    /** Operation user. */
    public user: string;

    /** Operation warnings. */
    public warnings: IWarnings[];

    /** Operation zone. */
    public zone: string;

    /**
     * Creates a new Operation instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Operation instance
     */
    public static create(properties?: IOperation): Operation;

    /**
     * Encodes the specified Operation message. Does not implicitly {@link Operation.verify|verify} messages.
     * @param message Operation message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IOperation, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Operation message, length delimited. Does not implicitly {@link Operation.verify|verify} messages.
     * @param message Operation message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IOperation, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes an Operation message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Operation
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Operation;

    /**
     * Decodes an Operation message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Operation
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Operation;

    /**
     * Verifies an Operation message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates an Operation message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Operation
     */
    public static fromObject(object: { [k: string]: any }): Operation;

    /**
     * Creates a plain object from an Operation message. Also converts values to other types if specified.
     * @param message Operation
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: Operation, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Operation to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

export namespace Operation {

    /** Status enum. */
    enum Status {
        UNDEFINED_STATUS = 0,
        DONE = 2104194,
        PENDING = 35394935,
        RUNNING = 121282975
    }
}

/** Properties of a Warnings. */
export interface IWarnings {

    /** Warnings code */
    code?: (string|null);

    /** Warnings data */
    data?: (IData[]|null);

    /** Warnings message */
    message?: (string|null);
}

/** Represents a Warnings. */
export class Warnings implements IWarnings {

    /**
     * Constructs a new Warnings.
     * @param [properties] Properties to set
     */
    constructor(properties?: IWarnings);

    /** Warnings code. */
    public code: string;

    /** Warnings data. */
    public data: IData[];

    /** Warnings message. */
    public message: string;

    /**
     * Creates a new Warnings instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Warnings instance
     */
    public static create(properties?: IWarnings): Warnings;

    /**
     * Encodes the specified Warnings message. Does not implicitly {@link Warnings.verify|verify} messages.
     * @param message Warnings message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IWarnings, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Warnings message, length delimited. Does not implicitly {@link Warnings.verify|verify} messages.
     * @param message Warnings message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IWarnings, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a Warnings message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Warnings
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Warnings;

    /**
     * Decodes a Warnings message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Warnings
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Warnings;

    /**
     * Verifies a Warnings message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a Warnings message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Warnings
     */
    public static fromObject(object: { [k: string]: any }): Warnings;

    /**
     * Creates a plain object from a Warnings message. Also converts values to other types if specified.
     * @param message Warnings
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: Warnings, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Warnings to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

export namespace Warnings {

    /** Code enum. */
    enum Code {
        UNDEFINED_CODE = 0,
        CLEANUP_FAILED = 150308440,
        DEPRECATED_RESOURCE_USED = 391835586,
        DEPRECATED_TYPE_USED = 346526230,
        DISK_SIZE_LARGER_THAN_IMAGE_SIZE = 369442967,
        EXPERIMENTAL_TYPE_USED = 451954443,
        EXTERNAL_API_WARNING = 175546307,
        FIELD_VALUE_OVERRIDEN = 329669423,
        INJECTED_KERNELS_DEPRECATED = 417377419,
        LARGE_DEPLOYMENT_WARNING = 481440678,
        MISSING_TYPE_DEPENDENCY = 344505463,
        NEXT_HOP_ADDRESS_NOT_ASSIGNED = 324964999,
        NEXT_HOP_CANNOT_IP_FORWARD = 383382887,
        NEXT_HOP_INSTANCE_NOT_FOUND = 464250446,
        NEXT_HOP_INSTANCE_NOT_ON_NETWORK = 243758146,
        NEXT_HOP_NOT_RUNNING = 417081265,
        NOT_CRITICAL_ERROR = 105763924,
        NO_RESULTS_ON_PAGE = 30036744,
        PARTIAL_SUCCESS = 39966469,
        REQUIRED_TOS_AGREEMENT = 3745539,
        RESOURCE_IN_USE_BY_OTHER_RESOURCE_WARNING = 496728641,
        RESOURCE_NOT_DELETED = 168598460,
        SCHEMA_VALIDATION_IGNORED = 275245642,
        SINGLE_INSTANCE_PROPERTY_TEMPLATE = 268305617,
        UNDECLARED_PROPERTIES = 390513439,
        UNREACHABLE = 13328052
    }
}

/** Properties of an Error. */
export interface IError {

    /** Error errors */
    errors?: (IErrors[]|null);
}

/** Represents an Error. */
export class Error implements IError {

    /**
     * Constructs a new Error.
     * @param [properties] Properties to set
     */
    constructor(properties?: IError);

    /** Error errors. */
    public errors: IErrors[];

    /**
     * Creates a new Error instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Error instance
     */
    public static create(properties?: IError): Error;

    /**
     * Encodes the specified Error message. Does not implicitly {@link Error.verify|verify} messages.
     * @param message Error message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IError, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Error message, length delimited. Does not implicitly {@link Error.verify|verify} messages.
     * @param message Error message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IError, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes an Error message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Error
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Error;

    /**
     * Decodes an Error message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Error
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Error;

    /**
     * Verifies an Error message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates an Error message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Error
     */
    public static fromObject(object: { [k: string]: any }): Error;

    /**
     * Creates a plain object from an Error message. Also converts values to other types if specified.
     * @param message Error
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: Error, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Error to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of an Errors. */
export interface IErrors {

    /** Errors code */
    code?: (string|null);

    /** Errors location */
    location?: (string|null);

    /** Errors message */
    message?: (string|null);
}

/** Represents an Errors. */
export class Errors implements IErrors {

    /**
     * Constructs a new Errors.
     * @param [properties] Properties to set
     */
    constructor(properties?: IErrors);

    /** Errors code. */
    public code: string;

    /** Errors location. */
    public location: string;

    /** Errors message. */
    public message: string;

    /**
     * Creates a new Errors instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Errors instance
     */
    public static create(properties?: IErrors): Errors;

    /**
     * Encodes the specified Errors message. Does not implicitly {@link Errors.verify|verify} messages.
     * @param message Errors message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IErrors, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Errors message, length delimited. Does not implicitly {@link Errors.verify|verify} messages.
     * @param message Errors message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IErrors, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes an Errors message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Errors
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Errors;

    /**
     * Decodes an Errors message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Errors
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Errors;

    /**
     * Verifies an Errors message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates an Errors message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Errors
     */
    public static fromObject(object: { [k: string]: any }): Errors;

    /**
     * Creates a plain object from an Errors message. Also converts values to other types if specified.
     * @param message Errors
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: Errors, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Errors to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a Data. */
export interface IData {

    /** Data key */
    key?: (string|null);

    /** Data value */
    value?: (string|null);
}

/** Represents a Data. */
export class Data implements IData {

    /**
     * Constructs a new Data.
     * @param [properties] Properties to set
     */
    constructor(properties?: IData);

    /** Data key. */
    public key: string;

    /** Data value. */
    public value: string;

    /**
     * Creates a new Data instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Data instance
     */
    public static create(properties?: IData): Data;

    /**
     * Encodes the specified Data message. Does not implicitly {@link Data.verify|verify} messages.
     * @param message Data message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IData, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Data message, length delimited. Does not implicitly {@link Data.verify|verify} messages.
     * @param message Data message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IData, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a Data message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Data
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Data;

    /**
     * Decodes a Data message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Data
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Data;

    /**
     * Verifies a Data message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a Data message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Data
     */
    public static fromObject(object: { [k: string]: any }): Data;

    /**
     * Creates a plain object from a Data message. Also converts values to other types if specified.
     * @param message Data
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: Data, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Data to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}
