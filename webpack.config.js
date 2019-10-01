const path = require('path');

module.exports = {
    entry: './src/fallback.ts',
    output: {
      library: "Gax",
      filename: "./gax.js"
    },
    resolve: {
      extensions: ['.ts', '.js', '.json'],
      alias: {
        '../../package.json': path.resolve(__dirname, 'package.json'),
        '../../protos/operations.json': path.resolve(__dirname, 'protos/operations.json'),
        '../../protos/status.json': path.resolve(__dirname, 'protos/status.json'),
      },
    },
    module: {
        rules: [
          {
            test: /\.ts$/,
            use: 'ts-loader',
            exclude: /node_modules/,
          },
          {
            test: /node_modules[\\\/]retry-request[\\\/]/,
            use: 'null-loader',
          },
          {
            test: /node_modules[\/]google-auth-library/,
            use: 'null-loader',
          }
        ],
      },
    mode: 'production'
}
