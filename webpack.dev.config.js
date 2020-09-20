/* eslint-disable no-undef */
const webpack = require('webpack')
const {merge} = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.config.js')

module.exports = merge(baseWebpackConfig, {
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
    ],
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000,
        open: 'Google Chrome',
        onListening: function(server) {
            const port = server.listeningApp.address().port;
            console.log('Listening on port:', port);
          }
      }
})