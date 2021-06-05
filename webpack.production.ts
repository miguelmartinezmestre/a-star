import path from "path";
import {Configuration} from "webpack";
import {CheckerPlugin} from "awesome-typescript-loader";
const WebpackObfuscator = require("webpack-obfuscator");

const config: Configuration = {
  mode: "production",
  resolve: { extensions: [".ts", ".js", ".tsx"] },
  entry: path.resolve(__dirname, "src", "index.ts"),
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "awesome-typescript-loader",
      },
      {
        test: /\.js$/,
        enforce: "post",
        use: {
          loader: WebpackObfuscator.loader,
          options: {
            rotateStringArray: true,
          },
        },
      },
    ],
  },
  plugins: [
    new CheckerPlugin(),
    new WebpackObfuscator({
      rotateStringArray: true,
    }),
  ],
};

module.exports = config;
