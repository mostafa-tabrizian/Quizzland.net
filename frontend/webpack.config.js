const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: {
    App: "./src/App.js"
  },

  output: {
    path: path.resolve(__dirname, "./static/build/"),
    filename: "[name].js",
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
        exclude: /node_modules/,
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
        'ADMINUSERNAME': JSON.stringify("MostafaT19"),
        'ADMINPASSWORD': JSON.stringify("$M19931506")  // $Qu!zzland19931506  M19931506
      },
    }),

    new webpack.ProvidePlugin({
      "React": "react",
   }),
   
  ],

};