/*
 *
 * Copyright 2016, Google Inc.
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
 *
 */

{
   var _ = require('lodash');
   var util = require('util');
   var extras = require('./parser_extras');
}


template
  = '/' segments:bound_segments { return segments; }
  / segments:bound_segments { return segments; }


bound_segments
  = s:bound_segment '/' segments:bound_segments {
     return s.concat(segments);
  }
  / bound_segment


bound_segment
  = s:( bound_terminal / variable ) { return s; }


variable
  = '{' l:literal '=' segments:unbound_segments '}' {
    return _.flatten([
      { kind: extras.BINDING,     literal: l },
      segments,
      { kind: extras.END_BINDING, literal: '' }
    ]);
  }
  / '{' l:literal '}' {
    return [
      { kind: extras.BINDING,     literal: l },
      { kind: extras.TERMINAL,    literal: '*' },
      { kind: extras.END_BINDING, literal: '' }
    ];
  }


unbound_segments
  = t:unbound_terminal '/' segments:unbound_segments {
     return t.concat(segments);
  }
  / unbound_terminal


bound_terminal
  = t:unbound_terminal {
     if (t[0].literal === '*' || t[0].literal === '**') {
       return [
         {
           kind: extras.BINDING,
         },
         t[0],
         { kind: extras.END_BINDING, literal: '' }
       ];
     } else {
       return t;
     }
  }


unbound_terminal
  = l:( '**' / '*' / literal ) {
     return [
       { kind: extras.TERMINAL, literal: l }
     ];
  }

literal
  = cs:[^*=}{/]+ { return cs.join('') }
