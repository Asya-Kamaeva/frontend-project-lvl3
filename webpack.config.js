// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isProduction = process.env.NODE_ENV === 'production';

const config = {
  // watch: true,
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
  },
  devServer: {
    contentBase: path.join(__dirname, './src'),
    open: true,
    host: 'localhost',
    port: 8000,
    // historyApiFallback: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      // template: path.resolve(__dirname, 'index.html'),
    }),
    new CleanWebpackPlugin({
      cleanAfterEveryBuildPatterns: './dist/*.*',
    }),
    // new MiniCssExtractPlugin({
    //   filename: 'style.css',
    // }),
  ],
  module: {
    rules: [
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: 'asset',
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['css-loader', 'sass-loader'],
      },
    ],
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = 'production';

    // config.plugins.push(new WorkboxWebpackPlugin.GenerateSW());
  } else {
    config.mode = 'development';
  }
  return config;
};
