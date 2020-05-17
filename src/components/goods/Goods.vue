<template>
  <div class="goods">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>{{$route.name}}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList()">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="$router.push('/goods/add')">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table class="cat_omt" :data="goodsList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="900"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="120"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
        <el-table-column prop="upd_time" label="创建时间" width="200">
          <template #default="val">{{val.row.upd_time |formatDate}}</template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template>
            <!-- 修改 -->
            <el-button size="mini" type="primary" icon="el-icon-edit"></el-button>
            <!-- 删除 -->
            <el-button size="mini" type="danger" icon="el-icon-delete"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="cat_omt"
        ref="paginationRef"
        background
        layout="total,sizes,prev, pager, next,jumper"
        :total="total"
        :page-sizes="[10,20,30,50]"
        :page-size.sync="queryInfo.pagesize"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
import { request } from "../../request";
export default {
  created() {
    this.getGoodsList();
  },
  data() {
    return {
      //总数
      total: 0,
      //商品列表
      goodsList: [],
      //搜索的内容
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10
      }
    };
  },
  methods: {
    async getGoodsList() {
      let { data: res } = await request({
        url: "goods",
        params: this.queryInfo
      });

      if (res.meta.status != 200) {
        return this.$message.error("获取商品列表失败");
      }

      this.total = res.data.total;
      this.goodsList = res.data.goods;
    },

    // 每页显示条数改变 触发
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getGoodsList();
    },
    // 当前页改变 触发
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getGoodsList();
    }
  }
};
</script>

<style>
</style>