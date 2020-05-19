import VueRouter from "vue-router";
import Vue from "vue";

Vue.use(VueRouter);

// 路由匹配一定要在 App.vue 里做 router-view 组件。
const routes = [
  { path: "/", redirect: "/login" },
  {
    path: "/login",
    name: "login",
    component: () => import(/* webpackChunkName: "login_home_welcome" */ "../components/Login.vue"),
  },
  {
    path: "/home",
    name: "Home",
    component: () => import(/* webpackChunkName: "login_home_welcome" */ "../components/Home.vue"),
    redirect: "/home/welcome",
    children: [
      {
        path: "/home/welcome",
        component: () =>
          import(/* webpackChunkName: "login_home_welcome" */ "../components/Welcome.vue"),
      },
      {
        path: "/users",
        component: () =>
          import(/* webpackChunkName: "users_rights_roles" */ "../components/user/Users.vue"),
      },
      {
        path: "/rights",
        component: () =>
          import(/* webpackChunkName: "users_rights_roles" */ "../components/power/Rights.vue"),
      },
      {
        path: "/roles",
        component: () =>
          import(/* webpackChunkName: "users_rights_roles" */ "../components/power/Roles.vue"),
      },
      {
        path: "/categories",
        component: () =>
          import(/* webpackChunkName: "cate_params" */ "../components/goods/Cate.vue"),
      },
      {
        path: "/params",
        component: () =>
          import(/* webpackChunkName: "cate_params" */ "../components/goods/Params.vue"),
      },
      {
        path: "/goods",
        name: "商品列表",
        component: () =>
          import(/* webpackChunkName: "goods_add" */ "../components/goods/Goods.vue"),
      },
      {
        path: "/goods/add",
        component: () => import(/* webpackChunkName: "goods_add" */ "../components/goods/Add.vue"),
      },
      {
        path: "/orders",
        component: () =>
          import(/* webpackChunkName: "order_report" */ "../components/orders/Orders.vue"),
      },
      {
        path: "/reports",
        component: () =>
          import(/* webpackChunkName: "order_report" */ "../components/report/Report.vue"),
      },
    ],
  },
];
const router = new VueRouter({
  mode: "hash",
  base: "/",
  routes,
});

//全局路由导航（让其只能在登录后才可访问其他页面）
router.beforeEach((to, from, next) => {
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
