import { Configuration } from 'webpack';
import { join } from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const config: Configuration = {
    mode: 'development',
    entry: {
        document_start: join(__dirname, 'apps', 'content_script', 'document_start', 'start.ts'),
        document_idle: join(__dirname, 'apps', 'content_script', 'document_idle', 'idle.ts'),
        options: join(__dirname, 'apps', 'option', 'options.ts'),
        popup: join(__dirname, 'apps', 'popup', 'popup.ts'),
    },
    output: {
        path: join(__dirname, 'dist'),
        filename: '[name].js',
    },
    module: {
        rules: [
            { test: /\.ts$/, loader: 'ts-loader' },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    plugins: [
        new HtmlWebpackPlugin(
            {
                template: join(__dirname, 'apps/popup/popup.html'),
                filename: 'popup/popup.html',
                chunks: ['popup'],
            },
        ),
        new HtmlWebpackPlugin(
            {
                template: join(__dirname, 'apps/option/options.html'),
                filename: 'option/options.html',
                chunks: ['options'],
            },
        ),
    ],
    devtool: 'source-map',
};

export default config;
