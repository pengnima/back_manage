<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像位置 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="头像" />
      </div>
      <!-- 表单位置 :model="loginForm" 是父传子给form，为了验证数据 -->
      <el-form ref="loginFromRef" :model="loginForm" :rules="loginRules" class="login_form">
        <!-- 账号 -->
        <el-form-item prop="userValue">
          <el-input v-model="loginForm.userValue" prefix-icon="iconfont iconicon_people_fill"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="pwdValue">
          <el-input v-model="loginForm.pwdValue" prefix-icon="iconfont iconlock" type="password"></el-input>
        </el-form-item>
        <!-- 登录，重置 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="loginClick">登录</el-button>
          <el-button type="info" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { request } from "../request/index.js";
export default {
  created() {},
  data() {
    return {
      loginForm: {
        userValue: "",
        pwdValue: ""
      },
      loginRules: {
        userValue: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 6, message: "长度在 3 到 6 个字符", trigger: "blur" }
        ],
        pwdValue: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 9, message: "长度在 6 到 9 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    resetForm() {
      this.$refs.loginFromRef.resetFields();
    },
    loginClick() {
      //登录前先对表单进行 预验证，通过则回调返回 true
      this.$refs.loginFromRef.validate(async valid => {
        if (!valid) return;

        // 解构赋值，后面的表示 前台所用的变量res
        let { data: res } = await request({
          url: "login",
          method: "POST",
          data: {
            username: this.loginForm.userValue,
            password: this.loginForm.pwdValue
          }
        });

        // console.log(res);
        if (res.meta.status != 200) {
          //$message 是直接挂载在原型上的，有点类似插件element文件夹里放着
          return this.$message.error("登录失败");
        }
        /**
         * 登录成功，token保存在客户端的sessionStorage中，
         *  1. 项目中除了 登录外 的其他API接口，必须在登录之后才能访问
         *  2. token保存在sessionStorage中
         * 通过编程式导航 $router 跳转到后台主页，/home
         */

        this.$message.success("登录成功");

        console.log(res.data);
        window.sessionStorage.setItem("token", res.data.token);

        this.$router.push("/home");
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 4px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.avatar_box {
  width: 150px;
  height: 150px;
  position: absolute;

  left: 50%;
  transform: translate(-50%, -50%);

  border-radius: 50%;

  border: 1px solid #fff;
  padding: 10px; /* padding和背景颜色加起来 也可以用来做类似边框的感觉 */
  background-color: #fff;
  box-shadow: 0 0 10px #ddd;

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
