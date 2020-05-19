// 做跨域
module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "/dist/" : "/",
  /* 输出文件目录：在npm run build时，生成文件的目录名称 */
  outputDir: "dist",
  chainWebpack: config => {
    // config.plugins.delete("prefetch");
    // 当 环境为 生成模式
    config.when(process.env.NODE_ENV === "production", config => {
      config
        .entry("app") // 获取默认的打包入口
        .clear() //清空打包入口
        .add("./src/main-prod.js"); //添加 自定义的打包文件入口

      config.set("externals", {
        vue: "Vue",
        "vue-router": "VueRouter",
        axios: "axios",
        echarts: "echarts",
      });

      //为html新增自定义属性
      config.plugin("html").tap(args => {
        args[0].isProd = true;
        return args;
      });
    });

    config.when(process.env.NODE_ENV === "development", config => {
      config
        .entry("app")
        .clear()
        .add("./src/main-dev.js");

      config.plugin("html").tap(args => {
        args[0].isProd = false;
        return args;
      });
    });
  },
  devServer: {
    proxy: {
      // /api表示，前台发送请求时，请求的路径为 /api 开头的URL。 例如： /api/upload
      // 然后就会进入这里，把  target 的路径 与 /api/upload，前后拼接。但由于
      // pathRewrite 重写路径，最终的路径为 target的路径
      "/api": {
        // target: "http://127.0.0.1:8888/api/private/v1/",
        target: "https://www.liulongbin.top:8888/api/private/v1/",
        changeOrigin: true,
        pathRewrite: {
          "^/api": "",
        },
      },
    },
  },
};
