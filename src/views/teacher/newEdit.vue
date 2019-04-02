<template>
    <el-dialog v-el-drag-dialog :title="title+'教师信息'" width="700px" top="15vh" :visible="dialogTeacher" @open="openDialog"
        @close="closeDialog">
        <el-row>
            <el-form :model="form" :rules="rules" ref="form" label-width="140px" label-suffix="：">
                <el-col :span="12">
                    <el-form-item label="教师姓名">
                        {{form.name||'--'}}
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="教师工号">
                        {{form.account||'--'}}
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="性别">
                        {{form.sex===2?'女':'男'}}
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="出生日期">
                        {{form.csrq||'--'}}
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="所属部门">
                        {{form.xisuo_title||'--'}}
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="入职日期">
                        {{form.rzrq||'--'}}
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="在职状态">
                        {{form.dqzt_title||'--'}}
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="身份证号">
                        {{form.idcard||'--'}}
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-col :span="12">
                        <el-form-item label="手机号码" prop="phone">
                            <el-input v-model="form.phone" placeholder="请填写手机号码" clearable>
                            </el-input>
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
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" :loading="btn_loading" v-waves v-if="authCheck(107)" @click="saveData('form')">
                <svg-icon icon-class="keep"></svg-icon> 确认保存
            </el-button>
        </div>
    </el-dialog>
</template>
<script>
import elDragDialog from "@/directive/el-dragDialog"; //拖拽
import waves from "@/directive/waves"; // 水波纹指令

import { TeacherRead, TeacherNewEdit } from "@/api/teacher";

const formData = {
    name: "",
    account: "",
    sex: 1,
    csrq: "",
    xisuo_title: "",
    rzrq: "",
    phone: "",
    email: "",
    status: "",
    idcard:''
};

export default {
    name: "teacher_newEdit",
    props: {
        dialogTeacher:Boolean,
        tcid: [String, Number]
    },
    directives: { elDragDialog, waves },
    data() {
        return {
            laoding: false,
            btn_loading: false,
            title: "新增",
            form: JSON.parse(JSON.stringify(formData)),
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
                ],
                email: [
                    {
                        type: "email",
                        message: "电子邮箱格式不正确",
                        trigger: "blur"
                    }
                ]
            }
        };
    },
    methods: {
        openDialog() {
            if (this.tcid === null) return;
            this.title = "编辑";
            this.getRead();
        },
        //保存
        saveData(form) {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    this.btn_loading = true;
                    let api_type = this.tcid ? "put" : "post";
                    let data = JSON.parse(JSON.stringify(this.form));
                    TeacherNewEdit(data, api_type)
                        .then(res => {
                            this.$message.success("保存成功！");
                            this.$emit("CB-dialogTeacher", false);
                            this.clearForm();
                            this.btn_loading = false;
                        })
                        .catch(() => {
                            this.btn_loading = false;
                        });
                }
            });
        },
        //读取数据
        getRead() {
            this.laoding = true;
            TeacherRead(this.tcid)
                .then(res => {
                    this.laoding = false;
                    this.form = res;
                })
                .catch(() => {
                    this.laoding = false;
                });
        },
        //关闭弹出框
        closeDialog() {
            // this.clearForm();
            this.$emit("CB-dialogTeacher",false);
            this.clearForm();
            // console.log("111")
        },
        //清理表单
        clearForm() {
            this.form = JSON.parse(JSON.stringify(formData));
            this.title = "新增";
            this.$refs["form"].resetFields();
        }
    }
};
</script>
