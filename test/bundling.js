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
var expect = require('chai').expect;
var sinon = require('sinon');
var createApiCall = require('./utils').createApiCall;
var _ = require('lodash');

function createOuter(value, otherValue) {
  if (otherValue === undefined) {
    otherValue = value;
  }
  return {inner: {field1: value, field2: otherValue}, field1: value};
}

function byteLength(obj) {
  return JSON.stringify(obj).length;
}

describe('computeBundleId', function() {
  describe('computes the bundle identifier', function() {
    var testCases = [
      {
        message: 'single field value',
        object: {field1: 'dummy_value'},
        fields: ['field1'],
        want: '["dummy_value"]'
      }, {
        message: 'composite value with missing field2',
        object: {field1: 'dummy_value'},
        fields: ['field1', 'field2'],
        want: '["dummy_value",null]'
      }, {
        message: 'a composite value',
        object: {field1: 'dummy_value', field2: 'other_value'},
        fields: ['field1', 'field2'],
        want: '["dummy_value","other_value"]'
      }, {
        message: 'null',
        object: {field1: null},
        fields: ['field1'],
        want: '[null]'
      }, {
        message: 'partially nonexisting fields',
        object: {field1: 'dummy_value', field2: 'other_value'},
        fields: ['field1', 'field3'],
        want: '["dummy_value",null]'
      }, {
        message: 'numeric',
        object: {field1: 42},
        fields: ['field1'],
        want: '[42]'
      }, {
        message: 'structured data',
        object: {field1: {foo: 'bar', baz: 42}},
        fields: ['field1'],
        want: '[{"foo":"bar","baz":42}]'
      }, {
        message: 'a simple dotted value',
        object: createOuter('this is dotty'),
        fields: ['inner.field1'],
        want: '["this is dotty"]'
      }, {
        message: 'a complex case',
        object: createOuter('what!?'),
        fields: ['inner.field1', 'inner.field2', 'field1'],
        want: '["what!?","what!?","what!?"]'
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
        message: 'empty discriminator fields',
        object: {field1: 'dummy_value'},
        fields: []
      }, {
        message: 'nonexisting fields',
        object: {field1: 'dummy_value'},
        fields: ['field3']
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
    if (!callback) {
      callback = function() {};
    }
    callback.id = id++;
    var bytes = 0;
    elements.forEach(function(element) { bytes += byteLength(element); });
    task.extend(elements, bytes, callback);
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
      expect(err).to.be.an.instanceOf(Error);
    });
    var cancelId = task._data[task._data.length - 1].callback.id;

    extendElements(task, [7, 8, 9], function(err, resp) {
      expect(resp.field1).to.deep.equal([7, 8, 9]);
      callback();
    });

    task.cancel(cancelId);
    task.run();
  });

  it('cancels ongoing API call', function(done) {
    var apiCall = sinon.spy(function(resp, callback) {
      var timeoutId = setTimeout(function() {
        callback(null, resp);
      }, 100);
      return {
        cancel: function() {
          clearTimeout(timeoutId);
          callback(new Error('cancelled'));
        }
      };
    });

    var task = testTask(apiCall);
    var callback = sinon.spy(function() {
      if (callback.callCount === 2) {
        done();
      }
    });
    extendElements(task, [1, 2, 3], function(err, resp) {
      expect(err).to.be.an.instanceOf(Error);
      callback();
    });
    extendElements(task, [1, 2, 3], function(err, resp) {
      expect(err).to.be.an.instanceOf(Error);
      callback();
    });
    task.run();
    var cancelIds = _.map(task._data, function(data) {
      return data.callback.id;
    });
    cancelIds.forEach(function(id) {
      task.cancel(id);
    });
  });

  it('partially cancels ongoing API call', function(done) {
    var apiCall = sinon.spy(function(resp, callback) {
      var timeoutId = setTimeout(function() {
        callback(null, resp);
      }, 100);
      return {
        cancel: function() {
          clearTimeout(timeoutId);
          callback(new Error('cancelled'));
        }
      };
    });

    var task = testTask(apiCall);
    task._subresponseField = 'field1';
    var callback = sinon.spy(function() {
      if (callback.callCount === 2) {
        done();
      }
    });
    extendElements(task, [1, 2, 3], function(err, resp) {
      expect(err).to.be.an.instanceOf(Error);
      callback();
    });
    var cancelId = task._data[task._data.length - 1].callback.id;
    extendElements(task, [4, 5, 6], function(err, resp) {
      expect(resp.field1).to.deep.equal([4, 5, 6]);
      callback();
    });
    task.run();
    task.cancel(cancelId);
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
    var descriptor = new bundling.BundleDescriptor(
        'field1', ['field2'], 'field1', byteLength);
    return new bundling.BundleExecutor(options, descriptor);
  }

  it('groups api calls by the id', function() {
    var executor = newExecutor({delayThreshold: 10});
    executor.schedule(apiCall, {field1: [1, 2], field2: 'id1'});
    executor.schedule(apiCall, {field1: [3], field2: 'id2'});
    executor.schedule(apiCall, {field1: [4, 5], field2: 'id1'});
    executor.schedule(apiCall, {field1: [6], field2: 'id2'});

    expect(executor._tasks).to.have.property('["id1"]');
    expect(executor._tasks).to.have.property('["id2"]');
    expect(_.size(executor._tasks)).to.eq(2);

    var task = executor._tasks['["id1"]'];
    expect(task._data.length).to.eq(2);
    expect(task._data[0].elements).to.eql([1, 2]);
    expect(task._data[1].elements).to.eql([4, 5]);

    task = executor._tasks['["id2"]'];
    expect(task._data.length).to.eq(2);
    expect(task._data[0].elements).to.eql([3]);
    expect(task._data[1].elements).to.eql([6]);

    for (var bundleId in executor._timers) {
      clearTimeout(executor._timers[bundleId]);
    }
  });

  it('emits errors when the api call fails', function(done) {
    var executor = newExecutor({delayThreshold: 10});
    var callback = sinon.spy(function(err, resp) {
      expect(err).to.be.an.instanceOf(Error);
      if (callback.callCount === 2) {
        done();
      }
    });
    executor.schedule(failing, {field1: [1], field2: 'id'}, callback);
    executor.schedule(failing, {field1: [2], field2: 'id'}, callback);
  });

  it('runs unbundleable tasks immediately', function(done) {
    var executor = newExecutor({delayThreshold: 10});
    var spy = sinon.spy(apiCall);
    var counter = 0;
    var unbundledCallCounter = 0;
    function onEnd() {
      expect(spy.callCount).to.eq(3);
      done();
    }
    executor.schedule(
      spy, {field1: [1, 2], field2: 'id1'}, function(err, resp) {
        expect(resp.field1).to.deep.eq([1, 2]);
        expect(unbundledCallCounter).to.eq(2);
        counter++;
        if (counter === 4) {
          onEnd();
        }
      });
    executor.schedule(spy, {field1: [3]}, function(err, resp) {
      expect(resp.field1).to.deep.eq([3]);
      unbundledCallCounter++;
      counter++;
    });
    executor.schedule(spy, {field1: [4], field2: 'id1'}, function(err, resp) {
      expect(resp.field1).to.deep.eq([4]);
      expect(unbundledCallCounter).to.eq(2);
      counter++;
      if (counter === 4) {
        onEnd();
      }
    });
    executor.schedule(spy, {field1: [5, 6]}, function(err, resp) {
      expect(resp.field1).to.deep.eq([5, 6]);
      unbundledCallCounter++;
      counter++;
    });
  });

  describe('callback', function() {
    var executor = newExecutor({delayThreshold: 10});
    var spyApi = sinon.spy(apiCall);

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
      return function() {
        canceled = true;
        callback(new Error('canceled'));
      };
    }

    beforeEach(function() {
      spyApi = sinon.spy(apiCall);
    });

    it('shouldn\'t block next event after cancellation', function(done) {
      var canceller = executor.schedule(
          spyApi, {field1: [1, 2], field2: 'id'}, function(err, resp) {
            expect(err).to.be.an.instanceOf(Error);

            expect(spyApi.callCount).to.eq(0);

            executor.schedule(
                spyApi, {field1: [3, 4], field2: 'id'},
                function(err, resp) {
                  expect(resp.field1).to.deep.equal([3, 4]);
                  expect(spyApi.callCount).to.eq(1);
                  done();
                });
          });
      expect(spyApi.callCount).to.eq(0);
      canceller.cancel();
    });

    it('distinguishes a running task and a scheduled one', function(done) {
      var counter = 0;
      executor.schedule(timedAPI, {field1: [1, 2], field2: 'id'},
          function(err, resp) {
            expect(err).to.be.null;
            counter++;
            // counter should be 2 because event2 callback should be called
            // earlier (it should be called immediately on cancel).
            expect(counter).to.eq(2);
            done();
          });
      executor._runNow('id');

      var canceller = executor.schedule(
          timedAPI, {field1: [1, 2], field2: 'id'},
          function(err, resp) {
            expect(err).to.be.an.instanceOf(Error);
            counter++;
          });
      canceller.cancel();
    });
  });

  it('respects element count', function() {
    var threshold = 5;
    var executor = newExecutor({elementCountThreshold: threshold});
    var spy = sinon.spy(function(request, callback) {
      expect(request.field1.length).to.eq(threshold);
      callback(null, request);
    });
    for (var i = 0; i < threshold - 1; ++i) {
      executor.schedule(spy, {field1: [1], field2: 'id1'});
      executor.schedule(spy, {field1: [2], field2: 'id2'});
    }
    expect(spy.callCount).to.eq(0);

    executor.schedule(spy, {field1: [1], field2: 'id1'});
    expect(spy.callCount).to.eq(1);

    executor.schedule(spy, {field1: [2], field2: 'id2'});
    expect(spy.callCount).to.eq(2);

    expect(_.size(executor._tasks)).to.eq(0);
  });

  it('respects bytes count', function() {
    var unitSize = byteLength(1);
    var count = 5;
    var threshold = unitSize * count;

    var executor = newExecutor({requestByteThreshold: threshold});
    var spy = sinon.spy(function(request, callback) {
      expect(request.field1.length).to.eq(count);
      expect(byteLength(request.field1)).to.be.least(threshold);
      callback(null, request);
    });
    for (var i = 0; i < count - 1; ++i) {
      executor.schedule(spy, {field1: [1], field2: 'id1'});
      executor.schedule(spy, {field1: [2], field2: 'id2'});
    }
    expect(spy.callCount).to.eq(0);

    executor.schedule(spy, {field1: [1], field2: 'id1'});
    expect(spy.callCount).to.eq(1);

    executor.schedule(spy, {field1: [2], field2: 'id2'});
    expect(spy.callCount).to.eq(2);

    expect(_.size(executor._tasks)).to.eq(0);
  });

  it('respects element limit', function(done) {
    var threshold = 5;
    var limit = 7;
    var executor = newExecutor(
        {elementCountThreshold: threshold, elementCountLimit: limit});
    var spy = sinon.spy(function(request, callback) {
      expect(request.field1).to.be.an.instanceOf(Array);
      callback(null, request);
    });
    executor.schedule(spy, {field1: [1, 2], field2: 'id'});
    executor.schedule(spy, {field1: [3, 4], field2: 'id'});
    expect(spy.callCount).to.eq(0);
    expect(_.size(executor._tasks)).to.eq(1);

    executor.schedule(spy, {field1: [5, 6, 7], field2: 'id'});
    expect(spy.callCount).to.eq(1);
    expect(_.size(executor._tasks)).to.eq(1);

    executor.schedule(spy, {field1: [8, 9, 10, 11, 12], field2: 'id'});
    expect(spy.callCount).to.eq(3);
    expect(_.size(executor._tasks)).to.eq(0);

    executor.schedule(spy, {field1: [1, 2, 3, 4, 5, 6, 7], field2: 'id'},
        function(err, response) {
          expect(err).to.be.an.instanceOf(Error);
          done();
        });
  });

  it('respects bytes limit', function(done) {
    var unitSize = byteLength(1);
    var threshold = 5;
    var limit = 7;
    var executor = newExecutor(
        {requestByteThreshold: threshold * unitSize,
         requestByteLimit: limit * unitSize});
    var spy = sinon.spy(function(request, callback) {
      expect(request.field1).to.be.an.instanceOf(Array);
      callback(null, request);
    });
    executor.schedule(spy, {field1: [1, 2], field2: 'id'});
    executor.schedule(spy, {field1: [3, 4], field2: 'id'});
    expect(spy.callCount).to.eq(0);
    expect(_.size(executor._tasks)).to.eq(1);

    executor.schedule(spy, {field1: [5, 6, 7], field2: 'id'});
    expect(spy.callCount).to.eq(1);
    expect(_.size(executor._tasks)).to.eq(1);

    executor.schedule(spy, {field1: [8, 9, 0, 1, 2], field2: 'id'});
    expect(spy.callCount).to.eq(3);
    expect(_.size(executor._tasks)).to.eq(0);

    executor.schedule(spy, {field1: [1, 2, 3, 4, 5, 6, 7], field2: 'id'},
      function(err, response) {
        expect(err).to.be.an.instanceOf(Error);
        done();
      });
  });

  it('does not invoke runNow twice', function(done) {
    var threshold = 2;
    var executor = newExecutor({
      elementCountThreshold: threshold,
      delayThreshold: 10
    });
    executor._runNow = sinon.spy(executor._runNow.bind(executor));
    var spy = sinon.spy(function(request, callback) {
      expect(request.field1.length).to.eq(threshold);
      callback(null, request);
    });
    executor.schedule(spy, {field1: [1, 2], field2: 'id1'});
    setTimeout(function() {
      expect(spy.callCount).to.eq(1);
      expect(executor._runNow.callCount).to.eq(1);
      done();
    }, 20);
  });

  describe('timer', function() {
    it('waits on the timer', function(done) {
      var executor = newExecutor({delayThreshold: 50});
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
        executor.schedule(spy, {field1: [i], field2: 'id'}, callback);
      }
    });

    it('reschedules after timer', function(done) {
      var executor = newExecutor({delayThreshold: 50});
      var spy = sinon.spy(apiCall);
      var start = (new Date()).getTime();
      executor.schedule(spy, {field1: [0], field2: 'id'}, function() {
        expect(spy.callCount).to.eq(1);
        var firstEnded = (new Date()).getTime();
        expect(firstEnded - start).to.be.least(50);

        executor.schedule(spy, {field1: [1], field2: 'id'}, function() {
          expect(spy.callCount).to.eq(2);
          var secondEnded = (new Date()).getTime();
          expect(secondEnded - firstEnded).to.be.least(50);
          done();
        });
      });
    });
  });
});

describe('bundleable', function() {
  function func(argument, metadata, options, callback) {
    callback(null, argument);
  }
  var bundleOptions = {elementCountThreshold: 12, delayThreshold: 10};
  var descriptor = new bundling.BundleDescriptor(
      'field1', ['field2'], 'field1', byteLength);
  var settings = {settings: {bundleOptions: bundleOptions},
                  descriptor: descriptor};

  it('bundles requests', function(done) {
    var spy = sinon.spy(func);
    var callback = sinon.spy(function(obj) {
      expect(obj).to.be.an('array');
      expect(obj[0].field1).to.deep.equal([1, 2, 3]);
      if (callback.callCount === 2) {
        expect(spy.callCount).to.eq(1);
        done();
      }
    });
    var apiCall = createApiCall(spy, settings);
    apiCall({field1: [1, 2, 3], field2: 'id'}, null, function(err, obj) {
      if (err) {
        done(err);
      } else {
        callback([obj]);
      }
    });
    apiCall({field1: [1, 2, 3], field2: 'id'}, null).then(callback).catch(done);
  });

  it('suppresses bundling behavior by call options', function(done) {
    var spy = sinon.spy(func);
    var callbackCount = 0;
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
    var apiCall = createApiCall(spy, settings);
    apiCall({field1: [1, 2, 3], field2: 'id'}, null)
        .then(bundledCallback)
        .catch(done);
    apiCall({field1: [1, 2, 3], field2: 'id'}, {isBundling: false})
        .then(unbundledCallback)
        .catch(done);
    apiCall({field1: [1, 2, 3], field2: 'id'}, null)
        .then(bundledCallback)
        .catch(done);
  });

  it('cancels partially on bundling method', function(done) {
    var apiCall = createApiCall(func, settings);
    var expectedSuccess = false;
    var expectedFailure = false;
    apiCall({field1: [1, 2, 3], field2: 'id'}, null).then(function(obj) {
      expect(obj).to.be.an('array');
      expect(obj[0].field1).to.deep.equal([1, 2, 3]);
      expectedSuccess = true;
      if (expectedSuccess && expectedFailure) {
        done();
      }
    }).catch(done);
    var p = apiCall({field1: [1, 2, 3], field2: 'id'}, null);
    p.then(function(obj) {
      done(new Error('should not succeed'));
    }).catch(function(err) {
      expectedFailure = true;
      if (expectedSuccess && expectedFailure) {
        done();
      }
    });
    p.cancel();
  });
});
