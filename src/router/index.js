import VueRouter from "vue-router";
import Vue from "vue";
import { Message } from "element-ui";

Vue.use(VueRouter);

// 路由匹配一定要在 App.vue 里做 router-view 组件。

const Login = () => import(/* webpackChunkName: "login_home_welcome" */ "../components/Login.vue");
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ "../components/Home.vue");
const HomeWelcome = () =>
  import(/* webpackChunkName: "login_home_welcome" */ "../components/Welcome.vue");
const Users = () =>
  import(/* webpackChunkName: "users_rights_roles" */ "../components/user/Users.vue");
const Rights = () =>
  import(/* webpackChunkName: "users_rights_roles" */ "../components/power/Rights.vue");
const Roles = () =>
  import(/* webpackChunkName: "users_rights_roles" */ "../components/power/Roles.vue");
const Cate = () => import(/* webpackChunkName: "cate_params" */ "../components/goods/Cate.vue");
const Params = () => import(/* webpackChunkName: "cate_params" */ "../components/goods/Params.vue");
const Goods = () => import(/* webpackChunkName: "goods_add" */ "../components/goods/Goods.vue");
const Add = () => import(/* webpackChunkName: "goods_add" */ "../components/goods/Add.vue");
const Order = () =>
  import(/* webpackChunkName: "order_report" */ "../components/orders/Orders.vue");
const Report = () =>
  import(/* webpackChunkName: "order_report" */ "../components/report/Report.vue");
const routes = [
  { path: "/", redirect: "/login" },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
    redirect: "/home/welcome",
    children: [
      {
        path: "/home/welcome",
        component: HomeWelcome,
      },
      {
        path: "/users",
        component: Users,
      },
      {
        path: "/rights",
        component: Rights,
      },
      {
        path: "/roles",
        component: Roles,
      },
      {
        path: "/categories",
        component: Cate,
      },
      {
        path: "/params",
        component: Params,
      },
      {
        path: "/goods",
        name: "商品列表",
        component: Goods,
      },
      {
        path: "/goods/add",
        component: Add,
      },
      {
        path: "/orders",
        component: Order,
      },
      {
        path: "/reports",
        component: Report,
      },
    ],
  },
];

const router = new VueRouter({
  mode: "history",
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
    Message.error("请先进行登录~");
    tempVue = null;
    next("/login");
  }
  //4. 有token
  next();
});

export default router;
