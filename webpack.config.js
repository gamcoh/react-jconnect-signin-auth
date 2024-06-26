const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const htmlWebpackPlugin = new HtmlWebpackPlugin({
  template: path.join(__dirname, 'demo/src/index.html'),
  filename: './index.html',
});

module.exports = {
  entry: path.join(__dirname, 'demo/src/index.js'),
  output: {
    path: path.join(__dirname, 'demo/dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|webp|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [htmlWebpackPlugin],
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  devServer: {
    port: 3002,
    disableHostCheck: true,
    allowedHosts: ['osef.com'],
  },
};
