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

/* jshint expr: true*/

'use strict';

var apiCallable = require('../lib/api_callable');
var gax = require('../lib/gax');
var streaming = require('../lib/streaming');
var expect = require('chai').expect;
var sinon = require('sinon');
var through2 = require('through2');

function createApiCall(func, type) {
  // can't use "createApiCall" in util.js because argument list is different
  // in streaming API call.
  var settings = new gax.CallSettings();
  return apiCallable.createApiCall(
    Promise.resolve(func),
    settings,
    new streaming.StreamDescriptor(type)
  );
}

describe('streaming', function() {
  it('handles server streaming', function(done) {
    var spy = sinon.spy(function() {
      expect(arguments.length).to.eq(3);
      var s = through2.obj();
      s.push({resources: [1, 2]});
      s.push({resources: [3, 4, 5]});
      s.push(null);
      return s;
    });

    var apiCall = createApiCall(spy, streaming.StreamType.SERVER_STREAMING);
    var s = apiCall(null, null);
    var callback = sinon.spy(function(data) {
      if (callback.callCount === 1) {
        expect(data).to.deep.equal({resources: [1, 2]});
      } else {
        expect(data).to.deep.equal({resources: [3, 4, 5]});
      }
    });
    expect(s.readable).to.be.true;
    expect(s.writable).to.be.false;
    s.on('data', callback);
    s.on('end', function() {
      expect(callback.callCount).to.eq(2);
      done();
    });
  });

  it('handles client streaming', function(done) {
    function func(metadata, options, callback) {
      expect(arguments.length).to.eq(3);
      var s = through2.obj();
      var written = [];
      s.on('end', function() {
        callback(null, written);
      });
      s.on('error', callback);
      s.on('data', function(data) {
        written.push(data);
      });
      return s;
    }

    var apiCall = createApiCall(func, streaming.StreamType.CLIENT_STREAMING);
    var s = apiCall(null, null, function(err, response) {
      expect(err).to.be.null;
      expect(response).to.deep.eq(['foo', 'bar']);
      done();
    });
    expect(s.readable).to.be.false;
    expect(s.writable).to.be.true;
    s.write('foo');
    s.write('bar');
    s.end();
  });

  it('handles bidi streaming', function(done) {
    function func() {
      expect(arguments.length).to.eq(2);
      var s = through2.obj();
      return s;
    }

    var apiCall = createApiCall(func, streaming.StreamType.BIDI_STREAMING);
    var s = apiCall(null, null);
    var arg = {foo: 'bar'};
    var callback = sinon.spy(function(data) {
      expect(data).to.eq(arg);
    });
    s.on('data', callback);
    s.on('end', function() {
      expect(callback.callCount).to.eq(2);
      done();
    });
    expect(s.readable).to.be.true;
    expect(s.writable).to.be.true;
    s.write(arg);
    s.write(arg);
    s.end();
  });

  it('forwards metadata and status', function(done) {
    var responseMetadata = {metadata: true};
    var status = {code: 0, metadata: responseMetadata};
    var expectedResponse = {
      code: 200,
      message: 'OK',
      details: '',
      metadata: responseMetadata,
    };
    function func() {
      var s = through2.obj();
      setTimeout(function() {
        s.emit('metadata', responseMetadata);
      }, 10);
      s.on('end', function() {
        s.emit('status', status);
      });
      return s;
    }
    var apiCall = createApiCall(func, streaming.StreamType.BIDI_STREAMING);
    var s = apiCall(null, null);
    var receivedMetadata;
    var receivedStatus;
    var receivedResponse;
    s.on('metadata', function(data) {
      receivedMetadata = data;
    });
    s.on('status', function(data) {
      receivedStatus = data;
    });
    s.on('response', function(data) {
      receivedResponse = data;
    });
    s.on('end', function() {
      expect(receivedMetadata).to.deep.eq(responseMetadata);
      expect(receivedStatus).to.deep.eq(status);
      expect(receivedResponse).to.deep.eq(expectedResponse);
      done();
    });
    expect(s.readable).to.be.true;
    expect(s.writable).to.be.true;
    setTimeout(function() {
      s.end(s);
    }, 50);
  });

  it('cancels in the middle', function(done) {
    function schedulePush(s, c) {
      var intervalId = setInterval(function() {
        s.push(c);
        c++;
      }, 10);
      s.on('finish', function() {
        clearInterval(intervalId);
      });
    }
    var cancelError = new Error('cancelled');
    function func() {
      var s = through2.obj();
      schedulePush(s, 0);
      s.cancel = function() {
        s.end();
        s.emit('error', cancelError);
      };
      return s;
    }
    var apiCall = createApiCall(func, streaming.StreamType.SERVER_STREAMING);
    var s = apiCall(null, null);
    var counter = 0;
    var expectedCount = 5;
    s.on('data', function(data) {
      expect(data).to.eq(counter);
      counter++;
      if (counter === expectedCount) {
        s.cancel();
      } else if (counter > expectedCount) {
        done(new Error('should not reach'));
      }
    });
    s.on('error', function(err) {
      expect(err).to.eq(cancelError);
      done();
    });
  });
});
