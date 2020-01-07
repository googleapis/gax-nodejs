/*
 * Copyright 2019, Google LLC
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

// [START gax_pagination]
async function main() {
  // Showcases auto-pagination functionality.

  const gax = require('google-gax');

  // Let's say we have an API call that returns results grouped into pages.
  // It accepts 4 parameters (just like gRPC stub calls do):
  function doStuff(request, options, metadata, callback) {
    let result = {};

    if (!request.pageToken) {
      result = {
        animals: ['cat', 'dog'],
        nextPageToken: 'page2',
      };
    } else if (request.pageToken === 'page2') {
      result = {
        animals: ['snake', 'turtle'],
        nextPageToken: 'page3',
      };
    } else if (request.pageToken === 'page3') {
      result = {
        animals: ['wolf'],
        nextPageToken: null,
      };
    }
    callback(null, result);
  }

  // Default call settings work for us here:
  const settings = new gax.CallSettings();

  // We define a page descriptor that defines request and response fields that
  // are used for pagination. In the request object, it's `nextPageToken`;
  // in response object, it's `pageToken` and `animals` (which is a resource
  // field, i.e. the only response field that the user actually needs).
  const pageDescriptor = new gax.PageDescriptor(
    /* requestPageTokenField: */ 'pageToken',
    /* responsePageTokenField: */ 'nextPageToken',
    /* resourceField: */ 'animals'
  );

  // Create API call:
  const wrappedFunction = gax.createApiCall(
    /* func: */ doStuff,
    /* settings: */ settings,
    /* descriptor: */ pageDescriptor
  );

  // Call it!
  const [resources] = await wrappedFunction({request: 'empty'});
  console.log(resources);
}

main().catch(console.error);
// [END gax_pagination]
