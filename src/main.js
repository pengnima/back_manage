import Vue from "vue";
import App from "./App.vue";
import router from "./router/index.js";

Vue.config.productionTip = false;

console.log(process.env.BASE_URL);

new Vue({
  render: h => h(App),
  router,
}).$mount("#app");
