<template>
    <el-dialog v-el-drag-dialog :title="title+'线路'" width="700px" top="15vh" :visible="dialogLine" @open="openDialog"
        @close="closeDialog">
        <el-form :model="form" :rules="rules" ref="form" label-width="140px" label-suffix="：" v-loading="laoding">
            <el-form-item label="年份" prop="nf">
                <el-select style="width:200px" v-model="form.nf" placeholder="选择年份" filterable clearable>
                    <el-option v-for="(item,index) in nianfenData" :key="index" :value="item" :label="item"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="线路名称" prop="title">
                <el-input v-model="form.title" placeholder="填写线路名称" :maxlength="100" clearable></el-input>
            </el-form-item>
            <el-form-item label="线路说明" prop="beizhu">
                <el-input type="textarea" v-model="form.beizhu" placeholder="填写线路说明" :autosize="{ minRows: 3}"
                    :maxlength="100" clearable></el-input>
                剩 {{300-form.beizhu.length}} 字
            </el-form-item>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="收费金额（元）" prop="sf">
                        <el-input-number v-model="form.sf" :precision="2" placeholder="填写收费金额" :controls="false"
                            clearable></el-input-number>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="补贴金额（元）" prop="bt">
                        <el-input-number v-model="form.bt" :precision="2" placeholder="填写补贴金额" :controls="false"
                            clearable></el-input-number>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="疗休养时间" prop="times">
                <el-date-picker v-model="form.times" type="daterange" style="width:100%" :picker-options="pickerOptions"
                    range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd" unlink-panels align="right">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="首批报名时间" prop="bm_times">
                <el-date-picker v-model="form.bm_times" type="daterange" style="width:100%" :picker-options="pickerOptions"
                    range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd" unlink-panels align="right" @change="bmtimeChange">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="报名截止时间" prop="jz_time">
                <el-date-picker v-model="form.jz_time" type="date" placeholder="选择报名截止时间" format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd">
                </el-date-picker>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" :loading="btn_loading" v-waves v-if="authCheck(63)||authCheck(65)" @click="saveData('form ')">
                <svg-icon icon-class="keep"></svg-icon> 确认保存
            </el-button>
        </div>
    </el-dialog>
</template>
<script>
import elDragDialog from "@/directive/el-dragDialog"; //拖拽
import waves from "@/directive/waves"; // 水波纹指令

import { LineRead, LineEdit } from "@/api/line";
import { mapState } from "vuex";

const formData = {
    nf: new Date().getFullYear().toString(),
    title: "",
    beizhu: "",
    sf: null,
    bt: null,
    times: [],
    bm_times: [],
    jz_time: ""
};

export default {
    name: "cycle_newEdit",
    props: {
        dialogLine: Boolean,
        liid: [String, Number]
    },
    computed: {
        ...mapState(["nianfenData"]),
        pickerOptions() {
            let _this = this;
            return {
                disabledDate(time) {
                    return (
                        Date.parse(_this.form.nf + "/01/01") > time.getTime() ||
                        Date.parse(_this.form.nf + "/12/31") < time.getTime()
                    );
                }
            };
        }
    },
    directives: { elDragDialog, waves },
    data() {
        return {
            laoding: false,
            btn_loading: false,
            title: "编辑",
            form: JSON.parse(JSON.stringify(formData)),
            rules: {
                nf: [
                    {
                        required: true,
                        message: "请选择年份",
                        trigger: "change"
                    }
                ],
                title: [
                    {
                        required: true,
                        message: "请填写线路名称",
                        trigger: "blur"
                    },
                    {
                        max: 100,
                        message: "线路名称不超过100字",
                        trigger: "blur"
                    }
                ],
                sf: [
                    {
                        required: true,
                        message: "请填写收费金额",
                        trigger: "blur"
                    }
                ],
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
            if (this.liid === null) return;
            this.title = "编辑";
            this.getRead();
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
        //保存
        saveData(form) {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    this.btn_loading = true;
                    let api_type = this.liid ? "put" : "post";
                    let data = JSON.parse(JSON.stringify(this.form));
                    LineEdit(data, api_type)
                        .then(res => {
                            this.$message.success("保存成功！");
                            this.$emit("CB-dialogLine", true);
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
            LineRead(this.liid)
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
            this.clearForm();
            this.$emit("CB-dialogLine");
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
