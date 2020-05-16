<template>
  <el-container class="home_container">
    <el-header>
      <div>
        <img src="https://gitee.com/pengnima1/blogimage/raw/master/md/duck.jpg" alt="鸭子" />
        <span>后台管理系统</span>
      </div>
      <el-button type="info" @click="logoutClick">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :style="{width:isCollapse?'66px':'300px'}">
        <div class="coll_btn" @click="handleCollapse">|||</div>
        <!-- 侧边栏菜单开始~ -->
        <el-col>
          <!-- 根菜单设置 -->
          <el-menu
            background-color="#333744"
            text-color="#fff"
            :unique-opened="true"
            :default-active="$route.path"
            :collapse="isCollapse"
            :collapse-transition="false"
            router
          >
            <!-- 设置下拉菜单，具名slot是菜单的名字 -->
            <el-submenu :index="item.order +''" v-for="(item) in menuList" :key="item.id">
              <template slot="title">
                <i :class="['icon',iconsObj[item.id]]"></i>
                <span>{{item.authName}}</span>
              </template>
              <!-- menu开启了路由，那么会以 menu-item的index作为跳转路径 -->
              <el-menu-item
                v-for="(item2) in item.children"
                :key="item2.id"
                :index="'/'+item2.path"
              >
                <i class="el-icon-menu"></i>
                {{item2.authName}}
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-col>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { request } from "../request/index.js";
export default {
  created() {
    //获取左侧aside的菜单列表
    this.getMenuList();
  },
  data() {
    return {
      menuList: [],
      iconsObj: {
        "125": "el-icon-s-check",
        "103": "el-icon-s-flag",
        "101": "el-icon-s-goods",
        "102": "el-icon-s-order",
        "145": "el-icon-s-marketing"
      },
      isCollapse: false,
      activeURL: ""
    };
  },
  methods: {
    logoutClick() {
      window.sessionStorage.removeItem("token");
      this.$router.push("/");
    },
    async getMenuList() {
      let { data: res } = await request({
        url: "menus"
      });
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);

      this.menuList = res.data;
    },
    handleCollapse() {
      this.isCollapse = !this.isCollapse;
    }
  }
};
</script>

<style lang="scss" scoped>
.home_container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0;

  div {
    height: 100%;
    display: flex;
    align-items: center;

    img {
      height: 100%;
      border-radius: 0 50% 0 50%;
    }
    span {
      color: #fff;
      font-size: 26px;
    }
  }
}

.coll_btn {
  width: 100%;
  height: 30px;
  background-color: #4a5064;

  cursor: pointer;
  color: #fff;
  letter-spacing: 4px;

  text-align: center;
  line-height: 30px;
}

.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}

.icon {
  margin-right: 10px;
  font-size: 18px;
}
</style>
