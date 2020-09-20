const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const openBrowser = require('./lib/openBrowser');
const webpackConfig = require('../webpack.dev.config');

const defaults = {
    host: '0.0.0.0',
    port: 8080,
}

const addDevClientToEntry = (config, devClient) => {
    const { entry } = config;
    if (typeof entry === 'object' && !Array.isArray(entry)) {
        Object.keys(entry).forEach((key) => {
            entry[key] = devClient.concat(entry[key]);
        });
    } else if (typeof entry === 'function') {
        config.entry = entry(devClient);
    } else {
        config.entry = devClient.concat(entry);
    }
};

const devServerConfig = {
    contentBase: './dist',
    // 并不起作用
    open: true,
    // 并不起作用
    openPage: 'entry/entry1.html',
    // 监听托管在contentBase文件夹内的内容变化
    watchContentBase: true,
    // 启用webpack的模块热替换特性
    hot: true,
    // 开启HMR，但是仅在构建成功时刷新页面
    hotOnly: false,
    // 配合验证overlay属性
    overlay: false
}

let isOpen = false;
const entry = 'entry/index.html'
const devClients = [
    // dev server client
    `webpack-dev-server/client?http://${defaults.host}:${defaults.port}`,
    // hmr client
    require.resolve(devServerConfig.hotOnly
        ? 'webpack/hot/only-dev-server'
        : 'webpack/hot/dev-server'),
];
addDevClientToEntry(webpackConfig, devClients)
const compiler = webpack(webpackConfig);
compiler.hooks.done.tap({ name: 'OpenBrowserPlugin' }, stats => {
    if (stats.hasErrors()) {
        return;
    }
    // 存在open-browser-webpack-plugin插件，但DevServer往往与webpack分开配置
    if (!isOpen) {
        isOpen = true;
        openBrowser(`http://${defaults.host}:${defaults.port}/${entry}`);
    }
})

const server = new WebpackDevServer(compiler, devServerConfig);

server.listen(defaults.port, defaults.host, ()=>{
    console.log(`Starting server on http://${defaults.host}:${defaults.port}`)
})