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
        'GUEST_USERNAME': JSON.stringify("guest"),
        'GUEST_PASSWORD': JSON.stringify("$Guest19931506"),  // $Qu!zzland19931506  M19931506
        'GOOGLE_LOGIN_CLIENT': JSON.stringify("590155860234-tm0e6smarma5dvr7bi42v6r26v4qkdun.apps.googleusercontent.com"),
      },
    }),

    new webpack.ProvidePlugin({
      "React": "react",
   }),
   
  ],

};