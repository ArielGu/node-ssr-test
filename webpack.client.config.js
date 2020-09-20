/* eslint-disable no-undef */
const path = require("path")
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports={
    entry:"./src/client/index.js",
    mode:"development",
    output:{
        filename:"index.js",
        path:path.resolve(__dirname,'public')
    },
    resolve: {
        extensions: [
          '.web.js',
          '.js',
          '.jsx',
          '.json'
        ],
    },
    module:{
        rules:[{
            test:/\.jsx?$/,
            loader:"babel-loader",
            exclude:/node_modules/
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, '/src/templates/index.html'),
            filename: `entry/index.html`,
            hash: false,
            inject: 'body',
            chunks: [
                'index',
            ],
        }),
    ]
}