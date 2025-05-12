const common = require("./webpack.common.js");
const { merge } = require("webpack-merge");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
// const { GenerateSW } = require("workbox-webpack-plugin");
const { InjectManifest } = require("workbox-webpack-plugin");

module.exports = merge(common, {
  mode: "production",
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(), 
    new MiniCssExtractPlugin(),
    new CopyWebpackPlugin({
    patterns: [{ from: 'manifest.json', to: '.' }],
    }),
    new InjectManifest({
      swSrc: './src/sw.js', 
      swDest: 'sw.js',
    }),
    // new GenerateSW({
    //   swDest: 'sw.js',
    //   clientsClaim: true,
    //   skipWaiting: false,
    //   runtimeCaching: [
    //     {
    //       urlPattern: ({ request }) => request.mode === 'navigate',
    //       handler: 'NetworkFirst',
    //     },
    //     {
    //       urlPattern: ({ request }) =>
    //         ['style', 'script', 'image'].includes(request.destination),
    //       handler: 'CacheFirst',
    //     },
    //   ],
    // }),
  ],
});
