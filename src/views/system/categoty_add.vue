<template>
	<el-dialog width="580px" :title="title" top="30vh" :visible="dialogStatus" close-on-press-escape @close="closedialog" @open="openDialog">
		<el-form :model="form" label-width="120px" @keyup.enter.native="handleBao('form')" @submit.native.prevent v-loading="loading" element-loading-text="数据载入中">
			<el-form-item label="上级类别名称" v-if="form.path.length>0">
				<el-cascader :options="options" change-on-select v-model="form.path" :props="props" :show-all-levels="false" style="width:100%" size="medium"></el-cascader>
			</el-form-item>
			<el-form-item label="节点名称">
				<el-input placeholder="请填写节点名称" v-model="form.title" size="medium">
				</el-input>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer" v-if="!loading">
			<el-button type="primary" :loading="vloading" @click="handleBao('form')"><svg-icon icon-class="keep"></svg-icon> 确认保存</el-button>
		</div>
	</el-dialog>
</template>
<script>
import { cated, cated_read, cateList } from "@/api/system/category";

export default {
  props: ["dialogStatus", "caId", "path"],
  data() {
    return {
      form: {
        path: [],
        title: ""
      },
      options: [],
      loading: false,
      vloading: false,
      props: {
        value: "id",
        label: "title",
        children: "children"
      },
      id: "",
      title: "编辑节点"
    };
  },
  methods: {
    async openDialog() {
      await this.getSelect();
      if (this.caId) {
        this.title = "编辑节点";
        this.getRead();
      }
      if (this.path && this.path.length > 0) {
        this.title = "编辑节点";
        this.form.path = this.path;
      }
    },
    //提交
    handleBao(form) {
      this.vloading = true;
      let api_type = this.caId ? "put" : "post";
      cated(this.form, api_type)
        .then(rs => {
          this.$message({
            type: "success",
            message: "操作成功"
          });
          this.vloading = false;
          this.$emit("CB-dialogStatus", 1);
        })
        .catch(() => {
          this.vloading = false;
        });
    },
    async getRead() {
      this.loading = true;
      cated_read(this.caId)
        .then(rs => {
          this.form = rs;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    getSelect() {
      this.loading = true;
      cateList()
        .then(rs => {
          this.options = [
            {
              id: 0,
              path: [0],
              title: "作为一级菜单",
              children: rs
            }
          ];
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    //关闭弹框
    closedialog() {
      this.clear();
      this.$emit("CB-dialogStatus", false);
    },
    clear() {
      this.form = {
        path: [],
        title: ""
      };
      this.loading = false;
      this.vloading = false;
    }
  }
};
</script>
