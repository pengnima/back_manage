import Vue from "vue";
import App from "./App.vue";
import router from "./router/index.js";

import element from "./element/index.js";

import "./assets/css/global.css";
import "./assets/css/iconfont.css";
// import "element-ui/lib/theme-chalk/index.css";

Vue.use(element);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
  router,
}).$mount("#app");
