const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  devtool: process.env.NODE_ENV === 'production' ? false : 'cheap-module-source-map',

  entry: {
    content: './src/content/index.ts',
    background: './src/background/index.ts',
    offscreen: './src/offscreen/index.ts',
    popup: './src/popup/index.ts',
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    clean: true,
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      react: 'preact/compat',
      'react-dom': 'preact/compat',
    },
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },

  plugins: [
    new MiniCssExtractPlugin({ filename: '[name].css' }),
    new CopyPlugin({
      patterns: [
        { from: 'public', to: '.' },
        {
          from: 'node_modules/@huggingface/transformers/dist/ort-wasm-simd-threaded.jsep.wasm',
          to: 'wasm/ort-wasm-simd-threaded.jsep.wasm',
        },
        {
          from: 'node_modules/@huggingface/transformers/dist/ort-wasm-simd-threaded.jsep.mjs',
          to: 'wasm/ort-wasm-simd-threaded.jsep.mjs',
        },
      ],
    }),
  ],

  optimization: {
    splitChunks: false,
  },

  experiments: {
    asyncWebAssembly: true,
  },
};
