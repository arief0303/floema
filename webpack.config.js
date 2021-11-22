const path = require('path')
const webpack = require('webpack')

const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

const IS_DEVELOPMENT = process.env.NODE_ENV === 'dev'

const dirApp = path.join(__dirname, 'app')
const dirAssets = path.join(__dirname, 'assets')
const dirShared = path.join(__dirname, 'shared')
const dirStyles = path.join(__dirname, 'styles')
const dirNode = 'node_modules'

// test dir
console.log(dirApp, dirAssets, dirShared, dirStyles)

module.exports = {
  stats: 'summary',

  entry: [
    path.join(dirApp, 'index.js'),
    path.join(dirStyles, 'index.scss')
  ],

  resolve: {
    modules: [
      dirApp,
      dirAssets,
      dirShared,
      dirStyles,
      dirNode
    ]
  },

  plugins: [
    new webpack.DefinePlugin({ IS_DEVELOPMENT }),

    new CopyPlugin({
      patterns: [
        {
          from: './shared',
          to: ''
        }
      ]
    }),

    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    }),

    new ImageMinimizerPlugin({
      minimizerOptions: {
        // Lossless optimization with custom option
        // Feel free to experiment with options for better result for you
        plugins: [
          ["gifsicle", { interlaced: true }],
          ["jpegtran", { progressive: true }],
          ["optipng", { optimizationLevel: 5 }],
        ],
      },
    }),

    new CleanWebpackPlugin()
  ],

  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
        }
      },

      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '',
            },
          },

          {
            loader: 'css-loader',
          },

          {
            loader: 'postcss-loader',
          },

          {
            loader: 'sass-loader',
          }

        ]
      },

      {
        test: /\.(png|jpg|gif|jpe?g|svg|woff2?|fnt|webp|mp4)$/,
        loader: 'file-loader',
        options: {
          outputPath: 'assets',
          name(file) {
            return '[name].[ext]'
          }
        }
      },

      {
        test: /\.(jpe?g|png|gif|svg|webp)$/i,
        use: [{ loader: ImageMinimizerPlugin.loader, }]
      },

      {
        test: /\.(glsl|frag|vert)$/,
        loader: 'raw-loader',
        exclude: /node_modules/
      },

      {
        test: /\.(glsl|frag|vert)$/,
        loader: 'glslify-loader',
        exclude: /node_modules/
      }
    ]
  }
};