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
      Promise.resolve(func), settings, new streaming.StreamDescriptor(type));
}

describe('streaming', function() {
  it('handles server streaming', function(done) {
    var spy = sinon.spy(function(argument, metadata, options) {
      expect(arguments.length).to.eq(3);
      var s = through2.obj();
      s.push({resources: [1, 2]});
      s.push({resources: [3, 4, 5]});
      s.push(null);
      return s;
    });

    var apiCall = createApiCall(
        spy, streaming.StreamType.SERVER_STREAMING);
    var callback = sinon.spy(function(data) {
      if (callback.callCount === 1) {
        expect(data).to.deep.equal({resources: [1, 2]});
      } else {
        expect(data).to.deep.equal({resources: [3, 4, 5]});
      }
    });
    var s = apiCall(null, null)
      .on('data', callback)
      .on('end', function() {
        expect(callback.callCount).to.eq(2);
        done();
      });
    expect(s.readable).to.be.true;
    expect(s.writable).to.be.false;
  });

  it('handles client streaming', function(done) {
    function func(metadata, options, callback) {
      expect(arguments.length).to.eq(3);
      var written = [];
      return through2.obj()
        .on('end', function() {
          callback(null, written);
        })
        .on('error', callback)
        .on('data', function(data) {
          written.push(data);
        });
    }

    var apiCall = createApiCall(
        func, streaming.StreamType.CLIENT_STREAMING);
    var s = apiCall(null, null)
        .on('response', function(response) {
          expect(response).to.deep.eq(['foo', 'bar']);
          done();
        });
    expect(s.readable).to.be.false;
    expect(s.writable).to.be.true;
    s.write('foo');
    s.write('bar');
    s.end();
  });

  it('handles errors on ending client streaming', function(done) {
    function func(metadata, options, callback) {
      expect(arguments.length).to.eq(3);
      return through2.obj()
        .on('end', function() {
          callback(new Error());
        })
        .on('data', function(data) {
          expect(data).to.eq('foo');
        });
    }

    var apiCall = createApiCall(
        func, streaming.StreamType.CLIENT_STREAMING);
    var s = apiCall(null, null)
        .on('response', function() {
          done(new Error('should not reach'));
        })
        .on('error', function(err) {
          expect(err).to.be.an('error');
          done();
        });
    expect(s.readable).to.be.false;
    expect(s.writable).to.be.true;
    s.write('foo');
    s.end();
  });

  it('handles bidi streaming', function(done) {
    function func(metadata, options) {
      expect(arguments.length).to.eq(2);
      var s = through2.obj();
      return s;
    }

    var arg = {foo: 'bar'};
    var callback = sinon.spy(function(data) {
      expect(data).to.eq(arg);
    });
    var apiCall = createApiCall(
        func, streaming.StreamType.BIDI_STREAMING);
    var s = apiCall(null, null)
      .on('data', callback)
      .on('end', function() {
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
      metadata: responseMetadata
    };
    function func(metadata, options) {
      var s = through2.obj()
        .on('end', function() {
          s.emit('status', status);
        });
      setTimeout(function() {
        s.emit('metadata', responseMetadata);
      }, 10);
      return s;
    }
    var apiCall = createApiCall(
        func, streaming.StreamType.BIDI_STREAMING);
    var receivedMetadata;
    var receivedStatus;
    var receivedResponse;
    var s = apiCall(null, null)
      .on('metadata', function(data) {
        receivedMetadata = data;
      })
      .on('status', function(data) {
        receivedStatus = data;
      })
      .on('response', function(data) {
        receivedResponse = data;
      })
      .on('end', function() {
        expect(receivedMetadata).to.deep.eq(responseMetadata);
        expect(receivedStatus).to.deep.eq(status);
        expect(receivedResponse).to.deep.eq(expectedResponse);
        done();
      });
    expect(s.readable).to.be.true;
    expect(s.writable).to.be.true;
    setTimeout(function() {
      s.end();
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
    function func(metadata, options) {
      var s = through2.obj();
      schedulePush(s, 0);
      s.cancel = function() {
        s.end();
        s.emit('error', cancelError);
      };
      return s;
    }
    var apiCall = createApiCall(
        func, streaming.StreamType.SERVER_STREAMING);
    var counter = 0;
    var expectedCount = 5;
    var s = apiCall(null, null)
      .on('data', function(data) {
        expect(data).to.eq(counter);
        counter++;
        if (counter === expectedCount) {
          s.cancel();
        } else if (counter > expectedCount) {
          done(new Error('should not reach'));
        }
      })
      .on('error', function(err) {
        expect(err).to.eq(cancelError);
        done();
      });
  });
});
