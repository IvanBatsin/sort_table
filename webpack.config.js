const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const WebpackCopyPlugin = require('copy-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';

const setName = (ext) => !isDev ? `[name].[contenthash].${ext}` : `[name].${ext}`;

const setPlugins = () => {
  const plugins = [ 
    new HtmlWebpackPlugin({
    minify: !isDev,
    title: 'Test',
    template: './index.html'
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: setName('css')
    }),
    new WebpackCopyPlugin({
      patterns: [
        {
          from: path.join(__dirname, 'src', 'assets'),
          to: path.join(__dirname, 'dist', 'assets')
        }
      ]
    })
  ];

  if (!isDev) {
    plugins.push(
      new OptimizeCssAssetsPlugin({
        cssProcessor: require('cssnano')
      })
    )
  }

  return plugins;
}

module.exports = {
  mode: 'development',
  context: path.join(__dirname, 'src'),
  entry: './app.ts',
  output: {
    filename: setName('js'),
    path: path.join(__dirname, 'dist')
  },
  devtool: isDev ? 'source-map' : false,
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@': path.join(__dirname, 'src')
    }
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    },
    minimize: !isDev,

  },
  devServer: {
    port: 3000,
    open: 'Google Chrome',
    compress: true,
    liveReload: true,
    contentBase: path.join(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: 'ts-loader'
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.(png|jpeg|jpg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
        }
      },
      // {
      //   test: /\.svg$/,
      //   loader: 'svg-inline-loader'
      // },
      // {
      //   test: /\.html$/,
      //   loader: 'html-loader'
      // }
    ]
  },
  plugins: setPlugins()
};