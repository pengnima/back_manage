
<template>
  <div class="home_users">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- 卡片的头部区域，该区域如果要用到 栅栏，那么要将栅栏包裹起来 -->
      <template v-slot:header class="card_header">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-input
              placeholder="请输入内容"
              v-model="queryInfo.query"
              clearable
              @clear="getUserList()"
            >
              <el-button slot="append" icon="el-icon-search" @click="getUserList()"></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="showDialog=true">添加用户</el-button>
          </el-col>
        </el-row>
      </template>
      <el-table :data="userList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态" width="100">
          <!-- 这里用了作用域插槽，该插槽可以获取子组件的数据 -->
          <template #default="val">
            <el-switch v-model="val.row.mg_state" @change="handleSwitchChange(val.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="val">
            <!-- 修改 -->
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="handleEdit(val.row.id)"
            ></el-button>
            <!-- 删除 -->
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="handleDeletUser(val.row.id)"
            ></el-button>
            <!-- 分配 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                @click="handleRoleChange(val.row)"
                size="mini"
                type="warning"
                icon="el-icon-s-tools"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        ref="paginationRef"
        background
        layout="total,sizes,prev, pager, next,jumper"
        :total="total"
        :page-sizes="[1,2,5,10]"
        :page-size.sync="queryInfo.pagesize"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </el-card>

    <!-- 添加用户 对话框 -->
    <el-dialog
      title="添加用户"
      width="30%"
      :visible.sync="showDialog"
      :show-close="false"
      @close="$refs.addUserRef.resetFields()"
    >
      <!-- 对话框body主体 -->
      <el-form
        ref="addUserRef"
        status-icon
        :model="addUserForm"
        :rules="addUserRules"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 对话框footer -->
      <template #footer class="dialog-footer">
        <el-button @click="showDialog=false">取 消</el-button>
        <el-button type="primary" @click="handleAddUser">确 定</el-button>
      </template>
    </el-dialog>

    <!-- 修改用户对话框 -->
    <el-dialog title="修改用户信息" width="30%" :visible.sync="showEditDialog" :show-close="false">
      <!-- 对话框body主体 -->
      <el-form
        ref="editUserRef"
        status-icon
        :model="editUserForm"
        :rules="addUserRules"
        label-width="80px"
      >
        <el-form-item label="用户名">
          <el-input disabled v-model="editUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 对话框footer -->
      <template #footer class="dialog-footer">
        <el-button @click="showEditDialog=false">取 消</el-button>
        <el-button type="primary" @click="handleEditCheck">确 定</el-button>
      </template>
    </el-dialog>

    <!-- 修改角色对话框 -->
    <el-dialog
      title="修改用户角色"
      :visible.sync="showRoleDialog"
      width="30%"
      @close="selectRoleID=null;"
    >
      <div class="body">
        <p>当前用户：{{activeUser.username}}</p>
        <p>当前角色：{{activeUser.role_name}}</p>
        <p>
          分配新角色：
          <el-select v-model="selectRoleID" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showRoleDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleRoleCheck">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
/**
1. 添加新用户
  - 先弹出 对话框 询问是否 添加
  - 确认添加，
 */
import { request } from "@/request/index.js";
export default {
  created() {
    this.getUserList();
  },
  data() {
    var validateEmail = (rule, value, callback) => {
      const emailReg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
      if (value === "") {
        return callback(new Error("请输入邮箱"));
      }
      if (!emailReg.test(value)) {
        return callback(new Error("邮箱格式不正确!"));
      }
      callback();
    };
    var validateMobile = (rule, value, callback) => {
      const mobileReg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/;
      if (value === "") {
        return callback(new Error("请输入手机号"));
      }
      if (!mobileReg.test(value)) {
        return callback(new Error("手机号格式不正确!"));
      }
      callback();
    };
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2
      },
      userList: [],
      total: 0,
      showDialog: false,
      showEditDialog: false,
      showDeletDialog: false,
      showRoleDialog: false,
      editUserForm: {},
      addUserForm: {
        username: "",
        password: "123456",
        email: "1@qq.com",
        mobile: "15032156234"
      },
      addUserRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 9, message: "长度在 3 到 9 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 9, message: "长度在 6 到 9 个字符", trigger: "blur" }
        ],
        email: [{ required: true, validator: validateEmail, trigger: "blur" }],
        mobile: [{ required: true, validator: validateMobile, trigger: "blur" }]
      },
      activeUser: {},
      roleList: [],
      selectRoleID: null
    };
  },
  methods: {
    async getUserList() {
      let { data: res } = await request({
        url: "users",
        params: this.queryInfo
      });
      if (res.meta.status !== 200) return this.$message.error("数据请求失败");

      this.total = res.data.total;
      this.userList = res.data.users;
    },
    // 每页显示条数改变 触发
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    // 当前页改变 触发
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },
    //switch 改变
    async handleSwitchChange(userInfo) {
      console.log(userInfo);

      let { data: res } = await request({
        url: `users/${userInfo.id}/state/${userInfo.mg_state}`,
        method: "put"
      });

      // 如果修改失败，要取反。（因为switch与该数值是 v-model绑定的）
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state;
        return this.$message.error("修改失败");
      }

      this.$message.success("修改成功");
    },
    // 在 添加用户 对话框中 点击确认
    handleAddUser() {
      this.$refs.addUserRef.validate(async valid => {
        if (!valid) return this.$message.error("请正确输入信息");

        let { data: res } = await request({
          url: "users",
          method: "POST",
          data: this.addUserForm
        });
        console.log(res);
        if (res.meta.status != 201) return this.$message.error(res.meta.msg);
        this.$message.success("成功创建新用户");
        this.showDialog = false;
        this.getUserList();
      });
    },

    // 点击修改用户
    async handleEdit(id) {
      let { data: res } = await request({
        url: "users/" + id
      });
      if (res.meta.status != 200)
        return this.$message.error("出了意外，无法修改！");

      this.editUserForm = res.data;
      this.showEditDialog = true;
    },
    // 确定 修改用户
    handleEditCheck() {
      this.$refs.editUserRef.validate(async valid => {
        if (!valid) return this.$message.error("请正确输入信息");

        let { data: res } = await request({
          url: "users/" + this.editUserForm.id,
          method: "PUT",
          data: {
            email: this.editUserForm.email,
            mobile: this.editUserForm.mobile
          }
        });
        console.log(res);
        if (res.meta.status != 200) return this.$message.error(res.meta.msg);
        this.$message.success("成功修改用户");
        this.showEditDialog = false;
        this.getUserList();
      });
    },
    // 删除用户
    handleDeletUser(userId) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let { data: res } = await request({
            url: "users/" + userId,
            method: "delete"
          });

          if (res.meta.status != 200) return this.$message.error(res.meta.msg);
          this.$message.success("删除成功");
          this.getUserList();
        })
        .catch(() => this.$message.info("已取消删除"));
    },
    //确定 修改用户角色
    async handleRoleChange(userInfo) {
      this.showRoleDialog = true;
      this.activeUser.id = userInfo.id;
      this.activeUser.role_name = userInfo.role_name;
      this.activeUser.username = userInfo.username;

      let { data: res } = await request({
        url: "roles"
      });
      if (res.meta.status != 200) return this.$message.error(res.meta.msg);
      this.roleList = res.data;
    },
    async handleRoleCheck() {
      if (this.selectRoleID == null) {
        return this.$message.error("请选择要分配的角色~");
      }
      let { data: res } = await request({
        url: `users/${this.activeUser.id}/role`,
        method: "put",
        data: {
          rid: this.selectRoleID
        }
      });
      if (res.meta.status != 200) return this.$message.error(res.meta.msg);

      //成功分配
      this.$message.success("修改角色成功~");
      this.showRoleDialog = false;
      this.getUserList();
    }
  }
};
</script>

<style lang="scss" scoped>
.el-pagination {
  margin-top: 30px;
}
</style>