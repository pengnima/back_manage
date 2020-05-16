<template>
  <div class="home_roles">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card>
      <template #header>
        <el-button type="primary">添加角色</el-button>
      </template>
      <el-table :data="rolesList" style="width: 100%" stripe border>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template #default="val">
            <!-- 一级权限 -->
            <el-row
              :class="['bb_line',i ==0?'bt_line':'','mid']"
              v-for="(item,i) in val.row.children"
              :key="item.id"
            >
              <el-col :span="6">
                <el-tag closable @close="handleCloseTag(val.row,item.id)">{{item.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级权限 -->
              <el-col :span="18">
                <el-row
                  :class="[i2<item.children.length-1?'bb_line':'','mid']"
                  v-for="(item2,i2) in item.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      closable
                      type="success"
                      @close="handleCloseTag(val.row,item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      v-for="(item3) in item2.children"
                      :key="item3.id"
                      closable
                      type="warning"
                      @close="handleCloseTag(val.row,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="350">
          <template #default="val">
            <!-- 变基 -->
            <el-button size="medium" type="primary" icon="el-icon-edit">编辑</el-button>
            <!-- 删除 -->
            <el-button size="medium" type="danger" icon="el-icon-delete">删除</el-button>
            <!-- 分配 -->
            <el-button
              @click="showDistriDia(val.row)"
              size="medium"
              type="warning"
              icon="el-icon-s-tools"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog @close="checkedKeys=[];" title="分配权限" :visible.sync="distriDialog" width="30%">
      <div style="width:100%;height:400px;overflow:auto;">
        <!-- node-key="id" 为每项 关联一个唯一标识的属性 -->
        <el-tree
          ref="treeRef"
          node-key="id"
          :data="rightList"
          :props="defaultProps"
          show-checkbox
          default-expand-all
          :default-checked-keys="checkedKeys"
        ></el-tree>
      </div>
      <template #footer>
        <el-button @click="distriDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleRoleAuth">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { request } from "../../request";
export default {
  created() {
    this.getRoleList();
  },
  data() {
    return {
      rolesList: [],
      distriDialog: false,
      rightList: [],
      defaultProps: {
        children: "children",
        label: "authName"
      },
      checkedKeys: [],
      roleId: 0
    };
  },
  methods: {
    async getRoleList() {
      let { data: res } = await request({
        url: "roles"
      });

      if (res.meta.status != 200) return this.$message.error("获取数据失败");

      this.rolesList = res.data;
    },
    // 删除权限
    handleCloseTag(role, rightid) {
      this.$confirm("此操作将永久删除该权限, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let { data: res } = await request({
            url: `roles/${role.id}/rights/${rightid}`,
            method: "delete"
          });
          if (res.meta.status != 200) {
            return this.$message.error(res.meta.msg);
          }
          this.$message.success("删除成功");
          role.children = res.data;
        })
        .catch(() => this.$message.info("已取消删除"));
    },

    // 分配权限
    async showDistriDia(node) {
      this.roleId = node.id;
      this.distriDialog = true;
      // 获取所有权限列表
      let { data: res } = await request({
        url: `rights/tree`,
        method: "get"
      });
      if (res.meta.status != 200) {
        return this.$message.error(res.meta.msg);
      }

      // 保存数据
      this.rightList = res.data;
      // 获取选中的权限
      this.getCheckedKeys(node, this.checkedKeys);
    },
    // 确定分配权限
    async handleRoleAuth() {
      let tr = this.$refs.treeRef;
      let arr = [...tr.getCheckedKeys(), ...tr.getHalfCheckedKeys()];
      arr = arr.join(",");

      let { data: res } = await request({
        url: `roles/${this.roleId}/rights`,
        method: "post",
        data: {
          rids: arr
        }
      });
      if (res.meta.status != 200) {
        return this.$message.error(res.meta.msg);
      }
      //成功;

      this.getRoleList();
      this.$message.success("修改成功");
      this.distriDialog = false;
    },

    /**
     * 递归 获取 该角色已有权限
     *    1. 退出条件： 是否为第三节点(即，没有children的节点)
     *    2. 上面条件不成立，那就是有 children，那么循环遍历该 children，取出每一项，对其每一项调用该函数
     */
    getCheckedKeys(node, arr) {
      //退出条件
      if (node.children == null) {
        return arr.push(node.id);
      }

      node.children.forEach(v => {
        this.getCheckedKeys(v, arr);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.bb_line {
  border-bottom: 1px solid #ddd;
}
.bt_line {
  border-top: 1px solid #ddd;
}
.el-tag {
  margin: 8px;
}

.mid {
  display: flex;
  align-items: center;
}
</style>