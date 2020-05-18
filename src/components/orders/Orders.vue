<template>
  <div class="orders">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card>
      <el-row>
        <el-col :span="6">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getOrdersList()"
          >
            <el-button slot="append" icon="el-icon-search" @click="getOrdersList()"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <el-table :data="OrdersList" border stripe class="el-card">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="订单编号" prop="order_number" width="400"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template #default="val">
            <el-tag v-if="val.row.pay_status=='0'" type="danger">未付款</el-tag>
            <el-tag v-else type="success">已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="update_time" width="200">
          <template #default="val">{{val.row.update_time |formatDate}}</template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template>
            <!-- 修改 -->
            <el-button size="mini" type="primary" icon="el-icon-edit"></el-button>
            <!-- 分配 -->
            <el-button size="mini" type="warning" icon="el-icon-s-tools"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        class="el-card"
        background
        layout="total,sizes,prev, pager, next,jumper"
        :page-size="queryInfo.pagesize"
        :page-sizes="[10,20,30,50]"
        :total="total"
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
    this.getOrdersList();
  },
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
        user_id: "",
        pay_status: "",
        is_send: "",
        order_fapiao_title: [],
        order_fapiao_company: "",
        order_fapiao_content: "",
        consignee_addr: ""
      },
      // 订单列表
      OrdersList: [],
      // 订单总数
      total: 0
    };
  },
  methods: {
    async getOrdersList() {
      let { data: res } = await request({
        url: "orders",
        params: this.queryInfo
      });

      if (res.meta.status != 200) {
        return this.$message.error("请求数据失败");
      }

      this.OrdersList = res.data.goods;
      this.total = res.data.total;
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getOrdersList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getOrdersList();
    }
  }
};
</script>

<style lang="scss" scoped>
</style>