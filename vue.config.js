const CompressionWebpackPlugin = require('compression-webpack-plugin')

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/app/' : '/',
  devServer: {
    proxy: {
      '^/service': {
        target: 'ws://localhost:6300',
        ws: true
      },
      '^/site/': {
        target: 'http://localhost:6300'
      }
    }
  },
  configureWebpack: {
    plugins: [
      new CompressionWebpackPlugin({
        filename: '[path].gz[query]',
        algorithm: 'gzip',
        test: new RegExp('\\.(js|css|map|woff2?|eot|ttf)$'),
        threshold: 10240,
        minRatio: 0.8
      })
    ]
  }
}
