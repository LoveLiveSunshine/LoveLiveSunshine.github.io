var webpack = require('webpack');
var merge = require('webpack-merge');
var args = require('minimist')(process.argv.slice(2));

var env;
if (args._.length > 0 && args._.indexOf('start') !== -1) {
  env = 'test';
} else if (args.env) {
  env = args.env;
} else {
  env = 'dev';
}

var baseConfig = {
  entry: {
    index: ['./src/index.js']
  },
  output: {
    path: './dist',
    filename: 'bundle.js',
    publicPath: '/dist/'
  },
  module: {
    loaders: [{
      test: /\.css$/,
      loader: 'style-loader!css-loader'
    }, {
      test: /\.js$/,
      loader: 'babel',
      query: {
        presets: ['es2015']
      },
      exclude: /node_modules/
    }, {
      test: /\.(png|jpg)$/,
      loader: 'url-loader?limit=8192'
    }, {
      test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: 'url-loader?limit=10000&minetype=application/font-woff'
    }, {
      test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: 'file-loader'
    }, {
      test: /\.json$/,
      loader: 'json-loader'
    }, {
      test: /\.pug$/,
      loader: 'pug-loader'
    }]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    })
  ]
};

module.exports = merge(baseConfig, require('./webpack.config.' + env + '.js'));