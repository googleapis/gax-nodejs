import * as protobuf from 'protobufjs'

export class GrpcClient {
    loadProto(jsonObject) {
        const rootObject = protobuf.Root.fromJSON(jsonObject);
        return rootObject;
    }
    constructSettings() {}
    createStub() {}
};
