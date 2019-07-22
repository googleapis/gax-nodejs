const path = require('path');

module.exports = {
    entry: './src/browser.ts',
    output: {
      library: "Gax",
      filename: "./main.js"
    },
    resolve: {
      extensions: ['.ts', '.js', '.json'],
      alias: {
        '../../package.json': path.resolve(__dirname, 'package.json'),
        '../../pbjs-genfiles/operations.json': path.resolve(__dirname, 'pbjs-genfiles/operations.json'),
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
          }
        ],
      },
    mode: 'production'
}
