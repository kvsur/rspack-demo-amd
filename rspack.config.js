const { defineConfig } = require("@rspack/cli");
const path =  require('path');
const rspack = require('@rspack/core');

module.exports = defineConfig({
  mode: 'development',
  entry: {
    index: './src/index.js',
  },
  output: {
    library: {
      type: 'system',
    },
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '',
  },
  resolve: {
    extensions: ['.js'],
  },
  plugins: [
    new rspack.ProgressPlugin(),
    new rspack.HtmlRspackPlugin({
      filename: 'index.html',
      template: 'src/index.html',
      minify: false,
      inject: true,
    }),
  ],
});