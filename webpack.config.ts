import AwsSamPlugin from 'aws-sam-webpack-plugin';
import { Configuration } from 'webpack';
import { resolve } from 'path';

const awsSamPlugin = new AwsSamPlugin();

const config: Configuration = {
  entry: () => awsSamPlugin.entry(),
  target: 'node',
  devtool: 'source-map',
  externals: process.env.NODE_ENV === 'development' ? [] : ['aws-sdk'],
  output: {
    filename: chunkData => awsSamPlugin.filename(chunkData),
    libraryTarget: 'commonjs2',
    path: resolve('.'),
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [{ test: /\.tsx?$/, loader: 'ts-loader' }],
  },
  plugins: [awsSamPlugin],
  mode: process.env.NODE_ENV !== 'production' ? 'development' : 'production',
  optimization: {
    minimize: false,
  },
};

export default config;
