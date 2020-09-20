/* eslint-disable no-undef */
const path = require('path');
const glob = require("glob");
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const SRC = path.join(__dirname, 'src');
const DIST = path.join(__dirname, 'dist');

const webpackConfig = {
    context: path.resolve(__dirname, 'src/entries'),    // 基础目录，绝对路径，用于 entry 和 loader
    entry: {},
    output: {
        // 使用每次构建过程中，唯一的 hash 生成,和内容有关,可通过[hash:length] 指定长度，默认20
        filename: '[name].js',
        // 此选项决定了非入口(non-entry) chunk 文件的名称
        chunkFilename: '[name].chunk.js',
        path: DIST,
        // publicPath: '../',
    },
    mode: 'none',
    resolve: {
        extensions: [
          '.web.js',
          '.js',
          '.jsx',
          '.json'
        ],
    },
    module: {
        rules: [
            {
                test: /\.js(x)?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                    },
                ],
            },
            // {
            //     test: /\.less$/,
            //     include: SRC,
            //     use: {
            //         fallback: 'style-loader',
            //         use: ['css-loader', 'less-loader']
            //     }
            // },
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            name: 'img/[name].[ext]',
                        }
                    }
                ]
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'media/[name].[hash:7].[ext]'
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'fonts/[name].[hash:7].[ext]'
                }
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        // new ExtractTextWebpackPlugin('[name].css'),
    ],
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    name: 'commons',
                    chunks: 'all',
                    minChunks: 2,
                    reuseExistingChunk: true
                }
            }
        }
    }
};

const entryDirList = glob.sync(path.join(__dirname, 'src/entries/*'));
const entryNameList = entryDirList.map((item) => {
    const parent = path.basename(item);
    return path.basename(parent, '.js');
});

const entryMap = {};

entryNameList.forEach((entryName) => {
    entryMap[entryName] = [
        '@babel/polyfill',
        `./${entryName}.js`
    ];

    webpackConfig.plugins.push(
        new HtmlWebpackPlugin({
            template: `${SRC}/templates/index.html`,
            filename: `entry/${entryName}.html`,
            hash: false,
            inject: 'body',
            chunks: [
                entryName,
                'commons',
            ],
        }),
    );
});

webpackConfig.entry = Object.assign(webpackConfig.entry, entryMap);

module.exports = webpackConfig;
