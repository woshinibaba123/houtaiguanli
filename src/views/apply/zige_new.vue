<template>
    <el-dialog v-el-drag-dialog :title="title+'资格转让'" top="20vh" width="600px" :visible="dialogStatus" @open="openDialog"
        @close="closeDialog">
        <el-form :model="form" :rules="rules" ref="form" label-width="90px" label-suffix="：">
            <div class="font-110 text-bold margin-left-5">转让人信息</div>
            <el-row class="margin-top-20">
                <el-col :span="12" class="pad-rht">
                    <el-form-item label="姓名" prop="zr_name" v-if="authCheck(58)">
                        <el-select style="width:100%" v-model="form.zr_name" clearable :filterable="true" :remote="true"
                            reserve-keyword placeholder="填入姓名/工号检索" no-data-text="未检索到相关教师信息" :remote-method="handleAccount"
                            :loading="xloading" @change="handleChange($event,'zr')">
                            <el-option v-for="item in options" :key="item.value" :label="item.account" :value="item">
                                <el-row>
                                    <el-col :span="12">{{item.name}}</el-col>
                                    <el-col :span="12" class="text-right text-info">{{item.account}}</el-col>
                                </el-row>
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="工号">
                        <el-input v-model="form.zr_account" disabled placeholder="请检索转让人导入工号"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="所在部门">
                        <el-input v-model="form.zr_xisuo_title" disabled placeholder="请检索转让人导入部门"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <div class="font-110 text-bold margin-left-5">被转让人信息</div>
            <el-row class="margin-top-20">
                <el-col :span="12">
                    <el-form-item label="姓名" prop="js_name" v-if="authCheck(58)">
                        <el-select style="width:100%" v-model="form.js_name" clearable :filterable="true" :remote="true"
                            reserve-keyword placeholder="填入姓名/工号检索" no-data-text="未检索到相关教师信息" :remote-method="handlejsAccount"
                            :loading="xloading" @change="handleChange($event,'js')">
                            <el-option v-for="item in optionData" :key="item.value" :label="item.account" :value="item">
                                <el-row>
                                    <el-col :span="12">{{item.name}}</el-col>
                                    <el-col :span="12" class="text-right text-info">{{item.account}}</el-col>
                                </el-row>
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="工号">
                        <el-input v-model="form.js_account" disabled placeholder="请检索被转让人导入工号"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="所在部门">
                        <el-input v-model="form.js_xisuo_title" disabled placeholder="请检索被转让人导入部门"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" :loading="btn_loading" v-waves v-if="authCheck(70)||authCheck(71)" @click="saveData('form ')">
                <svg-icon icon-class="keep"></svg-icon> 保 存
            </el-button>
        </div>
    </el-dialog>
</template>
<script>
import elDragDialog from "@/directive/el-dragDialog"; //拖拽
import waves from "@/directive/waves"; // 水波纹指令

import { ZigeRead, ZigeEdit } from "@/api/apply";
import { checkAccount } from "@/api/system/user";

const formData = {
    zr_id: null,
    zr_name: "",
    zr_account: "",
    zr_xisuo: "",
    js_id: null,
    js_name: "",
    js_account: "",
    js_xisuo: ""
};

var timeout = null;

export default {
    name: "zige_new",
    props: {
        dialogStatus: Boolean,
        zgid: [String, Number]
    },
    directives: { elDragDialog, waves },
    data() {
        return {
            loading: false,
            xloading: false,
            btn_loading: false,
            title: "新增",
            options: [],
            optionData: [],
            form: JSON.parse(JSON.stringify(formData)),
            rules: {
                zr_name: [
                    {
                        required: true,
                        message: "请填写转让人姓名",
                        trigger: "change"
                    }
                ],
                js_name: [
                    {
                        required: true,
                        message: "请填写被转让人姓名",
                        trigger: "change"
                    }
                ]
            }
        };
    },
    methods: {
        openDialog() {
            if (this.zgid === null || this.zgid === "") return;
            this.title = "编辑";
            this.getRead();
        },
        //检索转让人
        handleAccount(account) {
            if (account.replace(/(^\s*)|(\s*$)/g, "").length > 0) {
                this.xloading = true;
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    checkAccount({ key: account })
                        .then(res => {
                            this.options = res;
                            this.xloading = false;
                        })
                        .catch(() => {
                            this.xloading = false;
                        });
                }, 100);
            }
        },
        //检索被转让人
        handlejsAccount(account) {
            if (account.replace(/(^\s*)|(\s*$)/g, "").length > 0) {
                this.xloading = true;
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    checkAccount({ key: account })
                        .then(res => {
                            this.optionData = res;
                            this.xloading = false;
                        })
                        .catch(() => {
                            this.xloading = false;
                        });
                }, 100);
            }
        },
        handleChange(val, type) {
            if (val) {
                if (type === "zr") {
                    this.form.zr_id = val.uid;
                    this.form.zr_name = val.name;
                    this.form.zr_account = val.account;
                    this.form.zr_xisuo = val.xisuo;
                    this.form.zr_xisuo_title = val.xisuo_title;
                } else if (type === "js") {
                    this.form.js_id = val.uid;
                    this.form.js_name = val.name;
                    this.form.js_account = val.account;
                    this.form.js_xisuo = val.xisuo;
                    this.form.js_xisuo_title = val.xisuo_title;
                }
            } else {
                if (type === "zr") {
                    this.form.zr_id = null;
                    this.form.zr_name = "";
                    this.form.zr_account = "";
                    this.form.zr_xisuo = "";
                } else if (type === "js") {
                    this.form.js_id = null;
                    this.form.js_name = "";
                    this.form.js_account = "";
                    this.form.js_xisuo = "";
                }
            }
        },
        saveData(form) {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    this.btn_loading = true;
                    this.$confirm(
                        "确定要将‘" +
                            this.form.zr_name +
                            "’的疗休养资格转让给‘" +
                            this.form.js_name +
                            "’吗?",
                        "系统提示",
                        {
                            confirmButtonText: "确定转让",
                            showClose: false,
                            type: "warning"
                        }
                    )
                        .then(() => {
                            this.keepData();
                        })
                        .catch(() => {
                            this.btn_loading = false;
                        });
                }
            });
        },
        keepData() {
            let api_type = this.zgid ? "put" : "post";
            let data = JSON.parse(JSON.stringify(this.form));
            ZigeEdit(data, api_type)
                .then(res => {
                    this.$message.success("转让成功！");
                    this.$emit("CB-dialogStatus", true);
                    this.btn_loading = false;
                    this.clearForm();
                })
                .catch(() => {
                    this.btn_loading = false;
                });
        },
        getRead() {
            this.loading = true;
            ZigeRead(this.zgid)
                .then(res => {
                    this.form = res;
                    this.loading = false;
                })
                .catch(() => {
                    this.loading = false;
                });
        },
        closeDialog() {
            this.clearForm();
            this.$emit("CB-dialogStatus");
        },
        clearForm() {
            this.options = [];
            this.optionData = [];
            this.title = "新增";
            this.form = JSON.parse(JSON.stringify(formData));
            this.$nextTick(() => {
                this.$refs["form"].resetFields();
            });
        }
    }
};
</script>
