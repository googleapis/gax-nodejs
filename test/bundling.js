/* Copyright 2016, Google Inc.
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

'use strict';

var bundling = require('../lib/bundling');
var gax = require('../lib/gax');
var BundleEventEmitter = require('../lib/event_emitter').BundleEventEmitter;
var eventemitter2 = require('eventemitter2');
var expect = require('chai').expect;
var sinon = require('sinon');
var _ = require('lodash');

function createSimple(value, otherValue) {
  if (otherValue === undefined) {
    otherValue = null;
  }
  return {field1: value, field2: otherValue};
}

function createOuter(value, otherValue) {
  if (otherValue === undefined) {
    otherValue = value;
  }
  return {inner: createSimple(value, otherValue), field1: value};
}

function byteLength(obj) {
  return JSON.stringify(obj).length;
}

describe('computeBundleId', function() {
  describe('computes the bundle identifier', function() {
    var testCases = [
      {
        message: 'single field value',
        object: createSimple('dummy_value'),
        fields: ['field1'],
        want: 'dummy_value'
      }, {
        message: 'composite value with null',
        object: createSimple('dummy_value'),
        fields: ['field1', 'field2'],
        want: 'dummy_value,'
      }, {
        message: 'a composite value',
        object: createSimple('dummy_value', 'other_value'),
        fields: ['field1', 'field2'],
        want: 'dummy_value,other_value'
      }, {
        message: 'empty discriminator fields',
        object: createSimple('dummy_value'),
        fields: [],
        want: ''
      }, {
        message: 'null',
        object: createSimple(null),
        fields: ['field1'],
        want: ''
      }, {
        message: 'numeric',
        object: createSimple(42),
        fields: ['field1'],
        want: '42'
      }, {
        message: 'a simple dotted value',
        object: createOuter('this is dotty'),
        fields: ['inner.field1'],
        want: 'this is dotty'
      }, {
        message: 'a complex case',
        object: createOuter('what!?'),
        fields: ['inner.field1', 'inner.field2', 'field1'],
        want: 'what!?,what!?,what!?'
      }
    ];
    testCases.forEach(function(t) {
      it(t.message, function() {
        expect(bundling.computeBundleId(t.object, t.fields)).to.equal(t.want);
      });
    });
  });

  describe('returns undefined if failed', function() {
    var testCases = [
      {
        message: 'nonexisting fields',
        object: createSimple('dummy_value'),
        fields: ['field3']
      }, {
        message: 'partially nonexisting fields',
        object: createSimple('dummy_value'),
        fields: ['field1', 'field3']
      }, {
        message: 'partially nonexisting fields with field2',
        object: createSimple('dummy_value', 'other_value'),
        fields: ['field1', 'field3']
      }, {
        message: 'fails to look up in the middle',
        object: createOuter('this is dotty'),
        fields: ['inner.field3']
      }
    ];
    testCases.forEach(function(t) {
      it(t.message, function() {
        expect(bundling.computeBundleId(t.object, t.fields)).to.be.undefined;
      });
    });
  });
});

describe('deepCopyForResponse', function() {
  it('copies deeply', function() {
    var input = {foo: {bar: [1, 2]}};
    var output = bundling.deepCopyForResponse(input, null);
    expect(output).to.deep.equal(input);
    expect(output.foo).to.not.equal(input.foo);
    expect(output.foo.bar).to.not.equal(input.foo.bar);
  });

  it('respects subresponseInfo', function() {
    var input = {foo: [1, 2, 3, 4], bar: {foo: [1, 2, 3, 4]}};
    var output = bundling.deepCopyForResponse(
        input, {field: 'foo', start: 0, end: 2});
    expect(output).to.deep.equal({foo: [1, 2], bar: {foo: [1, 2, 3, 4]}});
    expect(output.bar).to.not.equal(input.bar);

    var output2 = bundling.deepCopyForResponse(
        input, {field: 'foo', start: 2, end: 4});
    expect(output2).to.deep.equal({foo: [3, 4], bar: {foo: [1, 2, 3, 4]}});
    expect(output2.bar).to.not.equal(input.bar);
  });

  it('deep copies special values', function() {
    function Copyable(id) {
      this.id = id;
    }
    Copyable.prototype.copy = function() {
      return new Copyable(this.id);
    };
    var input = {
      copyable: new Copyable(0),
      arraybuffer: new ArrayBuffer(10),
      nullvalue: null,
      array: [1, 2, 3],
      number: 1,
      boolean: false,
      obj: {
        foo: 1
      }
    };
    var output = bundling.deepCopyForResponse(input, null);
    expect(output).to.deep.equal(input);
    expect(output.copyable).to.not.equal(input.copyable);
    expect(output.arraybuffer).to.not.equal(input.arraybuffer);
    expect(output.array).to.not.equal(input.array);
  });

  it('ignores erroneous subresponseInfo', function() {
    var input = {foo: 1, bar: {foo: [1, 2, 3, 4]}};
    var output = bundling.deepCopyForResponse(
        input, {field: 'foo', start: 0, end: 2});
    expect(output).to.deep.equal(input);
  });
});

describe('Task', function() {
  function testTask(apiCall) {
    return new bundling.Task(apiCall, {}, 'field1', null, byteLength);
  }

  var id = 0;
  function extendElements(task, elements, callback) {
    var dummyEmitter = null;
    if (callback) {
      dummyEmitter = {
        _eventId: id++,
        _callback: callback
      };
    }
    var bytes = 0;
    elements.forEach(function(element) { bytes += byteLength(element); });
    task.extend(elements, bytes, dummyEmitter);
  }

  describe('extend', function() {
    var data = 'a simple msg';
    var testCases = [
      {
        data: [],
        message: 'no messages added',
        want: 0
      }, {
        data: [data],
        message: 'a single message added',
        want: 1
      }, {
        data: [data, data, data, data, data],
        message: '5 messages added',
        want: 5
      }
    ];
    describe('increases the element count', function() {
      testCases.forEach(function(t) {
        it(t.message, function() {
          var task = testTask();
          var baseCount = task.getElementCount();
          extendElements(task, t.data);
          expect(task.getElementCount()).to.eq(baseCount + t.want, t.message);
        });
      });
    });

    describe('increases the byte size', function() {
      var sizePerData = JSON.stringify(data).length;
      testCases.forEach(function(t) {
        it(t.message, function() {
          var task = testTask();
          var baseSize = task.getRequestByteSize();
          extendElements(task, t.data);
          expect(task.getRequestByteSize()).to.eq(
              baseSize + t.want * sizePerData);
        });
      });
    });
  });

  describe('run', function() {
    var data = 'test message';
    var testCases = [
      {
        data: [],
        message: 'no messages added',
        expected: null
      }, {
        data: [[data]],
        message: 'a single message added',
        expected: [data]
      }, {
        data: [[data, data], [data, data, data]],
        message: 'a single message added',
        expected: [data, data, data, data, data]
      }, {
        data: [[data, data, data, data, data]],
        message: '5 messages added',
        expected: [data, data, data, data, data]
      }
    ];
    function createApiCall(expected) {
      return function apiCall(req, callback) {
        expect(req.field1).to.deep.equal(expected);
        return callback(null, req);
      };
    }

    describe('sends bundled elements', function() {
      testCases.forEach(function(t) {
        it(t.message, function(done) {
          var apiCall = sinon.spy(createApiCall(t.expected));
          var task = testTask(apiCall);
          var callback = sinon.spy(function(err, data) {
            expect(err).to.be.null;
            expect(data).to.be.an.instanceOf(Object);
            if (callback.callCount === t.data.length) {
              expect(apiCall.callCount).to.eq(1);
              done();
            }
          });
          t.data.forEach(function(d) {
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

    describe('calls back with the subresponse fields', function() {
      testCases.forEach(function(t) {
        it(t.message, function(done) {
          var apiCall = sinon.spy(createApiCall(t.expected));
          var task = testTask(apiCall);
          task._subresponseField = 'field1';
          var callbackCount = 0;
          t.data.forEach(function(d) {
            extendElements(task, d, function(err, data) {
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

    describe('calls back with fail if API fails', function() {
      testCases.slice(1).forEach(function(t) {
        it(t.message, function(done) {
          var err = new Error('failure');
          var apiCall = sinon.spy(function(resp, callback) {
            callback(err);
          });
          var task = testTask(apiCall);
          task._subresponseField = 'field1';
          var callback = sinon.spy(function(e, data) {
            expect(e).to.equal(err);
            expect(data).to.be.null;
            if (callback.callCount === t.data.length) {
              expect(apiCall.callCount).to.eq(1);
              done();
            }
          });
          t.data.forEach(function(d) {
            extendElements(task, d, callback);
          });
          task.run();
        });
      });
    });
  });

  it('cancels existing data', function(done) {
    var apiCall = sinon.spy(function(resp, callback) { callback(null, resp); });
    var task = testTask(apiCall);
    task._subresponseField = 'field1';
    var callback = sinon.spy(function() {
      if (callback.callCount === 2) {
        done();
      }
    });
    extendElements(task, [1, 2, 3], function(err, resp) {
      expect(resp.field1).to.deep.equal([1, 2, 3]);
      callback();
    });
    extendElements(task, [4, 5, 6], function(err, resp) {
      done(new Error('should not reach'));
    });
    var cancelId = task._data[task._data.length - 1].emitter._eventId;

    extendElements(task, [7, 8, 9], function(err, resp) {
      expect(resp.field1).to.deep.equal([7, 8, 9]);
      callback();
    });

    task.cancel(cancelId);
    task.run();
  });
});

describe('Executor', function() {
  function apiCall(request, callback) {
    callback(null, request);
  }
  function failing(request, callback) {
    callback(new Error('failure'));
  }

  function newExecutor(options) {
    return new bundling.BundleExecutor(options, new gax.BundleDescriptor(
      'field1', ['field2'], 'field1', byteLength));
  }

  function schedule(executor, func, request, callback) {
    var emitter = new BundleEventEmitter(executor, callback);
    executor.schedule(func, request, emitter);
    return emitter;
  }

  it('groups api calls by the id', function() {
    var executor = newExecutor(new gax.BundleOptions({delayThreshold: 10}));
    schedule(executor, apiCall, createSimple([1, 2], 'id1'));
    schedule(executor, apiCall, createSimple([3], 'id2'));
    schedule(executor, apiCall, createSimple([4, 5], 'id1'));
    schedule(executor, apiCall, createSimple([6], 'id2'));

    expect(executor._tasks).to.have.property('id1');
    expect(executor._tasks).to.have.property('id2');
    expect(_.size(executor._tasks)).to.eq(2);

    var task = executor._tasks.id1;
    expect(task._data.length).to.eq(2);
    expect(task._data[0].elements).to.eql([1, 2]);
    expect(task._data[1].elements).to.eql([4, 5]);

    task = executor._tasks.id2;
    expect(task._data.length).to.eq(2);
    expect(task._data[0].elements).to.eql([3]);
    expect(task._data[1].elements).to.eql([6]);

    for (var bundleId in executor._timers) {
      clearTimeout(executor._timers[bundleId]);
    }
  });

  it('emits errors when the api call fails', function(done) {
    var executor = newExecutor(new gax.BundleOptions({delayThreshold: 10}));
    var callback = sinon.spy(function(err, resp) {
      expect(err).to.be.an.instanceOf(Error);
      if (callback.callCount === 2) {
        done();
      }
    });
    var emitter = schedule(
        executor, failing, createSimple([1], 'id'), callback);
    schedule(executor, failing, createSimple([2], 'id'), callback);

    emitter.runNow();
  });

  describe('with events', function() {
    var executor = newExecutor(new gax.BundleOptions({delayThreshold: 10}));
    var spyApi;

    function timedAPI(request, callback) {
      var canceled = false;
      // This invokes callback asynchronously by using setTimeout with 0msec, so
      // the callback invocation can be canceled in the same event loop of this
      // API is called.
      setTimeout(function() {
        if (!canceled) {
          callback(null, request);
        }
      }, 0);
      var emitter = new eventemitter2.EventEmitter2();
      emitter.cancel = function() {
        canceled = true;
      };
      return emitter;
    }

    beforeEach(function() {
      spyApi = sinon.spy(apiCall);
    });

    describe('with listeners', function() {
      it('ignore runNow once it\'s finished', function(done) {
        var callCount = 0;
        var event1 = schedule(executor, spyApi, createSimple([1, 2], 'id'));
        event1.on('data', function(resp) {
          callCount++;
          // make sure this callback is called only once.
          expect(callCount).to.eq(1);
          expect(resp.field1).to.deep.equal([1, 2]);
          expect(spyApi.callCount).to.eq(1);

          // event1.runNow() does nothing, even though event2 is scheduled
          // with the same bundle id.
          event1.runNow();
          expect(spyApi.callCount).to.eq(1);

          setTimeout(done, 0);
        });
        event1.runNow();
      });

      it('shouldn\'t block next event after cancellation', function(done) {
        var event1 = schedule(executor, spyApi, createSimple([1, 2], 'id'));
        event1
            .on('data', function() { done(new Error('should not reach')); })
            .on('error', function() { done(new Error('should not reach')); });
        event1.cancel();

        setTimeout(function() {
          expect(spyApi.callCount).to.eq(0);

          var event2 = schedule(executor, spyApi, createSimple([3, 4], 'id'));
          event2.on('data', function(resp) {
            expect(resp.field1).to.deep.equal([3, 4]);
            expect(spyApi.callCount).to.eq(1);
            done();
          });
          event2.on('error', done);
          event2.runNow();
        }, 0);
      });

      it('distinguishes a running task and a scheduled task.', function(done) {
        var event1 = schedule(executor, timedAPI, createSimple([1, 2], 'id'));
        event1.on('data', function() {
          expect(_.size(executor._tasks)).to.eq(
              0, 'The task for event2 should not remain in the executor.');
          // Even if the task for event2 does not remain in the executor, this
          // needs to verify that its API isn't invoked and its callback isn't
          // scheduled. Thus use setTimeout(done, 0); instead of done(),
          // so some errors can be reported if callback is called meanwhile.
          setTimeout(done, 0);
        });
        event1.on('error', function() { done(new Error('should not reach')); });
        event1.runNow();

        var event2 = schedule(executor, timedAPI, createSimple([1, 2], 'id'));
        event2.on('data', function() { done(new Error('should not reach')); });
        event2.on('error', function() { done(new Error('should not reach')); });
        event2.cancel();
      });
    });

    describe('with callbacks', function() {
      it('ignore runNow once it\'s finished', function(done) {
        var callCount = 0;
        var event1 = schedule(
            executor, spyApi, createSimple([1, 2], 'id'), function(err, resp) {
              callCount++;
              // make sure this callback is called only once.
              expect(callCount).to.eq(1);
              expect(resp.field1).to.deep.equal([1, 2]);

              // event1.runNow() does nothing, even though event2 is scheduled
              // with the same bundle id.
              event1.runNow();
              expect(spyApi.callCount).to.eq(1);

              setTimeout(done, 0);
            });
        event1.runNow();
      });

      it('shouldn\'t block next event after cancellation', function(done) {
        var event1 = schedule(
            executor, spyApi, createSimple([1, 2], 'id'), function(err, resp) {
              expect(err).to.be.an.instanceOf(Error);

              expect(spyApi.callCount).to.eq(0);

              var event2 = schedule(
                  executor, spyApi, createSimple([3, 4], 'id'),
                  function(err, resp) {
                    expect(resp.field1).to.deep.equal([3, 4]);
                    expect(spyApi.callCount).to.eq(1);
                    done();
                  });
              event2.runNow();
            });
        expect(spyApi.callCount).to.eq(0);
        event1.cancel();
      });

      it('distinguishes a running task and a scheduled task.', function(done) {
        var counter = 0;
        var event1 = schedule(
            executor, timedAPI, createSimple([1, 2], 'id'),
            function(err, resp) {
              expect(err).to.be.null;
              counter++;
              // counter should be 2 because event2 callback should be called
              // earlier (it should be called immediately on cancel).
              expect(counter).to.eq(2);
              done();
            });
        event1.runNow();

        var event2 = schedule(
            executor, timedAPI, createSimple([1, 2], 'id'),
            function(err, resp) {
              expect(err).to.be.an.instanceOf(Error);
              counter++;
            });
        event2.cancel();
      });
    });

    describe('with promises', function() {
      it('ignore runNow once it\'s finished', function(done) {
        var event = schedule(executor, spyApi, createSimple([1, 2], 'id'));
        expect(spyApi.callCount).to.eq(0);

        event.runNow();
        event.result.then(function(result) {
          expect(result.field1).to.deep.equal([1, 2]);
          expect(spyApi.callCount).to.eq(1);
          // Invoking event1 does nothing, because it's already over.
          event.runNow();
          expect(spyApi.callCount).to.eq(1);
          done();
        });
      });

      it('shouldn\'t block next event after cancellation', function(done) {
        var event1 = schedule(executor, spyApi, createSimple([1, 2], 'id'));
        expect(spyApi.callCount).to.eq(0);

        event1.cancel();
        event1.result.then(function() {
          done(new Error('should not reach'));
        }, function(err) {
          expect(err).to.be.an.instanceOf(Error);

          expect(spyApi.callCount).to.eq(0);
          var event2 = schedule(executor, spyApi, createSimple([3, 4], 'id'));

          event2.runNow();
          return event2.result;
        }).then(function(result) {
          expect(spyApi.callCount).to.eq(1);
          done();
        }, function(err) { done(err); });
      });

      it('distinguishes a running task and a scheduled task.', function(done) {
        var counter = 0;
        var event1 = schedule(executor, timedAPI, createSimple([1, 2], 'id'));
        event1.result.then(function(resp) {
          counter++;
          // counter should be 2 because event2 failure should be called
          // earlier (it should be called immediately on cancel).
          expect(counter).to.eq(2);
          done();
        }, function(err) { done(err); });
        event1.runNow();

        var event2 = schedule(executor, timedAPI, createSimple([1, 2], 'id'));
        event2.result.then(function(resp) {
          done(new Error('should not reach'));
        }, function(err) {
          expect(err).to.be.an.instanceOf(Error);
          counter++;
        }).catch(done);
        event2.cancel();
      });
    });
  });

  it('respects element count', function() {
    var threshold = 5;
    var executor = newExecutor(
        new gax.BundleOptions({elementCountThreshold: threshold}));
    var spy = sinon.spy(function(request, callback) {
      expect(request.field1.length).to.eq(threshold);
      callback(null, request);
    });
    for (var i = 0; i < threshold - 1; ++i) {
      schedule(executor, spy, createSimple([1], 'id1'));
      schedule(executor, spy, createSimple([2], 'id2'));
    }
    expect(spy.callCount).to.eq(0);

    schedule(executor, spy, createSimple([1], 'id1'));
    expect(spy.callCount).to.eq(1);

    schedule(executor, spy, createSimple([2], 'id2'));
    expect(spy.callCount).to.eq(2);

    expect(_.size(executor._tasks)).to.eq(0);
  });

  it('respects bytes count', function() {
    var unitSize = byteLength(1);
    var count = 5;
    var threshold = unitSize * count;

    var executor = newExecutor(
        new gax.BundleOptions({requestByteThreshold: threshold}));
    var spy = sinon.spy(function(request, callback) {
      expect(request.field1.length).to.eq(count);
      expect(byteLength(request.field1)).to.be.least(threshold);
      callback(null, request);
    });
    for (var i = 0; i < count - 1; ++i) {
      schedule(executor, spy, createSimple([1], 'id1'));
      schedule(executor, spy, createSimple([2], 'id2'));
    }
    expect(spy.callCount).to.eq(0);

    schedule(executor, spy, createSimple([1], 'id1'));
    expect(spy.callCount).to.eq(1);

    schedule(executor, spy, createSimple([2], 'id2'));
    expect(spy.callCount).to.eq(2);

    expect(_.size(executor._tasks)).to.eq(0);
  });

  it('respects element limit', function(done) {
    var threshold = 5;
    var limit = 7;
    var executor = newExecutor(new gax.BundleOptions(
        {elementCountThreshold: threshold, elementCountLimit: limit}));
    var spy = sinon.spy(function(request, callback) {
      expect(request.field1).to.be.an.instanceOf(Array);
      callback(null, request);
    });
    schedule(executor, spy, createSimple([1, 2], 'id'));
    schedule(executor, spy, createSimple([3, 4], 'id'));
    expect(spy.callCount).to.eq(0);
    expect(_.size(executor._tasks)).to.eq(1);

    schedule(executor, spy, createSimple([5, 6, 7], 'id'));
    expect(spy.callCount).to.eq(1);
    expect(_.size(executor._tasks)).to.eq(1);

    schedule(executor, spy, createSimple([8, 9, 10, 11, 12], 'id'));
    expect(spy.callCount).to.eq(3);
    expect(_.size(executor._tasks)).to.eq(0);

    var emitter = schedule(
        executor, spy, createSimple([1, 2, 3, 4, 5, 6, 7], 'id'));
    emitter.on('data', function() {
      done(new Error('not reached'));
    }).on('error', function(err) {
      expect(err).to.be.an.instanceOf(Error);
      done();
    });
  });

  it('respects bytes limit', function(done) {
    var unitSize = byteLength(1);
    var threshold = 5;
    var limit = 7;
    var executor = newExecutor(new gax.BundleOptions(
        {requestByteThreshold: threshold * unitSize,
         requestByteLimit: limit * unitSize}));
    var spy = sinon.spy(function(request, callback) {
      expect(request.field1).to.be.an.instanceOf(Array);
      callback(null, request);
    });
    schedule(executor, spy, createSimple([1, 2], 'id'));
    schedule(executor, spy, createSimple([3, 4], 'id'));
    expect(spy.callCount).to.eq(0);
    expect(_.size(executor._tasks)).to.eq(1);

    schedule(executor, spy, createSimple([5, 6, 7], 'id'));
    expect(spy.callCount).to.eq(1);
    expect(_.size(executor._tasks)).to.eq(1);

    schedule(executor, spy, createSimple([8, 9, 0, 1, 2], 'id'));
    expect(spy.callCount).to.eq(3);
    expect(_.size(executor._tasks)).to.eq(0);

    var emitter = schedule(
        executor, spy, createSimple([1, 2, 3, 4, 5, 6, 7], 'id'));
    emitter.on('data', function() {
      done(new Error('not reached'));
    }).on('error', function(err) {
      expect(err).to.be.an.instanceOf(Error);
      done();
    });
  });

  describe('timer', function() {
    it('waits on the timer', function(done) {
      var executor = newExecutor(new gax.BundleOptions({delayThreshold: 50}));
      var spy = sinon.spy(apiCall);
      var start = (new Date()).getTime();
      function onEnd() {
        expect(spy.callCount).to.eq(1);
        var now = (new Date()).getTime();
        expect(now - start).to.be.least(50);
        done();
      }
      var tasks = 5;
      var callback = sinon.spy(function(err, resp) {
        if (callback.callCount === tasks) {
          onEnd();
        }
      });
      for (var i = 0; i < tasks; i++) {
        schedule(executor, spy, createSimple([i], 'id'), callback);
      }
    });

    it('reschedules after timer', function(done) {
      var executor = newExecutor(new gax.BundleOptions({delayThreshold: 50}));
      var spy = sinon.spy(apiCall);
      var start = (new Date()).getTime();
      schedule(executor, spy, createSimple([0], 'id'), function() {
        expect(spy.callCount).to.eq(1);
        var firstEnded = (new Date()).getTime();
        expect(firstEnded - start).to.be.least(50);

        schedule(executor, spy, createSimple([1], 'id'), function() {
          expect(spy.callCount).to.eq(2);
          var secondEnded = (new Date()).getTime();
          expect(secondEnded - firstEnded).to.be.least(50);
          done();
        });
      });
    });
  });
});
