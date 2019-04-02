<template>
    <el-dialog v-el-drag-dialog title="审批疗休养申请信息" top="10vh" width="900px" :visible="dialogStatus" @open="openDialog"
        @close="closeDialog">
        <div v-bind:style="{ 'height': _PageHeight - 249 +'px','overflow' :'auto'}" v-loading="loading"
            element-loading-text="数据载入中" class="demo-form">
            <el-form :model="form" label-width="110px" label-suffix="：" class="padding-5">
                <div class="font-110 text-bold margin-left-5">基本信息</div>
                <el-row class="margin-top-20">
                    <el-col :span="8">
                        <el-form-item label="教师姓名" class="wrap">{{form.name||'--'}}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="工号">{{form.account||'--'}}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="性别">{{form.sex===2?'女':'男'}}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="年龄">{{form.age||'--'}}</el-form-item>
                    </el-col>
                    <el-col :span="16">
                        <el-form-item label="所在部门" class="wrap">{{form.xisuo_title||'--'}}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="手机号码" class="wrap">{{form.phone||'--'}}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="电话号码" class="wrap">{{form.tel||'--'}}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="电子邮箱" class="wrap">{{form.email||'--'}}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="身份证号" class="wrap">{{form.sfz||'--'}}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="申请时间" class="wrap">{{form.add_time||'--'}}</el-form-item>
                    </el-col>
                </el-row>
                <div class="font-110 text-bold margin-left-5">申请线路信息</div>
                <el-row class="margin-top-20">
                    <el-col :span="24">
                        <el-form-item label="线路名称" class="wrap">{{form.title||'--'}}</el-form-item>
                        <el-form-item label="线路说明" class="wrap" v-if="form.beizhu">
                            <span v-html="Trim(form.beizhu)"></span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="疗休养周期" class="wrap">{{form.start_time}} 至 {{form.end_time}} 年</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="收费金额（元）" label-width="130px" class="wrap">￥{{form.sf||0}}</el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="补贴金额（元）" label-width="130px" class="wrap">￥{{form.bt||0}}</el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <el-form :model="info" :rules="rules" ref="info" label-width="110px" label-suffix="：">
                <div class="font-110 text-bold margin-left-5 margin-bottom-20">审核信息</div>
                <el-form-item label="审核结果" prop="status">
                    <el-radio-group v-model="info.status" @change="statusChange">
                        <el-radio v-for="(item,index) in statusState" :key="index" :label="item.id">{{item.title}}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="审核意见" prop="sh_beizhu" ref="info.sh_beizhu">
                    <el-input type="textarea" v-model="info.sh_beizhu" :placeholder="info.status===3?'审核意见，必填项，字数限制200字':'审核意见，非必填项，字数限制200字'"
                        :autosize="{ minRows: 3 }"></el-input>
                    剩 {{200-info.sh_beizhu.length}} 字
                </el-form-item>
            </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" :loading="btn_loading" v-waves v-if="authCheck(69)" @click="saveData('form ')">
                <svg-icon icon-class="keep"></svg-icon>确认保存
            </el-button>
        </div>
    </el-dialog>
</template>
<script>
import { mapState } from "vuex";
import elDragDialog from "@/directive/el-dragDialog"; //拖拽
import waves from "@/directive/waves"; // 水波纹指令

import { ApplyRead, ApplyEdit } from "@/api/apply";

const formData = {
    name: "",
    account: "",
    school: "",
    school_title: "",
    sex: 1,
    age: 0,
    phone: "",
    tel: "",
    email: "",
    sfz: "",
    add_time: "",
    title: "",
    start_time: "",
    end_time: "",
    beizhu: "",
    sf: 0,
    sqly: ""
};
const infoData = {
    status: 2,
    sh_beizhu: ""
};

export default {
    name: "apply_shenpi",
    props: {
        dialogStatus: Boolean,
        sid: [String, Number]
    },
    computed: {
        ...mapState(["statusData"]),
        statusState() {
            return this.statusData.filter(
                item => item.id === 2 || item.id === 3
            );
        }
    },
    directives: { elDragDialog, waves },
    data() {
        var checkBeizhu = (rule, value, callback) => {
            if (this.info.status === 3 && (!value || value == "")) {
                callback(new Error("请填写审核意见！"));
            } else {
                callback();
            }
        };
        return {
            loading: false,
            activeNames: ["1", "2"],
            btn_loading: false,
            form: JSON.parse(JSON.stringify(formData)),
            info: JSON.parse(JSON.stringify(infoData)),
            rules: {
                status: [
                    {
                        required: true,
                        message: "请选择审核结果",
                        trigger: "change"
                    }
                ],
                sh_beizhu: [
                    {
                        validator: checkBeizhu,
                        trigger: "blur"
                    }
                ]
            }
        };
    },
    methods: {
        openDialog() {
            if (this.sid === null || this.sid === "") return;
            this.getRead();
        },
        statusChange(val) {
            console.log(val);
            if (val) {
                this.info.sh_beizhu = "";
                this.$refs["info.sh_beizhu"].clearValidate();
            }
        },
        //保存审核结果
        saveData(form) {
            this.$refs["info"].validate(valid => {
                if (valid) {
                    this.btn_loading = true;
                    let data = JSON.parse(JSON.stringify(this.info));
                    ApplyEdit(this.info, "post")
                        .then(res => {
                            this.$message.success("审核成功！");
                            this.clearForm();
                            this.$emit("CB-dialogStatus", true);
                            this.btn_loading = false;
                        })
                        .catch(() => {
                            this.btn_loading = false;
                        });
                }
            });
        },
        getRead() {
            this.loading = true;
            ApplyRead(this.sid)
                .then(res => {
                    if (parseInt(res.status) == 1) {
                        res.status = 2;
                    }
                    res.status = parseInt(res.status);
                    this.form = res;
                    this.info.id = res.id;
                    this.info.status = res.status;
                    this.info.sh_beizhu = res.sh_beizhu;
                    this.loading = false;
                })
                .catch(() => {
                    this.loading = false;
                });
        },
        closeDialog() {
            this.$emit("CB-dialogStatus");
            this.clearForm();
        },
        clearForm() {
            this.form = JSON.parse(JSON.stringify(formData));
            this.info = JSON.parse(JSON.stringify(infoData));
            this.$refs["info"].resetFields();
        }
    }
};
</script>
<style lang="scss">
.demo-form {
    .el-form-item--medium .el-form-item__content,
    .el-form-item--medium .el-form-item__label {
        line-height: 30px;
    }
}
</style>