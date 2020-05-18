<template>
  <div class="goods_add">
    <el-card>
      <el-row>
        <el-alert title="添加商品信息" center type="info" show-icon></el-alert>
      </el-row>
      <el-steps class="cat_omt" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <el-form
        :model="goodsForm"
        status-icon
        :rules="goodsRules"
        ref="ruleForm"
        label-position="top"
      >
        <el-tabs
          v-model="activeIndex"
          class="cat_omt"
          tab-position="left"
          :before-leave="handleBeforeLeave"
          @tab-click="tabClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="goodsForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="goodsForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="goodsForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_name">
              <el-input v-model="goodsForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="goodsForm.goods_cat"
                :options="cateList"
                :props="{ expandTrigger: 'hover', value: 'cat_id', label: 'cat_name' }"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in manyTabDate" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox v-for="i in item.attr_vals" border :key="i" :label="i"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTabDate" :key="item.attr_id">
              <el-input :value="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :headers="headerObj"
              name="upfile"
              :action="upLoadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              with-credentials
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <template #tip>只能上传jpg/png文件，且不超过500kb</template>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="goodsForm.goods_introduce"> </quill-editor>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { request } from "../../request";
export default {
  created() {
    this.getCateList();
  },
  data() {
    var validateCat = (rule, value, callback) => {
      console.log(value);

      if (value.length != 3) {
        this.goodsForm.goods_cat = [];

        return callback(new Error("请选择三级分类"));
      }
      callback();
    };
    return {
      //活动的 tab 栏
      activeIndex: "0",
      //商品提交表单
      goodsForm: {
        goods_name: "",
        goods_number: null,
        goods_price: null,
        goods_weight: null,
        goods_cat: [1, 3, 6],
        goods_introduce: "",
        pics: "",
        attrs: [],
      },
      //规则
      goodsRules: {
        goods_name: [{ required: true, message: "请输入商品名称", trigger: "blur" }],
        goods_number: [{ required: true, message: "请输入商品数量", trigger: "blur" }],
        goods_price: [{ required: true, message: "请输入商品价格", trigger: "blur" }],
        goods_weight: [{ required: true, message: "请输入商品重量", trigger: "blur" }],
        goods_cat: [{ required: true, validator: validateCat, trigger: "change" }],
      },
      // 分类的列表
      cateList: [],
      // tab的数据
      manyTabDate: [],
      onlyTabDate: [],
      upLoadURL: "/api/upload",
      headerObj: {
        Authorization: window.sessionStorage.getItem("token"),
      },
    };
  },
  methods: {
    async getCateList() {
      let { data: res } = await request({
        url: "categories",
      });

      if (res.meta.status != 200) {
        return this.$message.error("请求数据失败~");
      }

      this.cateList = res.data;
    },
    // 切换tabs之前
    handleBeforeLeave(newAc, oldAc) {
      if (oldAc == 0 && this.goodsForm.goods_cat.length != 3) {
        this.$message.error("至少请先输入商品分类");
        return false;
      }
    },
    //切换tab
    async tabClick() {
      // 激活了 商品参数 tab
      if (this.activeIndex == "1") {
        let { data: res } = await request({
          url: `categories/${this.catId}/attributes`,
          params: {
            sel: "many",
          },
        });
        if (res.meta.status != 200) {
          return this.$message.error("请求数据失败~");
        }

        res.data.forEach(v => {
          v.attr_vals = v.attr_vals.length != 0 ? v.attr_vals.split(" ") : [];
        });

        this.manyTabDate = res.data;
      } else if (this.activeIndex == "2") {
        let { data: res } = await request({
          url: `categories/${this.catId}/attributes`,
          params: {
            sel: "only",
          },
        });
        if (res.meta.status != 200) {
          return this.$message.error("请求数据失败~");
        }
        this.onlyTabDate = res.data;
      }
    },

    //触发 预览图片事件
    handlePreview() {},
    //触发 移除图片事件
    handleRemove() {},
  },
  computed: {
    catId() {
      let temp = this.goodsForm.goods_cat;
      return temp.length == 3 ? temp[2] : null;
    },
  },
};
</script>

<style lang="scss" scoped>
.el-checkbox {
  margin: 0 8px 0 0 !important;
}
</style>
