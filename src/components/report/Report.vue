<template>
  <div class="report">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <div ref="echarts" class="echarts"></div>
    </el-card>
  </div>
</template>

<script>
import Echarts from "echarts";
import { request } from "../../request/index.js";
export default {
  created() {},
  async mounted() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = Echarts.init(this.$refs.echarts);

    this.reportData = await this.getReportList();

    console.log(this.reportData);
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(this.reportData);
  },
  data() {
    return {
      reportData: {}
    };
  },
  methods: {
    getReportList() {
      return new Promise(async (resolve, reject) => {
        let { data: res } = await request({
          url: "/reports/type/1"
        });

        if (res.meta.status != 200) {
          this.$message.error("请求失败");
          reject();
        }

        resolve(res.data);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.echarts {
  width: 60%;
  height: 600px;
}
</style>