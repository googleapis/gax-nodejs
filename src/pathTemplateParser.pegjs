/**
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

{
   const extras = require('./parser_extras');
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
    return ([
      { kind: extras.BINDING,     literal: l },
      segments,
      { kind: extras.END_BINDING, literal: '' }
    ]).reduce((a, b) => a.concat(b), []);
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
