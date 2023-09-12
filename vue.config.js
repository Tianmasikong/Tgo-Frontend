module.exports = {
  devServer: {
    open: true,
    host: 'localhost',
    port: 8083,
    //这里的ip和端口是前端项目的;下面为需要跨域访问后端项目
    proxy: {
      '/api': {
        target: 'http://localhost:8082',//这里填入你要请求的接口的前缀
        ws:true,//代理websocked
        changeOrigin:true,//虚拟的站点需要更管origin
        pathRewrite:{
          '^/api':''//重写路径
        }
      },
      '/cloudMusic': {
        target: 'http://118.89.92.59:3000',//这里填入你要请求的接口的前缀
        ws:true,//代理websocked
        changeOrigin:true,//虚拟的站点需要更管origin
        pathRewrite:{
          '^/cloudMusic':''//重写路径
        }
      }
    }
  }
}