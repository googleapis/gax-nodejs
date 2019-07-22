import * as assert from 'assert';
import * as protobuf from 'protobufjs';
import * as sinon from 'sinon';
import {echoProtoJson} from './fixtures/echoProtoJson';
import {expect} from 'chai';
import {GrpcClient} from '../src/browser';

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

const createdAbortControllers = [];

//tslint:disable-next-line variable-name
const AbortController = function() {
  // @ts-ignore
  this.abort = function() {
    // @ts-ignore
    this.abortCalled = true;
  };
  // @ts-ignore
  createdAbortControllers.push(this);
};

// @ts-ignore
window.AbortController = AbortController;

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
    expect(echoStub.pagedExpand).to.be.a('Function');
    expect(echoStub.wait).to.be.a('Function');

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

  it('should be able to cancel an API call using AbortController', async () => {
    const fakeFetch = sinon.fake.resolves(new Response());
    sinon.replace(window, 'fetch', fakeFetch);

    const echoStub = await gaxGrpc.createStub(echoService, stubOptions);
    const request = {content: 'content' + new Date().toString()};
    const a = echoStub.echo(request, {}, {}, (err, result) => {});

    a.cancel();

    // @ts-ignore
    assert.strictEqual(createdAbortControllers[0].abortCalled, true);
  });
});
