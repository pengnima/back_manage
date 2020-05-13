import VueRouter from "vue-router";
import Vue from "vue";

Vue.use(VueRouter);

// 路由匹配一定要在 App.vue 里做 router-view 组件。
const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", name: "login", component: () => import("../components/Login.vue") },
  { path: "/home", name: "Home", component: () => import("../components/Home.vue") },
];
const router = new VueRouter({
  mode: "history",
  base: "/",
  routes,
});

//全局路由导航（让其只能在登录后才可访问其他页面）
router.beforeEach((to, from, next) => {
  console.log(from, "我是全局");

  //1. 用户要去 登录界面 就放行
  if (to.path == "/login") {
    return next();
  }

  //2. 用户要去 其他界面，先检测token
  const token = window.sessionStorage.getItem("token");
  //3. 无token
  if (!token) {
    console.log("请先登录");
    let tempVue = new Vue();
    tempVue.$message.error("请先进行登录~");
    tempVue = null;
    next("/login");
  }
  //4. 有token
  next();
});

export default router;
