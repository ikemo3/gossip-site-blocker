import { Configuration } from 'webpack';
import { join } from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import WebpackShellPluginNext from 'webpack-shell-plugin-next';

const config: Configuration = {
    mode: 'development',
    entry: {
        document_start: join(__dirname, 'apps', 'entry', 'document_start.ts'),
        document_idle: join(__dirname, 'apps', 'entry', 'document_idle.ts'),
        options: join(__dirname, 'apps', 'entry', 'options.ts'),
        popup: join(__dirname, 'apps', 'entry', 'popup.ts'),
        tabby: join(__dirname, 'apps', 'entry', 'options-tabby.ts'),
    },
    output: {
        path: join(__dirname, 'dist'),
        filename: '[name].js',
    },
    module: {
        rules: [{ test: /\.ts$/, loader: 'ts-loader' }],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    plugins: [
        new CleanWebpackPlugin({
            cleanAfterEveryBuildPatterns: [
                '!_locales/*/*',
                '!icons/*',
                '!styles/*',
                '!.web-extension-id',
            ],
        }),
        new CopyPlugin([
            {
                from: 'apps/_locales',
                to: '_locales',
            },
            {
                from: 'apps/icons',
                to: 'icons',
            },
            {
                from: 'apps/styles',
                to: 'styles',
            },
            {
                from: 'node_modules/tabbyjs/dist/css/tabby-ui.css',
                to: 'styles',
            },
            {
                from: 'apps/.web-extension-id',
                to: '',
            },
        ]),
        new HtmlWebpackPlugin({
            template: join(__dirname, 'apps/popup/popup.html'),
            filename: 'popup/popup.html',
            chunks: ['popup'],
        }),
        new HtmlWebpackPlugin({
            template: join(__dirname, 'apps/option/options.html'),
            filename: 'option/options.html',
            chunks: ['options', 'tabby'],
        }),
        new WebpackShellPluginNext({
            onBuildExit: {
                scripts: ['yarn manifest'],
                blocking: true,
                parallel: false,
            },
        }),
    ],
    devtool: 'source-map',
};

export default config;
