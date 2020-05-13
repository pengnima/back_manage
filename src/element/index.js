import { Button, Form, FormItem, Input } from "element-ui";

const element = {
  install(Vue) {
    Vue.use(Button);
    Vue.use(Form);
    Vue.use(FormItem);
    Vue.use(Input);
  },
};

export default element;
