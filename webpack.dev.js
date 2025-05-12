const path = require("path");
const common = require("./webpack.common.js");
const { merge } = require("webpack-merge");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const {InjectManifest} = require("workbox-webpack-plugin");


module.exports = merge(common, {
  mode: "development",
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  devServer: {
    static: path.resolve(__dirname, "docs"),
    port: 9000,
    client: {
      overlay: {
        errors: true,
        warnings: true,
      },
    },
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: "manifest.json", to: "" },
      ],
    }),
    new InjectManifest({
      swSrc: './src/sw.js', 
      swDest: 'sw.js',
    }),
  ],
});

