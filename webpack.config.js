const webpack = require('webpack');
const path = require('path');
require('dotenv').config()

module.exports = {
  entry: path.join(__dirname, 'src', 'js'),
  output: {
    path: path.join(__dirname, 'public', 'js'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          cacheDirectory: 'babel_cache',
          presets: ['react', 'es2015']
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.API_URL': JSON.stringify(process.env.API_URL),
      'process.env.TWITCH_CLIENT_ID': JSON.stringify(process.env.TWITCH_CLIENT_ID),
      'process.env.API_HOST': JSON.stringify(process.env.API_HOST),
      'process.env.LOGIN_REDIRECT_URL': JSON.stringify(process.env.LOGIN_REDIRECT_URL),
      'process.env.WEBSOCKET_HOST': JSON.stringify(process.env.WEBSOCKET_HOST)
    })
  ]
};
