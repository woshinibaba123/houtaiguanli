<template>
    <el-dialog v-el-drag-dialog :title="title+'年份'" width="400px" top="25vh" append-to-body :visible="dialogUserset"
        @open="openDialog" @close="closeDialog">
        <el-form :model="form" :rules="rules" ref="form" label-width="110px" label-suffix="：">
            <el-form-item label="年份" prop="nf">
                <el-select :disabled="title=='编辑'" @change="getMemberInfo"  v-model="form.nf" clearable placeholder="请选择年份" style="widthL100%">
                    <el-option v-for="(item,index) in options" :key="index" :label="item" :value="item"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="名额" prop="count">
                <el-input-number v-model="form.count" placeholder="请填写当前年份人数" :step="2" controls-position="right"></el-input-number>
            </el-form-item>

			<div class="line"></div>
			 <el-form-item class="info-item" label="当年退休人数">
				<span>{{ retiredNum }}&nbsp;人</span>
            </el-form-item>
			<el-form-item class="info-item" label="刚满5年人数">
				<span>{{ accordNum}}&nbsp;人</span>
            </el-form-item>
			<el-form-item class="info-item" label="总人数">
				<span>{{ countNum }}&nbsp;人</span>
            </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
            <el-button type="primary" :loading="btn_loading" v-waves v-if="authCheck(49)||authCheck(51)" @click="saveData('form ')">
                <svg-icon icon-class="keep"></svg-icon>确认保存
            </el-button>
        </div>

    </el-dialog>
</template>
<script>
import elDragDialog from "@/directive/el-dragDialog"; //拖拽
import waves from "@/directive/waves"; // 水波纹指令
import { usersetRead, usersetnewEdit } from "@/api/cycle";

const formData = {
  nf: "",
  count: 0
};
export default {
  name: "user_set",
  props: {
    dialogUserset: Boolean,
    usid: [Number, String],
    nfid: [Number, String],
    start_time: String
  },
  directives: { elDragDialog, waves },
  data() {
    return {
      loading: false,
      btn_loading: false,
      form: JSON.parse(JSON.stringify(formData)),
      retiredNum: 30,
      accordNum: 18,
      title: "新增",
      options: [],
      rules: {
        nf: [
          {
            required: true,
            message: "请选择年份",
            trigger: "change"
          }
        ],
        count: [
          {
            required: true,
            message: "请填写人数",
            trigger: "blur,change"
          }
        ]
      }
    };
  },
  methods: {
    //打开弹出框
    openDialog() {
      for (
        let i = parseInt(this.start_time);
        i < parseInt(this.start_time) + 4;
        i++
      ) {
        this.options.push(i);
      }
      let date = new Date();
      this.form.nf = date.getFullYear().toString();
	  this.title = "新增";
      this.getMemberInfo()
      if (this.usid == null || this.usid === "") return;
      this.title = "编辑";
	  this.getRead();

    },
    saveData(form) {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.btn_loading = true;
          let api_type = this.usid ? "put" : "post";
          let data = JSON.parse(JSON.stringify(this.form));
          if (!this.usid) {
            data["p_id"] = this.nfid;
          }
          usersetnewEdit(data, api_type)
            .then(res => {
              this.$message.success("保存成功！");
              this.$emit("CB-dialogUserset", true);
              this.clearForm();
              this.btn_loading = false;
            })
            .catch(() => {
              this.btn_loading = false;
            });
        }
      });
    },
    //读取数据源
    getRead() {
      this.loading = true;
      usersetRead(this.usid)
        .then(res => {
          this.form = res;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    closeDialog() {
      this.$emit("CB-dialogUserset");
      this.clearForm();
    },
    clearForm() {
      this.form = JSON.parse(JSON.stringify(formData));
      this.title = "编辑";
      this.options = [];
      this.$refs["form"].resetFields();
	},
	//  实时获取 退休人数 和满5年人数
	getMemberInfo(){
		this.retiredNum =128;
		this.accordNum = 66;
	}
  },
  computed: {
    countNum() {
      return this.retiredNum + this.accordNum;
    }
  }
};
</script>
<style lang="scss" scoped>
.line {
  margin-bottom: 10px;
  height: 0;
  width: 100%;
  border-bottom: 1px solid #eee;
}

.info-item {
  margin-bottom: 0;
  /deep/ .el-form-item__label{
    line-height: 26px;
  }
  /deep/ .el-form-item__content{
	  line-height: 26px ;
  }
}
</style>
