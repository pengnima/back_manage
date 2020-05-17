module.exports = {
  devServer: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8888",
        changeOrigin: true,
        pathRewrite: {
          "^/api": "/api/private/v1/upload",
        },
      },
    },
  },
};
