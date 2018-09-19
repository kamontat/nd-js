const path = require("path");
const nodeExternals = require("webpack-node-externals");
const DashboardPlugin = require("webpack-dashboard/plugin");

module.exports = {
  mode: "production",
  entry: "./nd.ts",
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  plugins: [new DashboardPlugin()],
  output: {
    filename: "nd.min.js",
    path: path.resolve(__dirname, ".caches")
  },
  target: "node",
  externals: [nodeExternals()]
};
