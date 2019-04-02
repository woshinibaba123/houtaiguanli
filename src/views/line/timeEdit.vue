<template>
  <div>
    <el-dialog
      v-el-drag-dialog
      :title="title"
      width="700px"
      top="15vh"
      :visible="dialogTime"
      @open="openDialog"
      @close="closeDialog"
    >
      <el-form
        :model="form"
        :rules="rules"
        ref="form"
        label-width="140px"
        label-suffix="："
        v-loading="laoding"
      >
        <el-form-item label="疗休养时间" prop="times">
          <el-date-picker
            v-model="form.times"
            type="daterange"
            style="width:100%"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            unlink-panels
            align="right"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="首批报名时间" prop="bm_times">
          <el-date-picker
            v-model="form.bm_times"
            type="daterange"
            style="width:100%"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            unlink-panels
            align="right"
            @change="bmtimeChange"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="报名截止时间" prop="jz_time">
          <el-date-picker
            v-model="form.jz_time"
            type="date"
            placeholder="选择报名截止时间"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          :loading="btn_loading"
          v-waves
          v-if="authCheck(63)||authCheck(65)"
          @click="saveData()"
        >
          <svg-icon icon-class="keep"></svg-icon>确认保存
        </el-button>
      </div>
    </el-dialog>
    
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <span>确认将时间修改为以上时间</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import elDragDialog from "@/directive/el-dragDialog"; //拖拽
import waves from "@/directive/waves"; // 水波纹指令

// import { LineRead, LineEdit } from "@/api/line";
import { mapState } from "vuex";

const formData = {
  times: [],
  bm_times: [],
  jz_time: ""
};

export default {
  props: {
    dialogTime: Boolean,
    idList: Array
  },
  computed: {
    ...mapState(["nianfenData"])
    // pickerOptions() {
    //     let _this = this;
    //     return {
    //         disabledDate(time) {
    //             return (
    //                 Date.parse(_this.form.nf + "/01/01") > time.getTime() ||
    //                 Date.parse(_this.form.nf + "/12/31") < time.getTime()
    //             );
    //         }
    //     };
    // }
  },
  directives: { elDragDialog, waves },
  data() {
    return {
      laoding: false,
      btn_loading: false,
      title: "批量编辑时间",
      dialogVisible: false,
      form: JSON.parse(JSON.stringify(formData)),
      rules: {
        times: [
          {
            required: true,
            message: "请选择疗休养时间",
            trigger: "change"
          }
        ],
        bm_times: [
          {
            required: true,
            message: "请选择报名时间",
            trigger: "change"
          }
        ],
        jz_time: [
          {
            required: true,
            message: "请选择疗休养报名截止日期",
            trigger: "change"
          }
        ]
      }
    };
  },
  methods: {
    openDialog() {
      // if (this.liid === null) return;
      // this.title = "编辑";
      // this.getRead();
    },
    bmtimeChange(val) {
      if (!val) {
        this.form.bm_times = [];
      }
    },
    timeChange(val) {
      if (!val) {
        this.form.times = [];
      }
    },
    //开始年份
    startChange(val) {
      if (val) {
        this.form.end_time = (parseInt(val) + 3).toString();
      }
    },
    //保存
    saveData() {
        this.dialogVisible = true
      // this.$refs["form"].validate(valid => {
      //   if (valid) {
      //     // this.btn_loading = true;
      //     // let api_type = this.liid ? "put" : "post";
      //     // let data = JSON.parse(JSON.stringify(this.form));
      //     // LineEdit(data, api_type)
      //     //     .then(res => {
      //     //         this.$message.success("保存成功！");
      //     //         this.$emit("CB-dialogTime", true);
      //     //         this.clearForm();
      //     //         this.btn_loading = false;
      //     //     })
      //     //     .catch(() => {
      //     //         this.btn_loading = false;
      //     //     });
      //     console.log(JSON.parse(JSON.stringify(this.form)));
      //   }
      // });
    },
    // 提交数据
    submit(){
     this.$refs["form"].validate(valid => {
        if (valid) {
          // this.btn_loading = true;
          // let api_type = this.liid ? "put" : "post";
          // let data = JSON.parse(JSON.stringify(this.form));
          // LineEdit(data, api_type)
          //     .then(res => {
          //         this.$message.success("保存成功！");
          //         this.$emit("CB-dialogTime", true);
          //         this.clearForm();
          //         this.btn_loading = false;
          //     })
          //     .catch(() => {
          //         this.btn_loading = false;
          //     });
          console.log(JSON.parse(JSON.stringify(this.form)));
        }
      });
    },
    //关闭弹出框
    closeDialog() {
      this.clearForm();
      this.$emit("CB-dialogTime");
    },
    //
    handleClose(){
        this.dialogVisible = false
    },
    // 确定按钮
    handleSubmit(){
        this.dialogVisible = false
        this.submit()
    },
    //清理表单
    clearForm() {
      this.form = JSON.parse(JSON.stringify(formData));
      this.title = "编辑";
      this.$refs["form"].resetFields();
    }
  }
};
</script>
