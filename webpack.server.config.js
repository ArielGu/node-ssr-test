const path = require('path')
const nodeExternals = require("webpack-node-externals");

module.exports = {
    target:"node",
    entry:"./src/server/index.js",
    mode:"development",
    resolve: {
        extensions: [
          '.web.js',
          '.js',
          '.jsx',
          '.json'
        ],
    },
    output:{
        filename:"bundle.js",
        // eslint-disable-next-line no-undef
        path:path.resolve(__dirname,'build')
    },
    node: {
        // Need this when working with express, otherwise the build fails
        __dirname: false,   // if you don't put this is, __dirname
        __filename: false,  // and __filename return blank or /
    },
    externals:[nodeExternals()],
    //配置以后 require引用的node_modules不会被打包，还会保存之前的引用形式https://www.cnblogs.com/fanqshun/p/10073493.html
    module:{
        rules:[
            {
                test:/\.jsx?$/,
                loader:"babel-loader",
                exclude:/node_modules/
            }
        ]
    }
}