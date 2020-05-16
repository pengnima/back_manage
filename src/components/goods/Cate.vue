<template>
  <div class="goods_cate">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <el-row>
        <el-button type="primary" @click="handleAddCate">添加分类</el-button>
      </el-row>
      <el-row>
        <el-table
          :data="cateList"
          style="width: 100%;margin-bottom: 20px;"
          row-key="cat_id"
          border
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        >
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column prop="cat_name" label="分类名称"></el-table-column>
          <el-table-column prop="cat_deleted" label="是否有效">
            <template #default="val">
              <i v-if="val.row.cat_deleted" style="color:orange;" class="el-icon-error"></i>
              <i v-else style="color:#2fa;" class="el-icon-success"></i>
            </template>
          </el-table-column>
          <el-table-column prop="cat_level" label="等级">
            <template #default="val">
              <el-tag v-if="val.row.cat_level==0" size="mini">一级</el-tag>
              <el-tag v-else-if="val.row.cat_level==1" size="mini" type="success">二级</el-tag>
              <el-tag v-else type="warning" size="mini">三级</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="250">
            <el-button type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete">删除</el-button>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row>
        <el-pagination
          background
          :page-size="queryInfo.pagesize"
          :page-sizes="[5,10,15,20]"
          layout="total,sizes,prev, pager, next,jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </el-row>
    </el-card>

    <!-- 添加分类 对话框 -->
    <el-dialog title="添加分类" :visible.sync="addCateDialog" @close="handleCateDialogClose">
      <el-form :model="cateForm" :rules="rules">
        <el-form-item label="分类名称：" prop="cat_name" label-width="120px">
          <el-input v-model="cateForm.cat_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：" label-width="120px">
          <el-cascader
            style="width:50%"
            clearable
            v-model="selectKeys"
            :options="parentList"
            :props="{ expandTrigger: 'hover' ,label:'cat_name',value:'cat_id',checkStrictly:true}"
            @change="handleSelectChange"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addCateDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleAddCateChecked">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { request } from "@/request/index.js";
export default {
  created() {
    this.getCates();
  },
  data() {
    return {
      // 查询分类时的参数
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 商品分类的数据列表
      cateList: [],
      parentList: [],
      // 总商品数
      total: 0,
      // 添加分类对话框
      addCateDialog: false,
      //选中的分类id
      selectKeys: [],
      // 添加分类 表单
      cateForm: {
        cat_pid: 0, //父级分类
        cat_name: "", //分类名称
        cat_level: 0 //分类等级
      },
      // 表单验证规则
      rules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
          { min: 1, max: 9, message: "长度在 1 到 9 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    async getCates() {
      let { data: res } = await request({
        url: "categories",
        params: this.queryInfo
      });

      if (res.meta.status != 200) {
        return this.$message.error("请求数据失败。");
      }

      res = res.data;
      this.cateList = res.result;
      this.total = res.total;
    },

    // 分页条数 改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getCates();
    },
    // 切换 页面
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getCates();
    },
    handleAddCate() {
      this.addCateDialog = true;
      this.getParentCateList();
    },
    //提交 添加分类
    async handleAddCateChecked() {
      let { data: res } = await request({
        url: "categories",
        method: "post",
        data: this.cateForm
      });

      if (res.meta.status != 201) {
        return this.$message.error("请求数据失败。");
      }

      this.getCates();
      this.$message.success("修改成功~");
      this.addCateDialog = false;
    },
    //获取分类相关
    async getParentCateList() {
      if (this.parentList.length == 0) {
        let { data: res } = await request({
          url: "categories",
          method: "get",
          params: {
            type: 2
          }
        });
        if (res.meta.status != 200) {
          return this.$message.error("请求数据失败。");
        }

        this.parentList = res.data;
      }
    },

    //修改了 联级选择器之后触发
    handleSelectChange() {
      let keys = this.selectKeys;
      if (keys.length > 0) {
        this.cateForm.cat_pid = keys[keys.length - 1];
        this.cateForm.cat_level = keys.length;
      } else {
        this.cateForm.cat_pid = 0;
        this.cateForm.cat_level = 0;
      }
    },
    // 对话框关闭触发
    handleCateDialogClose() {
      this.cateForm.cat_name = "";
      this.cateForm.cat_pid = 0;
      this.cateForm.cat_level = 0;
      this.selectKeys = [];
    }
  }
};
</script>

<style lang="scss" scoped>
.el-table {
  margin-top: 20px;
}
</style>