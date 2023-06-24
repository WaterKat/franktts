var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyPlugin = require('copy-webpack-plugin');

const path = require('path');

const sourcePath = path.resolve(__dirname, 'src');
const buildPath = path.resolve(__dirname, 'dist');

module.exports = {
//    mode: 'development',
    entry: path.resolve(sourcePath, 'js', 'index.js'),
    output: {
        filename: 'bundle.js',
        path: buildPath,
    },
    plugins: [
        new HtmlWebpackPlugin({
            hash: true,
            template: path.resolve(sourcePath, 'html', 'index.html'),
            filename: path.resolve(buildPath, 'index.html'),

            title: 'franktts'
        }),
        new CopyPlugin({
            patterns: [
                { from: path.resolve(sourcePath, 'css', 'styles.css'), to: buildPath },
            ],
        }),
    ],
}
