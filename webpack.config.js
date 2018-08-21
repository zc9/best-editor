const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
module.exports = (env, argv) => {
    var DEV = argv.mode === 'development';
    var config = {
        entry: './src/main.js',
        devtool: DEV ? 'inline-source-map' : '',
        output: {
            filename: DEV ? 'best-editor.js' : 'best-editor.min.js',
            path: path.resolve(__dirname, 'dist'),
            library: 'BestEditor',
            libraryTarget: 'umd',
            umdNamedDefine: true
        },
        module: {
            rules: [{
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }, {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            }, {
                test: /\.scss$/,
                use: [{
                    loader: MiniCssExtractPlugin.loader
                }, {
                    loader: 'css-loader'
                }, {
                    loader: 'sass-loader'
                }]
            }, {
                test: /\.html$/,
                use: [{
                    loader: 'html-loader',
                    options: {
                        minimize: true,
                        removeComments: false,
                        collapseWhitespace: false
                    }
                }],
            }, {
                test: /\.(ttf|eot|woff|woff2)$/,
                use: {
                  loader: 'file-loader',
                  options: {
                    name: 'fonts/[name].[ext]',
                  },
                }
            }]
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: DEV ? 'best-editor.css' : 'best-editor.min.css'
            })
        ]
    };
    return config;
};

