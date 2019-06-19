module.exports = {
    entry: './src/browser.ts',
    output: {
      library: "Gax",
      filename: "./main.js"
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
