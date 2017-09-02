const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: './lib/msRestAzure.ts',
  devtool: 'source-map',
  output: {
    filename: 'msRestAzureBundle.js',
    path: __dirname,
    libraryTarget: 'var',
    library: 'msRestAzure'
  },
  plugins: [
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /(node_modules|test)/,
        options: {
          configFile: './tsconfig.json'
        }
      }
    ]
  },
  // If we are using externals then we do not need alias. With externals 
  // the assumption is that customers will externally import/include ms-rest-ts.
  // externals: {
  //   "ms-rest-ts": "msRest"
  // },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      "moment": path.resolve('./node_modules/moment/min/moment.min.js'),
      "ms-rest-ts": path.resolve('./node_modules/ms-rest-ts/dist/lib/msRest.js')
    }
  },
  node: {
    fs: false,
    net: false,
    path: false,
    dns: false,
    tls: false,
    tty: false,
    v8: false,
    Buffer: false
  }
};