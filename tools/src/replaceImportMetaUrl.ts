// Copyright 2023 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// eslint-disable-next-line node/no-extraneous-import
import {smart} from '@babel/template';
import {Statement} from '@babel/types';
import {Visitor} from '@babel/core';

export interface PluginOptions {
  opts?: {
    replacementValue?: string;
  };
}

export default function replaceImportMetaUrl(): {
  visitor: Visitor<PluginOptions>;
} {
  return {
    visitor: {
      MemberExpression(path, state) {
        const opts = state.opts || {};
        const replacementValue = opts.replacementValue || '__dirname';
        const {node} = path;
        if (
          node.object.type === 'MetaProperty' &&
          node.object.meta.name === 'import' &&
          node.object.property.name === 'meta' &&
          node.property.type === 'Identifier' &&
          node.property.name === 'url'
        ) {
          const replacement = smart.ast`${replacementValue}` as Statement;
          path.replaceWith(replacement);
        }
      },
    },
  };
}
