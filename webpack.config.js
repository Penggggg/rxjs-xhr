const path = require('path');
const webpack = require('webpack');

const DEBUG = process.env.NODE_ENV !== 'production';

const plugins = [
  /** 提取公共文件 */
  new webpack.optimize.CommonsChunkPlugin({
    name: [ 'app', 'vendor' ]
  }),  

];
if (DEBUG) {


  /** 定义环境变量 */
  plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify("develop")
      }
    })
  );
} else {


  /** 压缩 js */
  // plugins.push(
  //   new webpack.optimize.UglifyJsPlugin({
  //     output: {
  //       comments: false
  //     },
  //     compress: {
  //       warnings: false
  //     }
  //   })
  // );

  /** 定义环境变量 */
  plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
  );
  
  /** 添加全局引入 */
  plugins.push(
    new webpack.ProvidePlugin({
      React: 'react'
    })
  )
}

module.exports = {
  entry: {
    index: ['./test.ts']
  },

  output: {
    filename: '[name].js',
  },

  resolve: {
    extensions: [".ts", ".tsx", ".js", '.less'],
  },

  module: {
    rules: [
      {
        test: /\.ts/,
        use: ['ts-loader']
      }
    ]
  },



};
