const path = require("path");
const nodeExternals = require("webpack-node-externals");
const DashboardPlugin = require("webpack-dashboard/plugin");

module.exports = {
  mode: "development", // production
  entry: "./src/nd.ts",
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.(html)$/,
        use: {
          loader: "html-loader"
        }
      },
      {
        test: /\.ts?$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".html", ".ts", ".js"]
  },
  plugins: [new DashboardPlugin()],
  output: {
    filename: "nd.min.js",
    path: path.resolve(__dirname, ".caches")
  },
  target: "node",
  externals: [nodeExternals()]
};
