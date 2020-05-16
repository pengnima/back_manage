<template>
  <div class="home_rights">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card>
      <el-table :data="rightsList" style="width: 100%" stripe border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column label="权限等级">
          <template #default="val">
            <el-tag v-if="val.row.level=='0'">一级</el-tag>
            <el-tag v-else-if="val.row.level=='1'" type="success">二级</el-tag>
            <el-tag v-else-if="val.row.level=='2'" type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { request } from "@/request/index.js";
export default {
  created() {
    this.getRightList();
  },
  data() {
    return {
      // 权限列表
      rightsList: []
    };
  },
  methods: {
    async getRightList() {
      let { data: res } = await request({
        url: "rights/list"
      });
      console.log(res);
      if (res.meta.status != 200) return this.$message.error("数据请求失败");

      this.rightsList = res.data;
    }
  }
};
</script>

<style lang="scss" scoped>
</style>