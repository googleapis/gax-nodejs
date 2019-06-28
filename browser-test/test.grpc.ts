import * as assert from 'assert';
import {expect} from 'chai';
import * as protobuf from 'protobufjs';
import {GrpcClient} from '../src/browser';
import {echoProtoJson} from './fixtures/echoProtoJson';

const authStub = {
  getRequestHeaders() {
    return {Authorization: 'Bearer SOME_TOKEN'};
  },
};

const opts = {
  auth: authStub,
};

// @ts-ignore incomplete options
const gaxGrpc = new GrpcClient(opts);

describe('loadProto', () => {
  it('should create a root object', () => {
    const protos = gaxGrpc.loadProto(echoProtoJson);

    assert(protos instanceof protobuf.Root);
    assert(protos.lookupService('Echo') instanceof protobuf.Service);
    assert(protos.lookupType('EchoRequest') instanceof protobuf.Type);
  });

  it('should be able to load no files', () => {
    const protos = gaxGrpc.loadProto({});
    assert(protos instanceof protobuf.Root);

    assert(protos.nested === undefined);
    assert.strictEqual(protos.nested, undefined);
  });
});

describe('createStub', () => {
  let protos, echoService, stubOptions, stubExtraOptions;

  beforeEach(() => {
    protos = gaxGrpc.loadProto(echoProtoJson);
    echoService = protos.lookupService('Echo');
    stubOptions = {
      servicePath: 'foo.example.com',
      port: 443,
    };
    stubExtraOptions = {
      servicePath: 'foo.example.com',
      port: 443,
      other_dummy_options: 'test',
    };
  });

  it('should create a stub', async () => {
    // tslint:disable-next-line no-any
    const echoStub: any = await gaxGrpc.createStub(echoService, stubOptions);

    assert(echoStub instanceof protobuf.rpc.Service);

    // The stub should consist of service methods
    expect(echoStub.echo).to.be.a('Function');
    expect(echoStub.collect).to.be.a('Function');
    expect(echoStub.chat).to.be.a('Function');

    // There should be 6 methods for the echo service (and 4 other methods in the object)
    assert.strictEqual(Object.keys(echoStub).length, 10);

    // Each of the service methods should take 4 arguments (so that it works with createApiCall)
    assert.strictEqual(echoStub.echo.length, 4);
  });

  it('should support optional parameters', async () => {
    // tslint:disable-next-line no-any
    const echoStub: any = await gaxGrpc.createStub(
      echoService,
      stubExtraOptions
    );

    assert(echoStub instanceof protobuf.rpc.Service);

    // The stub should consist of methods
    expect(echoStub.echo).to.be.a('Function');
    expect(echoStub.collect).to.be.a('Function');
    expect(echoStub.chat).to.be.a('Function');

    // There should be 6 methods for the echo service (and 4 other members in the object)
    assert.strictEqual(Object.keys(echoStub).length, 10);

    // Each of the service methods should take 4 arguments (so that it works with createApiCall)
    assert.strictEqual(echoStub.echo.length, 4);
  });
});
