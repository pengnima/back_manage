<template>
  <div class="home_container">
    <el-button type="info" @click="logoutClick">退出</el-button>
  </div>
</template>

<script>
export default {
  methods: {
    logoutClick() {
      window.sessionStorage.removeItem("token");
      this.$router.push("/");
    },
  },
};
</script>

<style></style>
