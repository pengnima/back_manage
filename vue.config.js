// 做跨域
module.exports = {
  devServer: {
    proxy: {
      // /api表示，前台发送请求时，请求的路径为 /api 开头的URL。 例如： /api/upload
      // 然后就会进入这里，把  target 的路径 与 /api/upload，前后拼接。但由于
      // pathRewrite 重写路径，最终的路径为 target的路径
      "/api": {
        target: "http://127.0.0.1:8888/api/private/v1",
        changeOrigin: true,
        pathRewrite: {
          "^/api": "",
        },
      },
    },
  },
};
