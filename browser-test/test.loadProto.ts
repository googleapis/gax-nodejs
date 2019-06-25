import * as assert from 'assert';
// import * as expect from 'expect';

import * as protobuf from 'protobufjs';
import { GrpcClient } from '../src/browser';

import { echoProtoJson } from './fixtures/keys';

describe('loadProto', () => {
    const opts = {};
    const gaxGrpc = new GrpcClient(opts);

    it('should add two integers', () => {
      console.log('test 1 is running');
      assert.strictEqual(8, 8);
    });

    it('should create a root object', () => {
        console.log('echo test is running');
        const protos = gaxGrpc.loadProto(echoProtoJson);
        // How to check if it's an instance of a protobuf root?
        assert(protos instanceof protobuf.Root);
        assert(protos.lookupService('Echo') instanceof protobuf.Service);
        assert(protos.lookupType('EchoRequest') instanceof protobuf.Type);
        // assert.strictEqual(protos.name, 'Echo');
    });

    // What should an empty root look like?
    it('should be able to load no files', () => {
        const protos = gaxGrpc.loadProto({});
        assert.strictEqual(protos.name, '');
        // Should I have this in here or is it too specific?
        assert(protos.nested === undefined);
        assert.strictEqual(protos.nested, undefined)
    });

    // it('should throw an error when given a nonexistent JSON', () => {
    //     const nonExistentFile = 'nonexistent.json';
    //     expect(gaxGrpc.loadProto(nonExistentFile)).to.throwError();
    // });
});

describe('constructSettings', () => {

});

describe('createStub', () => {

});



