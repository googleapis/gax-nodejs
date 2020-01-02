/*
 * Copyright 2019 Google LLC
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
 */

import {expect} from 'chai';
import * as sinon from 'sinon';
import * as through2 from 'through2';

import {GaxCallStream, GRPCCall} from '../../src/apitypes';
import {createApiCall} from '../../src/createApiCall';
import * as gax from '../../src/gax';
import {StreamDescriptor} from '../../src/streamingCalls/streamDescriptor';
import * as streaming from '../../src/streamingCalls/streaming';
import {APICallback} from '../../src/apitypes';
import internal = require('stream');

function createApiCallStreaming(
  func: Promise<GRPCCall> | sinon.SinonSpy<Array<{}>, internal.Transform>,
  type: streaming.StreamType
) {
  const settings = new gax.CallSettings();
  return createApiCall(
    //@ts-ignore
    Promise.resolve(func),
    settings,
    new StreamDescriptor(type)
  ) as GaxCallStream;
}

describe('streaming', () => {
  it('handles server streaming', done => {
    const spy = sinon.spy((...args: Array<{}>) => {
      expect(args.length).to.eq(3);
      const s = through2.obj();
      s.push({resources: [1, 2]});
      s.push({resources: [3, 4, 5]});
      s.push(null);
      setImmediate(() => {
        s.emit('metadata');
      });
      return s;
    });

    const apiCall = createApiCallStreaming(
      spy,
      streaming.StreamType.SERVER_STREAMING
    );
    const s = apiCall({}, undefined);
    const callback = sinon.spy(data => {
      if (callback.callCount === 1) {
        expect(data).to.deep.equal({resources: [1, 2]});
      } else {
        expect(data).to.deep.equal({resources: [3, 4, 5]});
      }
    });
    // tslint:disable-next-line no-unused-expression
    expect(s.readable).to.be.true;
    // tslint:disable-next-line no-unused-expression
    expect(s.writable).to.be.false;
    s.on('data', callback);
    s.on('end', () => {
      expect(callback.callCount).to.eq(2);
      done();
    });
  });

  it('handles client streaming', done => {
    function func(metadata: {}, options: {}, callback: APICallback) {
      expect(arguments.length).to.eq(3);
      const s = through2.obj();
      const written: Array<{}> = [];
      s.on('end', () => {
        callback(null, written);
      });
      s.on('error', callback);
      s.on('data', data => {
        written.push(data);
      });
      return s;
    }

    const apiCall = createApiCallStreaming(
      //@ts-ignore
      func,
      streaming.StreamType.CLIENT_STREAMING
    );
    const s = apiCall({}, undefined, (err, response) => {
      // tslint:disable-next-line no-unused-expression
      expect(err).to.be.null;
      expect(response).to.deep.eq(['foo', 'bar']);
      done();
    });
    // tslint:disable-next-line no-unused-expression
    expect(s.readable).to.be.false;
    // tslint:disable-next-line no-unused-expression
    expect(s.writable).to.be.true;
    s.write('foo');
    s.write('bar');
    s.end();
  });

  it('handles bidi streaming', done => {
    function func() {
      expect(arguments.length).to.eq(2);
      const s = through2.obj();
      setImmediate(() => {
        s.emit('metadata');
      });
      return s;
    }

    const apiCall = createApiCallStreaming(
      //@ts-ignore
      func,
      streaming.StreamType.BIDI_STREAMING
    );
    const s = apiCall({}, undefined);
    const arg = {foo: 'bar'};
    const callback = sinon.spy(data => {
      expect(data).to.eq(arg);
    });
    s.on('data', callback);
    s.on('end', () => {
      expect(callback.callCount).to.eq(2);
      done();
    });
    // tslint:disable-next-line no-unused-expression
    expect(s.readable).to.be.true;
    // tslint:disable-next-line no-unused-expression
    expect(s.writable).to.be.true;
    s.write(arg);
    s.write(arg);
    s.end();
  });

  it('forwards metadata and status', done => {
    const responseMetadata = {metadata: true};
    const status = {code: 0, metadata: responseMetadata};
    const expectedResponse = {
      code: 200,
      message: 'OK',
      details: '',
      metadata: responseMetadata,
    };
    function func() {
      const s = through2.obj();
      setTimeout(() => {
        s.emit('metadata', responseMetadata);
      }, 10);
      s.on('finish', () => {
        s.emit('status', status);
      });
      return s;
    }
    const apiCall = createApiCallStreaming(
      //@ts-ignore
      func,
      streaming.StreamType.BIDI_STREAMING
    );
    const s = apiCall({}, undefined);
    let receivedMetadata: {};
    let receivedStatus: {};
    let receivedResponse: {};
    s.on('metadata', data => {
      receivedMetadata = data;
    });
    s.on('status', data => {
      receivedStatus = data;
    });
    s.on('response', data => {
      receivedResponse = data;
    });
    s.on('finish', () => {
      expect(receivedMetadata).to.deep.eq(responseMetadata);
      expect(receivedStatus).to.deep.eq(status);
      expect(receivedResponse).to.deep.eq(expectedResponse);
      done();
    });
    // tslint:disable-next-line no-unused-expression
    expect(s.readable).to.be.true;
    // tslint:disable-next-line no-unused-expression
    expect(s.writable).to.be.true;
    setTimeout(() => {
      s.end(s);
    }, 50);
  });

  it('cancels in the middle', done => {
    // tslint:disable-next-line no-any
    function schedulePush(s: any, c: number) {
      const intervalId = setInterval(() => {
        s.push(c);
        c++;
      }, 10);
      s.on('finish', () => {
        clearInterval(intervalId);
      });
    }
    const cancelError = new Error('cancelled');
    function func() {
      const s = through2.obj();
      schedulePush(s, 0);
      // tslint:disable-next-line no-any
      (s as any).cancel = () => {
        s.end();
        s.emit('error', cancelError);
      };
      setImmediate(() => {
        s.emit('metadata');
      });
      return s;
    }
    const apiCall = createApiCallStreaming(
      //@ts-ignore
      func,
      streaming.StreamType.SERVER_STREAMING
    );
    const s = apiCall({}, undefined);
    let counter = 0;
    const expectedCount = 5;
    s.on('data', data => {
      expect(data).to.eq(counter);
      counter++;
      if (counter === expectedCount) {
        s.cancel();
      } else if (counter > expectedCount) {
        done(new Error('should not reach'));
      }
    });
    s.on('error', err => {
      expect(err).to.eq(cancelError);
      done();
    });
  });
});
