const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const config = {
  mode: "development",
  experiments: {
    topLevelAwait: true,
  },
  entry: {
    document_start: path.join(__dirname, "apps", "entry", "document_start.ts"),
    document_idle: path.join(__dirname, "apps", "entry", "document_idle.ts"),
    options: path.join(__dirname, "apps", "entry", "options.ts"),
    popup: path.join(__dirname, "apps", "entry", "popup.ts"),
    tabby: path.join(__dirname, "apps", "entry", "options-tabby.ts"),
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "assets/[name].js",
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
          from: "public",
          to: "",
        },
        {
          from: "node_modules/tabbyjs/dist/css/tabby-ui.css",
          to: "css",
        },
      ],
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "apps/page/popup/popup.html"),
      filename: "page/popup/popup.html",
      chunks: ["popup"],
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "apps/page/option/options.html"),
      filename: "page/option/options.html",
      chunks: ["options", "tabby"],
    }),
  ],
  devtool: "source-map",
};

module.exports = config;
