module.exports = {
  publicPath: './',
  devServer: {
    port: 8080,
    disableHostCheck: true,
    // allowedHosts: ['*'],
    host: 'chengjian.com',
    // host: '192.168.150.73',
    proxy: {
      '/zzscjdagl': {
        target: 'http://123.160.223.35:8081',
        changeOrigin: true
      }
    }
  }
}
