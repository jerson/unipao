const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const dev = process.env.NODE_ENV === 'development';

module.exports = {
    entry: ['./index.js'],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'unipao.js'
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract('css-loader!sass-loader')
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loader: 'file-loader?name=images/[name].[ext]',

            },
            {
                test: /\.(woff|woff2|ttf|eot|svg)(\?[\s\S]+)?$/,
                loader: 'file-loader?limit=10000&name=fonts/[name].[ext]'
            },
        ]
    },
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.optimize.UglifyJsPlugin(),
        new HtmlWebpackPlugin({
            template: './index.html',
            hash:true,
        }),
        new HtmlWebpackPlugin({
            template: './policy.html',
            filename:'policy.html',
            hash:true,
            inject:false
        }),
        new ExtractTextPlugin({
            filename: 'unipao.css',
        }),
        new OptimizeCssAssetsPlugin(),
    ]
};

