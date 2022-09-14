const path = require("path");
const webpack = require("webpack");
const CompressionPlugin = require('compression-webpack-plugin')

module.exports = {
  entry: {
    App: "./src/App.js"
  },

  output: {
    path: path.resolve(__dirname, "./static/build/"),
    filename: "App.js",
  },
  
  module: {
    rules: [
      {
        test: /\.js|.jsx$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\.css$/,
        // exclude: /node_modules/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(jpe?g|gif|webp)$/i,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]',
        },
      }
    ],
  },

  optimization: {
    minimize: true
  },

  performance: {
    maxEntrypointSize: 1012000,
    maxAssetSize: 1012000
  },

  plugins: [

    new webpack.DefinePlugin({
      "process.env": {
        'NODE_ENV': JSON.stringify("production"),  // development production
        'GOOGLE_LOGIN_CLIENT': JSON.stringify("687160730568-iff7uo436hvj36h61qsdenr0gng54oqn.apps.googleusercontent.com"),
        'RECAPTCHA_SITE_KEY': JSON.stringify('6Lc4_pQhAAAAAJyor5AUd3eqaFEF6EMK3Z7dQxe3')
      },
    }),

    new CompressionPlugin({
      test: /\.js(\?.*)?$/i,
      filename: "[path][base].gz"

    }),

    new webpack.ProvidePlugin({
      "React": "react",
   }),

  ],

};