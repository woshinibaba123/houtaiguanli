<template>
    <el-dialog v-el-drag-dialog :title="'疗休养线路'+title" width="650px" :top="baoming?'15vh':'20vh'" :visible="dialogDetail"
        @open="openDialog" @close="closeDialog">
        <h3>线路信息</h3>
        <el-row class="baomingTop">
            <el-form :model="info" ref="info" label-suffix="：" label-width="110px">
                <el-form-item label="线路名称">{{info.title}}</el-form-item>
                <el-form-item label="线路说明" v-if="info.beizhu!=''">
                    <div v-html="info.beizhu"></div>
                </el-form-item>
                <el-col :span="12">
                    <el-form-item label="收费金额">{{info.sf||0}} 元</el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="补贴金额">{{info.bt||0}} 元</el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="疗休养时间">{{info.times[0]}} ~ {{info.times[1]}}</el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="首批报名时间">{{info.bm_times[0]}} ~ {{info.bm_times[1]}}</el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="报名截止时间">{{info.jz_time}}</el-form-item>
                </el-col>
            </el-form>
        </el-row>
        <h3 v-show="baoming">报名信息</h3>
        <el-form v-show="baoming" :model="form" :rules="rules" ref="form" label-width="110px" label-suffix="：">
            <el-col :span="12">
                <el-form-item label="姓名" prop="name">{{form.name}}</el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="工号" prop="account">{{form.account}}</el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="手机号码" prop="phone">
                    <el-input v-model="form.phone" placeholder="填写手机号码" clearable></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="电子邮箱" prop="email">
                    <el-input v-model="form.email" placeholder="填写电子邮箱" clearable></el-input>
                </el-form-item>
            </el-col>
        </el-form>
        <div v-show="baoming" slot="footer" class="dialog-footer">
            <el-button type="primary" icon="el-icon-document" @click="handleSign">报名</el-button>
        </div>
    </el-dialog>
</template>
<script>
import { mapState } from "vuex";
import elDragDialog from "@/directive/el-dragDialog"; //拖拽
import waves from "@/directive/waves"; // 水波纹指令

import { ReadBaoming, Baoming } from "@/api/baoming.js";

const formData = {
    p_id: null,
    name: "",
    account: "",
    email: "",
    phone: ""
};

const infoData = {
    title: "",
    beizhu: "",
    bt: "",
    sf: "",
    bm_times: [],
    times: []
};

export default {
    name: "baoming",
    directives: { elDragDialog, waves },
    props: {
        mid: [Number, String],
        dialogDetail: Boolean,
        baoming: Boolean
    },
    computed: {
        ...mapState(["user"])
    },
    data() {
        return {
            loading: false,
            form: JSON.parse(JSON.stringify(formData)),
            info: JSON.parse(JSON.stringify(infoData)),
            title: "详情",
            rules: {
                phone: [
                    {
                        required: true,
                        message: "请填写手机号码",
                        trigger: "blur"
                    },
                    {
                        pattern: /^1[1-9]\d{9}$/,
                        message: "手机号码格式不正确",
                        trigger: "blur"
                    }
                ]
            }
        };
    },
    methods: {
        //打开弹出框
        openDialog() {
            if (this.baoming) {
                this.form.name = this.user.userinfo.name;
                this.form.account = this.user.userinfo.account;
                this.form.phone = this.user.userinfo.phone;
                this.form.email = this.user.userinfo.email;
                this.title = "报名";
            }
            if (this.mid) {
                this.getRead();
            }
        },
        //报名
        handleSign() {
            this.$confirm("确定要报名当前线路吗？", "系统提示", {
                confirmButtonText: "确定报名",
                showCancelButton: true,
                type: "warning"
            })
                .then(() => {
                    Baoming(this.form).then(res => {
                        this.$message.success("报名成功");
                        this.$emit("CB-dialogDetail", true);
                        this.clearForm();
                    });
                })
                .catch(() => {});
        },
        //读取数据
        getRead() {
            this.loading = true;
            ReadBaoming(this.mid)
                .then(res => {
                    this.loading = false;
                    this.info = res;
                    this.form.p_id = res.id;
                })
                .catch(() => {
                    this.loading = false;
                });
        },
        //关闭弹出框
        closeDialog() {
            this.clearForm();
            this.$emit("CB-dialogDetail");
        },
        //清理表单
        clearForm() {
            this.title = "详情";
            this.form = JSON.parse(JSON.stringify(formData));
            this.info = JSON.parse(JSON.stringify(infoData));
            this.$nextTick(() => {
                this.$refs["form"].resetFields();
            });
        }
    }
};
</script>

<style>
 .baomingTop .el-form-item{
    margin-bottom: 10px
 }
</style>
