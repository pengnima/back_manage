import Vue from "vue";
import App from "./App.vue";
import router from "./router/index.js";

import element from "./element/index.js";
import "./assets/css/global.css";
import "./assets/css/iconfont.css";

//导入和注册富文本编辑器
import VueQuillEditor from "vue-quill-editor";
import "quill/dist/quill.core.css"; // import styles
import "quill/dist/quill.snow.css"; // for snow theme
import "quill/dist/quill.bubble.css"; // for bubble theme
Vue.use(VueQuillEditor /* { default global options } */);

Vue.use(element);

Vue.config.productionTip = false;

Vue.filter("formatDate", val => {
  val *= 1000;
  let date = new Date(val);

  return date.toLocaleDateString() + date.toLocaleTimeString();
});

new Vue({
  render: h => h(App),
  router,
}).$mount("#app");
