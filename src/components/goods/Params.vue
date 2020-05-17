<template>
  <div class="goods_params">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card>
      <!-- Tips -->
      <el-alert :closable="false" title="注意：只允许为第三分类设置相关参数" type="warning" show-icon></el-alert>
      <!-- 商品分类选择 -->
      <el-row class="cat_omt">
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            v-model="selectCate"
            :options="cateList"
            :props="{ expandTrigger: 'hover' ,value:'cat_id',label:'cat_name'}"
            @change="handleSelectCate"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- 参数 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-row>
            <el-button type="primary" :disabled="isSelectDisabled">添加参数</el-button>
          </el-row>
          <el-table class="cat_omt" :data="tableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template #default="val">
                <el-tag v-for="tag in val.row.attr_vals" :key="tag" closable>{{tag}}</el-tag>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作" width="250">
              <el-button type="primary" icon="el-icon-edit">编辑</el-button>
              <el-button type="danger" icon="el-icon-delete">删除</el-button>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-row>
            <el-button type="primary" :disabled="isSelectDisabled">添加属性</el-button>
          </el-row>
          <el-table class="cat_omt" :data="tableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template #default="val">
                <el-tag v-for="tag in val.row.attr_vals" :key="tag" closable>{{tag}}</el-tag>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作" width="250">
              <el-button type="primary" icon="el-icon-edit">编辑</el-button>
              <el-button type="danger" icon="el-icon-delete">删除</el-button>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import { request } from "@/request/index.js";
export default {
  created() {
    this.getCateList();
  },
  data() {
    return {
      cateList: [],
      selectCate: [], //选择的那个三级分类数组
      activeName: "many", //默认为动态属性
      tableData: []
    };
  },
  methods: {
    async getCateList() {
      let { data: res } = await request({
        url: "categories"
      });

      if (res.meta.status != 200) {
        return this.$message.error("请求数据失败。");
      }

      this.cateList = res.data;
      console.log(this.cateList);
    },
    //获取参数
    async getAttributes() {
      if (this.isSelectDisabled) {
        return this.$message.error("请选择第三级的分类");
      }
      let { data: res } = await request({
        url: `categories/${this.cateId}/attributes`,
        params: {
          sel: this.activeName
        }
      });

      if (res.meta.status != 200) {
        return this.$message.error("请求数据失败。");
      }

      console.log(res.data);
      this.tableData = res.data;
      this.tableData.forEach(v => {
        v.attr_vals = v.attr_vals ? v.attr_vals.split(" ") : [];
      });
    },
    // 选择了分类触发
    handleSelectCate() {
      if (this.isSelectDisabled) {
        this.selectCate = [];
        this.tableData = [];
        return this.$message.error("请选择第三级的分类");
      }

      this.getAttributes();
    },
    //选择了 tab 触发
    handleTabClick() {
      this.getAttributes();
    }
  },
  computed: {
    isSelectDisabled() {
      return this.selectCate.length != 3;
    },
    cateId() {
      return this.selectCate.length == 3 ? this.selectCate[2] : null;
    }
  }
};
</script>

<style lang="scss" scoped>
.el-tag {
  margin: 8px;
}
</style>