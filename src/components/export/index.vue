<template>
	<el-dialog title="操作提示" :visible="exportDialogstatus" width="480px" top="30vh" @close="handleClose" @open="openDialog">
		<div class="padding-20 box" v-loading="loading" element-loading-text="文件生成中，请稍等…">
			<div v-if="loadUrl">
				<p class="text-center font-120 text-success margin-top-10">数据生成成功！请点击下面的链接下载文件 </p>
				<div class="text-center margin-top-20">
					<a class="bton" icon="el-icon-circle-plus-outligeng" plain type="primary" size="medium" :href="loadUrl">
						<i class="el-icon-download"></i> 下载文件
					</a>
				</div>
			</div>
		</div>
	</el-dialog>
</template>
<script>
import { read } from "@/api/index";
export default {
  props: ["exportDialogstatus", "data", "url"],
  data() {
    return {
      loadUrl: "",
      loading: false
    };
  },
  methods: {
    //打开
    openDialog() {
      if (this.url === "") {
        return;
      }
      this.loading = true;
      read(this.url, this.data)
        .then(rs => {
          this.loadUrl = rs;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    //关闭
    handleClose() {
      this.$emit("CB-exportDialogstatus", false);
    }
  }
};
</script>
<style scoped>
.bton {
  color: #409eff;
  background: #ecf5ff;
  border-color: #b3d8ff;
  margin-left: 10px;
  padding: 10px 20px;
  font-size: 14px;
  border-radius: 4px;
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  border: 1px solid #dcdfe6;
  -webkit-appearance: none;
  text-align: center;
  box-sizing: border-box;
  font-weight: 500;
  outline: 0 !important;
  font-family: inherit;
  text-transform: none;
}
.box {
  min-height: 150px;
}
</style>

