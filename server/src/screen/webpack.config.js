/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.ts',
    module: {
        rules: [
            {
                test: /\.(ts|tsx)?$/,
                exclude: /node_modules/,
                use: ['babel-loader', 'ts-loader'],
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.(css|s[ac]ss)$/,
                exclude: /\.module\.(css|s[ac]ss)$/,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            implementation: require('node-sass'),
                        },
                    },
                ],
            },
            {
                test: /\.module\.(css|s[ac]ss)$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                localIdentName: '[name]__[local]___[hash:base64:5]',
                            }
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            implementation: require('node-sass'),
                        },
                    },
                ],
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'templates/index.html'
        }),
    ],
    target: ['web', 'es5'],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[contenthash].js',
        clean: true,
    },
    devServer: {
        static: path.join(__dirname, 'dist'),
        allowedHosts: 'all',
    },
};