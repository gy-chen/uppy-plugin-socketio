const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");

module.exports = {
  devtool: "source-map",
  entry: "./src/plugin/SocketIOUploader.js",
  plugins: [
    new CleanWebpackPlugin(["dist"]),
    new UglifyJSPlugin({
      sourceMap: true
    })
  ],
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    library: "SocketIOUpload",
    libraryTarget: "umd"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      }
    ]
  }
};
