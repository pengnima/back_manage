import {
  Button,
  Form,
  FormItem,
  Input,
  Message,
  MessageBox,
  Container,
  Header,
  Main,
  Aside,
  Col,
  Menu,
  Submenu,
  MenuItemGroup,
  MenuItem,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Row,
  Table,
  TableColumn,
  Switch,
  Tooltip,
  Pagination,
  Dialog,
} from "element-ui";

const element = {
  install(Vue) {
    Vue.use(Button);
    Vue.use(Form);
    Vue.use(FormItem);
    Vue.use(Input);
    Vue.use(Container);
    Vue.use(Header);
    Vue.use(Main);
    Vue.use(Aside);

    Vue.use(Row);
    Vue.use(Col);
    Vue.use(Menu);
    Vue.use(MenuItemGroup);
    Vue.use(MenuItem);
    Vue.use(Submenu);
    Vue.use(Breadcrumb);
    Vue.use(BreadcrumbItem);
    Vue.use(Card);
    Vue.use(Table);
    Vue.use(TableColumn);
    Vue.use(Switch);
    Vue.use(Tooltip);
    Vue.use(Pagination);
    Vue.use(Dialog);
    Vue.prototype.$message = Message;
    Vue.prototype.$confirm = MessageBox.confirm;
  },
};

export default element;
