/**
 * Copyright 2022 Google LLC
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

module.exports = {
  entry: './build/src/index.js',
  resolve: {
    extensions: ['.ts', '.js', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /node_modules[\\/]retry-request[\\/]/,
        use: 'null-loader',
      },
      {
        test: /node_modules[\\/]google-auth-library/,
        use: 'null-loader',
      },
      {
        test: /node_modules[\\/]@grpc[\\/]grpc-js/,
        use: 'null-loader',
      },
      {
        test: /build[\\/]src[\\/]grpc\.js$/,
        use: 'null-loader',
      },
    ],
  },
  node: {
    fs: 'empty',
    child_process: 'empty',
  },
  mode: 'production',
};
