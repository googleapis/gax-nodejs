module.exports = {
    entry: './src/browser.ts',
    output: {
      library: "Gax",
      filename: "./main.js"
    },
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
        ],
      },
    mode: 'development'
}
