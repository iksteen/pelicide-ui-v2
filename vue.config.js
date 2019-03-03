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
  }
}
