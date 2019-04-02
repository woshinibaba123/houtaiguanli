<template>
  <el-dialog
    title="修改资料"
    width="700px"
    :visible="dialogForm"
    @close="closeDialog"
    :modal-append-to-body="false"
    @open="openDialog"
  >
    <div v-loading="loading" element-loading-text="拼命加载中" class="gaiInfo">
      <el-row>
        <el-form :model="form" :rules="rules" ref="form" label-width="140px" label-suffix="：">
          <el-col :span="12">
            <el-form-item label="教师姓名">{{form.name||'--'}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="教师工号">{{form.account||'--'}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别">{{form.sex===2?'女':'男'}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出生日期">{{form.csrq||'--'}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="所属部门"
            >{{form.xisuo_title||'--'}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="入职日期">{{form.rzrq||'--'}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="疗休养状态">{{form.rzrq||'--'}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证号">{{form.idcard||'--'}}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-col :span="12">
              <el-form-item label="手机号码" prop="phone">
                <el-input v-model="form.phone" placeholder="请填写手机号码" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="电子邮箱" prop="email">
                <el-input v-model="form.email" placeholder="请填写电子邮箱" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-col>
        </el-form>
      </el-row>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button
        type="primary"
        :loading="loadingBiao"
        size="medium"
        icon="fa fa-floppy-o"
        @click="onSubmit"
      >
        <svg-icon icon-class="keep"></svg-icon>保 存
      </el-button>
    </div>
  </el-dialog>
</template>
<script type="text/javascript">
//导入vuex辅助函数
import { mapState } from "vuex";
import { userZiliao } from "@/api/system/user";

export default {
  props: ["dialogForm"],
  data() {
    return {
      loadingBiao: false,
      loading: false,
      formLabelWidth: "120px",
      rules: {
        email: [
          {
            type: "email",
            message: "请填写正确的邮箱地址！",
            trigger: "blur"
          }
        ],
        phone: [
          {
            required: true,
            message: "请填写手机号码",
            trigger: "blur"
          },
          {
            pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ],
        name: [
          {
            required: true,
            message: "请填写姓名",
            trigger: "blur"
          }
        ]
      },
      form: {
        name: "",
        account: "",
        sex: 1,
        csrq: "",
        xisuo_title: "",
        rzrq: "",
        phone: "",
        email: "",
        status: "",
        idcard: ""
      }
    };
  },
  methods: {
    openDialog() {
      this.form = JSON.parse(JSON.stringify(this.userinfo.userinfo));
    },
    //确定
    onSubmit() {
      this.loadingBiao = true;
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.phone) {
            if (/^1[34578]{1}\d{9}$/.test(this.form.phone)) {
              this.setData();
            } else {
              this.loadingBiao = false;
              this.$message.warning("请填写正确的手机号码");
            }
          } else {
            this.setData();
          }
        } else {
          this.loadingBiao = false;
          return false;
        }
      });
    },

    //插入数据
    setData() {
      userZiliao(this.form)
        .then(response => {
          this.userinfo.userinfo.name = this.form.name;
          this.userinfo.userinfo.email = this.form.email;
          this.userinfo.userinfo.phone = this.form.phone;
          this.$store.commit("setUserinfo", this.userinfo);
          this.$message.success("保存成功");
          this.$refs["form"].resetFields();
          this.clearForm();
          this.$emit("CB-dialogForm", 1);
          this.loadingBiao = false;
        })
        .catch(error => {
          this.loadingBiao = false;
        });
    },
    //关闭弹框
    closeDialog() {
      // this.$refs["form"].resetFields();
      this.$emit("CB-dialogForm", false);
      this.clearForm();
    },
    //清理表单
    clearForm() {
      this.form = {
        phone: "",
        email: ""
      };
    }
  },
  computed: mapState({
    rules_juesezu: state => state.rules_juesezu,
    userinfo: state => state.user
  })
};
</script>
<style>
</style>
