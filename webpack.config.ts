import { Configuration } from "webpack";
import { join } from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";
import WebpackShellPluginNext from "webpack-shell-plugin-next";
import path from "path";
import { fileURLToPath } from "url";

// eslint-disable-next-line no-underscore-dangle
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config: Configuration = {
  mode: "development",
  experiments: {
    topLevelAwait: true,
  },
  entry: {
    document_start: join(__dirname, "apps", "entry", "document_start.ts"),
    document_idle: join(__dirname, "apps", "entry", "document_idle.ts"),
    options: join(__dirname, "apps", "entry", "options.ts"),
    popup: join(__dirname, "apps", "entry", "popup.ts"),
    tabby: join(__dirname, "apps", "entry", "options-tabby.ts"),
  },
  output: {
    path: join(__dirname, "dist"),
    filename: "[name].js",
    clean: true,
  },
  module: {
    rules: [{ test: /\.ts$/, loader: "ts-loader" }],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: "apps/_locales",
          to: "_locales",
        },
        {
          from: "apps/icons",
          to: "icons",
        },
        {
          from: "public/css",
          to: "css",
        },
        {
          from: "node_modules/tabbyjs/dist/css/tabby-ui.css",
          to: "css",
        },
        {
          from: "apps/.web-extension-id",
          to: "",
        },
      ],
    }),
    new HtmlWebpackPlugin({
      template: join(__dirname, "apps/page/popup/popup.html"),
      filename: "page/popup/popup.html",
      chunks: ["popup"],
    }),
    new HtmlWebpackPlugin({
      template: join(__dirname, "apps/page/option/options.html"),
      filename: "page/option/options.html",
      chunks: ["options", "tabby"],
    }),
    new WebpackShellPluginNext({
      onBuildExit: {
        scripts: ["pnpm manifest"],
        blocking: true,
        parallel: false,
      },
    }),
  ],
  devtool: "source-map",
};

export default config;
