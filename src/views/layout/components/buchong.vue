<template>
	<el-dialog title="完善资料" :visible="dialogInfo" width="360px" :show-close="false" @open="handleOpen" @close="handleClose">
		<div class="text-info">*请先完善个人资料</div>
		<el-form :model="info" :rules="rules" ref="info" label-width="80px" class="margin-top-10">
			<el-form-item label="工号">
				{{info.account}}
			</el-form-item>
			<el-form-item prop="name" label="姓名">
				{{info.name}}
			</el-form-item>
			<el-form-item prop="yxmc" label="院系名称">
				{{info.yxmc || '- -'}}
			</el-form-item>
			<el-form-item label="手机号码" prop="phone">
				<el-input v-model="info.phone" placeholder="填写手机号码" size="medium"></el-input>
			</el-form-item>
			<el-form-item label="邮箱" prop="email">
				<el-input v-model="info.email" placeholder="填写电子邮箱" size="medium"></el-input>
			</el-form-item>
		</el-form>
		<div class="dialog-footer" slot="footer">
			<el-button type="primary" v-waves v-loading="loading" icon="fa fa-floppy-o" size="medium" @click="handleSave"> 保存信息</el-button>
		</div>
	</el-dialog>
</template>
<script>
import waves from "@/directive/waves"; // 水波纹指令
import { mapState } from "vuex";
import { userZiliao } from "@/api/users/user";

export default {
  name: "wanshan",
  props: ["dialogInfo"],
  directives: {
    waves
  },
  data() {
    return {
      info: {
        account: "",
        name: "",
        phone: "",
        email: ""
      },
      rules: {
        phone: [
          {
            required: true,
            message: "请填写手机号码",
            trigger: "blur"
          },
          {
            pattern: /^1[3,4,5,7,8]\d{9}$/,
            message: "请输入正确的手机号码格式",
            trigger: "blur"
          }
        ],
        email: [
          {
            type: "email",
            message: "请输入正确的电子邮箱格式",
            trigger: "blur"
          }
        ]
      },
      loading: false
    };
  },
  methods: {
    //打开弹框
    handleOpen() {
      this.info = JSON.parse(JSON.stringify(this.user.userinfo));
    },
    handleClose() {
      this.$refs["info"].resetFields();
    },
    //保存信息
    handleSave() {
      this.loading = true;
      this.$refs["info"].validate(valid => {
        if (valid) {
          userZiliao(this.info).then(res => {
            this.user.userinfo.email = this.info.email;
            this.user.userinfo.phone = this.info.phone;
            this.$store.commit("setUserinfo", this.user);
            this.$message.success("保存成功");
            this.$refs["info"].resetFields();
            this.clearForm();
            this.$emit("CB-dialogInfo", 1);
          });
          this.loading = false;
        } else {
          this.loading = false;
        }
      });
    },
    //清理表单
    clearForm() {
      this.info = {
        account: "",
        name: "",
        phone: "",
        email: ""
      };
    }
  },
  computed: mapState({
    user: state => state.user
  })
};
</script>

