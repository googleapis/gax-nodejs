/* Copyright 2019 Google LLC
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
import {status} from '@grpc/grpc-js';
import * as sinon from 'sinon';

import {BundleDescriptor} from '../src/bundlingCalls/bundleDescriptor';
import {BundleExecutor} from '../src/bundlingCalls/bundleExecutor';
import {computeBundleId} from '../src/bundlingCalls/bundlingUtils';
import {deepCopyForResponse, Task} from '../src/bundlingCalls/task';
import {GoogleError} from '../src/googleError';

import {createApiCall} from './utils';

function createOuter(value, otherValue?) {
  if (otherValue === undefined) {
    otherValue = value;
  }
  return {inner: {field1: value, field2: otherValue}, field1: value};
}

function byteLength(obj) {
  return JSON.stringify(obj).length;
}

describe('computeBundleId', () => {
  describe('computes the bundle identifier', () => {
    const testCases = [
      {
        message: 'single field value',
        object: {field1: 'dummy_value'},
        fields: ['field1'],
        want: '["dummy_value"]',
      },
      {
        message: 'composite value with missing field2',
        object: {field1: 'dummy_value'},
        fields: ['field1', 'field2'],
        want: '["dummy_value",null]',
      },
      {
        message: 'a composite value',
        object: {field1: 'dummy_value', field2: 'other_value'},
        fields: ['field1', 'field2'],
        want: '["dummy_value","other_value"]',
      },
      {
        message: 'null',
        object: {field1: null},
        fields: ['field1'],
        want: '[null]',
      },
      {
        message: 'partially nonexisting fields',
        object: {field1: 'dummy_value', field2: 'other_value'},
        fields: ['field1', 'field3'],
        want: '["dummy_value",null]',
      },
      {
        message: 'numeric',
        object: {field1: 42},
        fields: ['field1'],
        want: '[42]',
      },
      {
        message: 'structured data',
        object: {field1: {foo: 'bar', baz: 42}},
        fields: ['field1'],
        want: '[{"foo":"bar","baz":42}]',
      },
      {
        message: 'a simple dotted value',
        object: createOuter('this is dotty'),
        fields: ['inner.field1'],
        want: '["this is dotty"]',
      },
      {
        message: 'a complex case',
        object: createOuter('what!?'),
        fields: ['inner.field1', 'inner.field2', 'field1'],
        want: '["what!?","what!?","what!?"]',
      },
    ];
    testCases.forEach(t => {
      it(t.message, () => {
        expect(computeBundleId(t.object, t.fields)).to.equal(t.want);
      });
    });
  });

  describe('returns undefined if failed', () => {
    const testCases = [
      {
        message: 'empty discriminator fields',
        object: {field1: 'dummy_value'},
        fields: [],
      },
      {
        message: 'nonexisting fields',
        object: {field1: 'dummy_value'},
        fields: ['field3'],
      },
      {
        message: 'fails to look up in the middle',
        object: createOuter('this is dotty'),
        fields: ['inner.field3'],
      },
    ];
    testCases.forEach(t => {
      it(t.message, () => {
        // tslint:disable-next-line no-unused-expression
        expect(computeBundleId(t.object, t.fields)).to.be.undefined;
      });
    });
  });
});

describe('deepCopyForResponse', () => {
  it('copies deeply', () => {
    const input = {foo: {bar: [1, 2]}};
    const output = deepCopyForResponse(input, null);
    expect(output).to.deep.equal(input);
    expect(output.foo).to.not.equal(input.foo);
    expect(output.foo.bar).to.not.equal(input.foo.bar);
  });

  it('respects subresponseInfo', () => {
    const input = {foo: [1, 2, 3, 4], bar: {foo: [1, 2, 3, 4]}};
    const output = deepCopyForResponse(input, {
      field: 'foo',
      start: 0,
      end: 2,
    });
    expect(output).to.deep.equal({foo: [1, 2], bar: {foo: [1, 2, 3, 4]}});
    expect(output.bar).to.not.equal(input.bar);

    const output2 = deepCopyForResponse(input, {
      field: 'foo',
      start: 2,
      end: 4,
    });
    expect(output2).to.deep.equal({foo: [3, 4], bar: {foo: [1, 2, 3, 4]}});
    expect(output2.bar).to.not.equal(input.bar);
  });

  it('deep copies special values', () => {
    class Copyable {
      constructor(public id) {}
      copy() {
        return new Copyable(this.id);
      }
    }
    const input = {
      copyable: new Copyable(0),
      arraybuffer: new ArrayBuffer(10),
      nullvalue: null,
      array: [1, 2, 3],
      number: 1,
      boolean: false,
      obj: {
        foo: 1,
      },
    };
    const output = deepCopyForResponse(input, null);
    expect(output).to.deep.equal(input);
    expect(output.copyable).to.not.equal(input.copyable);
    expect(output.arraybuffer).to.not.equal(input.arraybuffer);
    expect(output.array).to.not.equal(input.array);
  });

  it('ignores erroneous subresponseInfo', () => {
    const input = {foo: 1, bar: {foo: [1, 2, 3, 4]}};
    const output = deepCopyForResponse(input, {
      field: 'foo',
      start: 0,
      end: 2,
    });
    expect(output).to.deep.equal(input);
  });
});

describe('Task', () => {
  function testTask(apiCall?) {
    return new Task(apiCall, {}, 'field1', null);
  }

  let id = 0;
  function extendElements(task, elements, callback?) {
    if (!callback) {
      callback = () => {};
    }
    callback.id = id++;
    let bytes = 0;
    elements.forEach(element => {
      bytes += byteLength(element);
    });
    task.extend(elements, bytes, callback);
  }

  describe('extend', () => {
    const data = 'a simple msg';
    const testCases = [
      {
        data: [],
        message: 'no messages added',
        want: 0,
      },
      {
        data: [data],
        message: 'a single message added',
        want: 1,
      },
      {
        data: [data, data, data, data, data],
        message: '5 messages added',
        want: 5,
      },
    ];
    describe('increases the element count', () => {
      testCases.forEach(t => {
        it(t.message, () => {
          const task = testTask();
          const baseCount = task.getElementCount();
          extendElements(task, t.data);
          expect(task.getElementCount()).to.eq(baseCount + t.want, t.message);
        });
      });
    });

    describe('increases the byte size', () => {
      const sizePerData = JSON.stringify(data).length;
      testCases.forEach(t => {
        it(t.message, () => {
          const task = testTask();
          const baseSize = task.getRequestByteSize();
          extendElements(task, t.data);
          expect(task.getRequestByteSize()).to.eq(
            baseSize + t.want * sizePerData
          );
        });
      });
    });
  });

  describe('run', () => {
    const data = 'test message';
    const testCases = [
      {
        data: [],
        message: 'no messages added',
        expected: null,
      },
      {
        data: [[data]],
        message: 'a single message added',
        expected: [data],
      },
      {
        data: [[data, data], [data, data, data]],
        message: 'a single message added',
        expected: [data, data, data, data, data],
      },
      {
        data: [[data, data, data, data, data]],
        message: '5 messages added',
        expected: [data, data, data, data, data],
      },
    ];
    function createApiCall(expected) {
      return function apiCall(req, callback) {
        expect(req.field1).to.deep.equal(expected);
        return callback(null, req);
      };
    }

    describe('sends bundled elements', () => {
      testCases.forEach(t => {
        it(t.message, done => {
          const apiCall = sinon.spy(createApiCall(t.expected));
          const task = testTask(apiCall);
          const callback = sinon.spy((err, data) => {
            // tslint:disable-next-line no-unused-expression
            expect(err).to.be.null;
            expect(data).to.be.an.instanceOf(Object);
            if (callback.callCount === t.data.length) {
              expect(apiCall.callCount).to.eq(1);
              done();
            }
          });
          // tslint:disable-next-line no-any
          (t as any).data.forEach(d => {
            extendElements(task, d, callback);
          });
          task.run();
          if (t.expected === null) {
            expect(callback.callCount).to.eq(0);
            expect(apiCall.callCount).to.eq(0);
            done();
          }
        });
      });
    });

    describe('calls back with the subresponse fields', () => {
      testCases.forEach(t => {
        it(t.message, done => {
          const apiCall = sinon.spy(createApiCall(t.expected));
          const task = testTask(apiCall);
          task._subresponseField = 'field1';
          let callbackCount = 0;
          // tslint:disable-next-line no-any
          (t as any).data.forEach(d => {
            extendElements(task, d, (err, data) => {
              // tslint:disable-next-line no-unused-expression
              expect(err).to.be.null;
              expect(data.field1.length).to.be.eq(d.length);
              callbackCount++;
              if (callbackCount === t.data.length) {
                expect(apiCall.callCount).to.eq(1);
                done();
              }
            });
          });
          task.run();
          if (t.expected === null) {
            expect(callbackCount).to.eq(0);
            expect(apiCall.callCount).to.eq(0);
            done();
          }
        });
      });
    });

    describe('calls back with fail if API fails', () => {
      testCases.slice(1).forEach(t => {
        it(t.message, done => {
          const err = new Error('failure');
          const apiCall = sinon.spy((resp, callback) => {
            callback(err);
          });
          const task = testTask(apiCall);
          task._subresponseField = 'field1';
          const callback = sinon.spy((e, data) => {
            expect(e).to.equal(err);
            // tslint:disable-next-line no-unused-expression
            expect(data).to.be.undefined;
            if (callback.callCount === t.data.length) {
              expect(apiCall.callCount).to.eq(1);
              done();
            }
          });
          // tslint:disable-next-line no-any
          (t as any).data.forEach(d => {
            extendElements(task, d, callback);
          });
          task.run();
        });
      });
    });
  });

  it('cancels existing data', done => {
    const apiCall = sinon.spy((resp, callback) => {
      callback(null, resp);
    });
    const task = testTask(apiCall);
    task._subresponseField = 'field1';
    const callback = sinon.spy(() => {
      if (callback.callCount === 2) {
        done();
      }
    });
    extendElements(task, [1, 2, 3], (err, resp) => {
      expect(resp.field1).to.deep.equal([1, 2, 3]);
      callback();
    });
    extendElements(task, [4, 5, 6], err => {
      expect(err).to.be.an.instanceOf(GoogleError);
      expect(err!.code).to.equal(status.CANCELLED);
    });
    const cancelId = task._data[task._data.length - 1].callback.id;

    extendElements(task, [7, 8, 9], (err, resp) => {
      expect(resp.field1).to.deep.equal([7, 8, 9]);
      callback();
    });

    task.cancel(cancelId!);
    task.run();
  });

  it('cancels ongoing API call', done => {
    const apiCall = sinon.spy((resp, callback) => {
      const timeoutId = setTimeout(() => {
        callback(null, resp);
      }, 100);
      return {
        cancel() {
          clearTimeout(timeoutId);
          callback(new Error('cancelled'));
        },
      };
    });

    const task = testTask(apiCall);
    const callback = sinon.spy(() => {
      if (callback.callCount === 2) {
        done();
      }
    });
    extendElements(task, [1, 2, 3], err => {
      expect(err).to.be.an.instanceOf(GoogleError);
      expect(err!.code).to.equal(status.CANCELLED);
      callback();
    });
    extendElements(task, [1, 2, 3], err => {
      expect(err).to.be.an.instanceOf(GoogleError);
      expect(err!.code).to.equal(status.CANCELLED);
      callback();
    });
    task.run();
    task._data.forEach(data => {
      task.cancel(data.callback.id!);
    });
  });

  it('partially cancels ongoing API call', done => {
    const apiCall = sinon.spy((resp, callback) => {
      const timeoutId = setTimeout(() => {
        callback(null, resp);
      }, 100);
      return {
        cancel: () => {
          clearTimeout(timeoutId);
          callback(new Error('cancelled'));
        },
      };
    });

    const task = testTask(apiCall);
    task._subresponseField = 'field1';
    const callback = sinon.spy(() => {
      if (callback.callCount === 2) {
        done();
      }
    });
    extendElements(task, [1, 2, 3], err => {
      expect(err).to.be.an.instanceOf(GoogleError);
      expect(err!.code).to.equal(status.CANCELLED);
      callback();
    });
    const cancelId = task._data[task._data.length - 1].callback.id;
    extendElements(task, [4, 5, 6], (err, resp) => {
      expect(resp.field1).to.deep.equal([4, 5, 6]);
      callback();
    });
    task.run();
    task.cancel(cancelId!);
  });
});

describe('Executor', () => {
  function apiCall(request, callback) {
    callback(null, request);
    return {cancel: () => {}};
  }
  function failing(request, callback) {
    callback(new Error('failure'));
    return {cancel: () => {}};
  }

  function newExecutor(options) {
    const descriptor = new BundleDescriptor(
      'field1',
      ['field2'],
      'field1',
      byteLength
    );
    return new BundleExecutor(options, descriptor);
  }

  it('groups api calls by the id', () => {
    const executor = newExecutor({delayThreshold: 10});
    executor.schedule(apiCall, {field1: [1, 2], field2: 'id1'});
    executor.schedule(apiCall, {field1: [3], field2: 'id2'});
    executor.schedule(apiCall, {field1: [4, 5], field2: 'id1'});
    executor.schedule(apiCall, {field1: [6], field2: 'id2'});

    expect(executor._tasks).to.have.property('["id1"]');
    expect(executor._tasks).to.have.property('["id2"]');
    expect(Object.keys(executor._tasks).length).to.eq(2);

    let task = executor._tasks['["id1"]'];
    expect(task._data.length).to.eq(2);
    expect(task._data[0].elements).to.eql([1, 2]);
    expect(task._data[1].elements).to.eql([4, 5]);

    task = executor._tasks['["id2"]'];
    expect(task._data.length).to.eq(2);
    expect(task._data[0].elements).to.eql([3]);
    expect(task._data[1].elements).to.eql([6]);

    // tslint:disable-next-line forin
    for (const bundleId in executor._timers) {
      clearTimeout(executor._timers[bundleId]);
    }
  });

  it('emits errors when the api call fails', done => {
    const executor = newExecutor({delayThreshold: 10});
    const callback = sinon.spy(err => {
      expect(err).to.be.an.instanceOf(Error);
      if (callback.callCount === 2) {
        done();
      }
    });
    executor.schedule(failing, {field1: [1], field2: 'id'}, callback);
    executor.schedule(failing, {field1: [2], field2: 'id'}, callback);
  });

  it('runs unbundleable tasks immediately', done => {
    const executor = newExecutor({delayThreshold: 10});
    const spy = sinon.spy(apiCall);
    let counter = 0;
    let unbundledCallCounter = 0;
    function onEnd() {
      expect(spy.callCount).to.eq(3);
      done();
    }
    executor.schedule(spy, {field1: [1, 2], field2: 'id1'}, (err, resp) => {
      // @ts-ignore unknown field
      expect(resp.field1).to.deep.eq([1, 2]);
      expect(unbundledCallCounter).to.eq(2);
      counter++;
      if (counter === 4) {
        onEnd();
      }
    });
    executor.schedule(spy, {field1: [3]}, (err, resp) => {
      // @ts-ignore unknown field
      expect(resp.field1).to.deep.eq([3]);
      unbundledCallCounter++;
      counter++;
    });
    executor.schedule(spy, {field1: [4], field2: 'id1'}, (err, resp) => {
      // @ts-ignore unknown field
      expect(resp.field1).to.deep.eq([4]);
      expect(unbundledCallCounter).to.eq(2);
      counter++;
      if (counter === 4) {
        onEnd();
      }
    });
    executor.schedule(spy, {field1: [5, 6]}, (err, resp) => {
      // @ts-ignore unknown field
      expect(resp.field1).to.deep.eq([5, 6]);
      unbundledCallCounter++;
      counter++;
    });
  });

  describe('callback', () => {
    const executor = newExecutor({delayThreshold: 10});
    let spyApi = sinon.spy(apiCall);

    function timedAPI(request, callback) {
      let canceled = false;
      // This invokes callback asynchronously by using setTimeout with 0msec, so
      // the callback invocation can be canceled in the same event loop of this
      // API is called.
      setTimeout(() => {
        if (!canceled) {
          callback(null, request);
        }
      }, 0);
      return () => {
        canceled = true;
        callback(new Error('canceled'));
      };
    }

    beforeEach(() => {
      spyApi = sinon.spy(apiCall);
    });

    it("shouldn't block next event after cancellation", done => {
      const canceller = executor.schedule(
        spyApi,
        {field1: [1, 2], field2: 'id'},
        err => {
          expect(err).to.be.an.instanceOf(GoogleError);
          expect(err!.code).to.equal(status.CANCELLED);
          expect(spyApi.callCount).to.eq(0);

          executor.schedule(
            spyApi,
            {field1: [3, 4], field2: 'id'},
            (err, resp) => {
              // @ts-ignore unknown field
              expect(resp.field1).to.deep.equal([3, 4]);
              expect(spyApi.callCount).to.eq(1);
              done();
            }
          );
        }
      );
      expect(spyApi.callCount).to.eq(0);
      canceller.cancel();
    });

    it('distinguishes a running task and a scheduled one', done => {
      let counter = 0;
      // @ts-ignore cancellation logic is broken here
      executor.schedule(timedAPI, {field1: [1, 2], field2: 'id'}, err => {
        // tslint:disable-next-line no-unused-expression
        expect(err).to.be.null;
        counter++;
        // counter should be 2 because event2 callback should be called
        // earlier (it should be called immediately on cancel).
        expect(counter).to.eq(2);
        done();
      });
      executor._runNow('id');

      const canceller =
        // @ts-ignore cancellation logic is broken here
        executor.schedule(timedAPI, {field1: [1, 2], field2: 'id'}, err => {
          expect(err).to.be.an.instanceOf(GoogleError);
          expect(err!.code).to.equal(status.CANCELLED);
          counter++;
        });
      canceller.cancel();
    });
  });

  it('respects element count', () => {
    const threshold = 5;
    const executor = newExecutor({elementCountThreshold: threshold});
    const spy = sinon.spy((request, callback) => {
      expect(request.field1.length).to.eq(threshold);
      callback(null, request);
      return {cancel: () => {}};
    });
    for (let i = 0; i < threshold - 1; ++i) {
      executor.schedule(spy, {field1: [1], field2: 'id1'});
      executor.schedule(spy, {field1: [2], field2: 'id2'});
    }
    expect(spy.callCount).to.eq(0);

    executor.schedule(spy, {field1: [1], field2: 'id1'});
    expect(spy.callCount).to.eq(1);

    executor.schedule(spy, {field1: [2], field2: 'id2'});
    expect(spy.callCount).to.eq(2);

    expect(Object.keys(executor._tasks).length).to.eq(0);
  });

  it('respects bytes count', () => {
    const unitSize = byteLength(1);
    const count = 5;
    const threshold = unitSize * count;

    const executor = newExecutor({requestByteThreshold: threshold});
    const spy = sinon.spy((request, callback) => {
      expect(request.field1.length).to.eq(count);
      expect(byteLength(request.field1)).to.be.least(threshold);
      callback(null, request);
      return {cancel: () => {}};
    });
    for (let i = 0; i < count - 1; ++i) {
      executor.schedule(spy, {field1: [1], field2: 'id1'});
      executor.schedule(spy, {field1: [2], field2: 'id2'});
    }
    expect(spy.callCount).to.eq(0);

    executor.schedule(spy, {field1: [1], field2: 'id1'});
    expect(spy.callCount).to.eq(1);

    executor.schedule(spy, {field1: [2], field2: 'id2'});
    expect(spy.callCount).to.eq(2);

    expect(Object.keys(executor._tasks).length).to.eq(0);
  });

  it('respects element limit', done => {
    const threshold = 5;
    const limit = 7;
    const executor = newExecutor({
      elementCountThreshold: threshold,
      elementCountLimit: limit,
    });
    const spy = sinon.spy((request, callback) => {
      expect(request.field1).to.be.an.instanceOf(Array);
      callback(null, request);
      return {cancel: () => {}};
    });
    executor.schedule(spy, {field1: [1, 2], field2: 'id'});
    executor.schedule(spy, {field1: [3, 4], field2: 'id'});
    expect(spy.callCount).to.eq(0);
    expect(Object.keys(executor._tasks).length).to.eq(1);

    executor.schedule(spy, {field1: [5, 6, 7], field2: 'id'});
    expect(spy.callCount).to.eq(1);
    expect(Object.keys(executor._tasks).length).to.eq(1);

    executor.schedule(spy, {field1: [8, 9, 10, 11, 12], field2: 'id'});
    expect(spy.callCount).to.eq(3);
    expect(Object.keys(executor._tasks).length).to.eq(0);

    executor.schedule(
      spy,
      {field1: [1, 2, 3, 4, 5, 6, 7, 8], field2: 'id'},
      err => {
        expect(err).to.be.an.instanceOf(GoogleError);
        expect(err!.code).to.equal(status.INVALID_ARGUMENT);
        done();
      }
    );
  });

  it('respects bytes limit', done => {
    const unitSize = byteLength(1);
    const threshold = 5;
    const limit = 7;
    const executor = newExecutor({
      requestByteThreshold: threshold * unitSize,
      requestByteLimit: limit * unitSize,
    });
    const spy = sinon.spy((request, callback) => {
      expect(request.field1).to.be.an.instanceOf(Array);
      callback(null, request);
      return {cancel: () => {}};
    });
    executor.schedule(spy, {field1: [1, 2], field2: 'id'});
    executor.schedule(spy, {field1: [3, 4], field2: 'id'});
    expect(spy.callCount).to.eq(0);
    expect(Object.keys(executor._tasks).length).to.eq(1);

    executor.schedule(spy, {field1: [5, 6, 7], field2: 'id'});
    expect(spy.callCount).to.eq(1);
    expect(Object.keys(executor._tasks).length).to.eq(1);

    executor.schedule(spy, {field1: [8, 9, 0, 1, 2], field2: 'id'});
    expect(spy.callCount).to.eq(3);
    expect(Object.keys(executor._tasks).length).to.eq(0);

    executor.schedule(
      spy,
      {field1: [1, 2, 3, 4, 5, 6, 7], field2: 'id'},
      err => {
        expect(err).to.be.an.instanceOf(GoogleError);
        expect(err!.code).to.equal(status.INVALID_ARGUMENT);
        done();
      }
    );
  });

  it('does not invoke runNow twice', done => {
    const threshold = 2;
    const executor = newExecutor({
      elementCountThreshold: threshold,
      delayThreshold: 10,
    });
    executor._runNow = sinon.spy(executor._runNow.bind(executor));
    const spy = sinon.spy((request, callback) => {
      expect(request.field1.length).to.eq(threshold);
      callback(null, request);
      return {cancel: () => {}};
    });
    executor.schedule(spy, {field1: [1, 2], field2: 'id1'});
    setTimeout(() => {
      expect(spy.callCount).to.eq(1);
      // tslint:disable-next-line no-any
      expect((executor._runNow as any).callCount).to.eq(1);
      done();
    }, 20);
  });

  describe('timer', () => {
    it('waits on the timer', done => {
      const executor = newExecutor({delayThreshold: 50});
      const spy = sinon.spy(apiCall);
      const start = new Date().getTime();
      function onEnd() {
        expect(spy.callCount).to.eq(1);
        const now = new Date().getTime();
        expect(now - start).to.be.least(49);
        done();
      }
      const tasks = 5;
      const callback = sinon.spy(() => {
        if (callback.callCount === tasks) {
          onEnd();
        }
      });
      for (let i = 0; i < tasks; i++) {
        executor.schedule(spy, {field1: [i], field2: 'id'}, callback);
      }
    });

    it('reschedules after timer', done => {
      const executor = newExecutor({delayThreshold: 50});
      const spy = sinon.spy(apiCall);
      const start = new Date().getTime();
      executor.schedule(spy, {field1: [0], field2: 'id'}, () => {
        expect(spy.callCount).to.eq(1);
        const firstEnded = new Date().getTime();
        expect(firstEnded - start).to.be.least(49);

        executor.schedule(spy, {field1: [1], field2: 'id'}, () => {
          expect(spy.callCount).to.eq(2);
          const secondEnded = new Date().getTime();
          expect(secondEnded - firstEnded).to.be.least(49);
          done();
        });
      });
    });
  });
});

describe('bundleable', () => {
  function func(argument, metadata, options, callback) {
    callback(null, argument);
  }
  const bundleOptions = {elementCountThreshold: 12, delayThreshold: 10};
  const descriptor = new BundleDescriptor(
    'field1',
    ['field2'],
    'field1',
    byteLength
  );
  const settings = {
    settings: {bundleOptions},
    descriptor,
  };

  it('bundles requests', done => {
    const spy = sinon.spy(func);
    const callback = sinon.spy(obj => {
      expect(obj).to.be.an('array');
      expect(obj[0].field1).to.deep.equal([1, 2, 3]);
      if (callback.callCount === 2) {
        expect(spy.callCount).to.eq(1);
        done();
      }
    });
    const apiCall = createApiCall(spy, settings);
    apiCall({field1: [1, 2, 3], field2: 'id'}, undefined, (err, obj) => {
      if (err) {
        done(err);
      } else {
        callback([obj]);
      }
    });
    apiCall({field1: [1, 2, 3], field2: 'id'}, undefined)
      .then(callback)
      .catch(done);
  });

  it('does not fail if bundle field is not set', done => {
    const spy = sinon.spy(func);
    const warnStub = sinon.stub(process, 'emitWarning');
    const callback = sinon.spy(obj => {
      expect(obj).to.be.an('array');
      expect(obj[0].field1).to.be.an('undefined');
      if (callback.callCount === 2) {
        expect(spy.callCount).to.eq(2);
        expect(warnStub.callCount).to.eq(1);
        warnStub.restore();
        done();
      }
    });
    const apiCall = createApiCall(spy, settings);

    function error(err: Error) {
      warnStub.restore();
      done(err);
    }
    apiCall({field2: 'id1'}, undefined).then(callback, error);
    apiCall({field2: 'id2'}, undefined).then(callback, error);
  });

  it('suppresses bundling behavior by call options', done => {
    const spy = sinon.spy(func);
    let callbackCount = 0;
    function bundledCallback(obj) {
      expect(obj).to.be.an('array');
      callbackCount++;
      expect(obj[0].field1).to.deep.equal([1, 2, 3]);
      if (callbackCount === 3) {
        expect(spy.callCount).to.eq(2);
        done();
      }
    }
    function unbundledCallback(obj) {
      expect(obj).to.be.an('array');
      callbackCount++;
      expect(callbackCount).to.eq(1);
      expect(obj[0].field1).to.deep.equal([1, 2, 3]);
    }
    const apiCall = createApiCall(spy, settings);
    apiCall({field1: [1, 2, 3], field2: 'id'}, undefined)
      .then(bundledCallback)
      .catch(done);
    apiCall({field1: [1, 2, 3], field2: 'id'}, {isBundling: false})
      .then(unbundledCallback)
      .catch(done);
    apiCall({field1: [1, 2, 3], field2: 'id'}, undefined)
      .then(bundledCallback)
      .catch(done);
  });

  it('cancels partially on bundling method', done => {
    const apiCall = createApiCall(func, settings);
    let expectedSuccess = false;
    let expectedFailure = false;
    apiCall({field1: [1, 2, 3], field2: 'id'}, undefined)
      .then(obj => {
        expect(obj).to.be.an('array');
        // @ts-ignore response type
        expect(obj[0].field1).to.deep.equal([1, 2, 3]);
        expectedSuccess = true;
        if (expectedSuccess && expectedFailure) {
          done();
        }
      })
      .catch(done);
    const p = apiCall({field1: [1, 2, 3], field2: 'id'}, undefined);
    p.then(() => {
      done(new Error('should not succeed'));
    }).catch(err => {
      expect(err).to.be.instanceOf(GoogleError);
      expect(err!.code).to.equal(status.CANCELLED);

      expectedFailure = true;
      if (expectedSuccess && expectedFailure) {
        done();
      }
    });
    p.cancel();
  });
});
