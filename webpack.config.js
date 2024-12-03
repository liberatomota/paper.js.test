import path, { resolve as _resolve } from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
    entry: {
        index: './src/index.ts',
    },
    output: {
        filename: '[name].bundle.js',
        path: _resolve(__dirname, 'dist'),
        clean: true, // Clean the output directory before each build
    },
    resolve: {
        extensions: ['.ts', '.js', '.css'],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader', 'postcss-loader'],
            },
            {
                test: /\.png/,
                type: 'asset/resource'
            }
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            filename: 'index.html',
            chunks: ['index'],
            inject: 'body',
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'src/styles', to: 'styles' },
            ],
        }),
    ],
    devServer: {
        static: {
            directory: _resolve(__dirname, 'dist'), // Serve from dist
        },
        compress: true,
        port: 3000,
        hot: true,
        open: true,
    },
    mode: 'development', // Set mode to development
};
