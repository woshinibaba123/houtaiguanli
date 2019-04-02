<template>
    <el-dialog v-el-drag-dialog :title="title+'分团'" top="20vh" width="500px" :visible="dialogStatus" @open="openDialog"
        @close="closeDialog">
        <el-form :model="form" :rules="rules" ref="form" label-width="100px" label-suffix="：">
            <el-row>
                <el-col :span="24">
                    <el-form-item label="线路名称" class="wrap">
                        {{newTitle}}
                    </el-form-item>
                    <el-form-item label="线路说明" class="wrap">
                        <span v-html="Trim(shuoming)"></span>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="分团名称" prop="title">
                        <el-input v-model="form.title" clearable placeholder="填写分团名称" :maxlength="100"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="领队信息" prop="ld">
                        <el-input v-model="form.ld" clearable placeholder="填写领队信息"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="出行时间" prop="times" class="demo-time">
                        <el-date-picker v-model="form.times" type="datetimerange" style="width:100%" :picker-options="pickerOptions"
                            range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd" unlink-panels align="right">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" :loading="btn_loading" v-waves v-if="authCheck(78)||authCheck(80)" @click="saveData('form')">
                <svg-icon icon-class="keep"></svg-icon> 确认保存
            </el-button>
        </div>
    </el-dialog>
</template>
<script>
import elDragDialog from "@/directive/el-dragDialog"; //拖拽
import waves from "@/directive/waves"; // 水波纹指令

import { TeamRead, TeamNewEdit } from "@/api/line";

const formData = {
    title: "",
    ld: "",
    times: []
};

var timeout = null;

export default {
    name: "zige_new",
    props: {
        dialogStatus: Boolean,
        tdid: [String, Number],
        xlid: [String, Number],
        newTitle: String,
        shuoming: String,
        start_time: String,
        end_time: String
    },
    computed: {
        pickerOptions() {
            let _this = this;
            return {
                disabledDate(time) {
                    return (
                        Date.parse(_this.start_time) >=
                            time.getTime() + 86400000 ||
                        Date.parse(_this.end_time) <= time.getTime()
                    );
                }
            };
        }
    },
    directives: { elDragDialog, waves },
    data() {
        return {
            loading: false,
            btn_loading: false,
            title: "新增",
            form: JSON.parse(JSON.stringify(formData)),
            rules: {
                title: [
                    {
                        required: true,
                        message: "请填写分团名称",
                        trigger: "blur"
                    },
                    {
                        max: 100,
                        message: "分团名称字数不超过100字",
                        trigger: "blur"
                    }
                ],
                ld: [
                    {
                        required: true,
                        message: "请填写领队信息",
                        trigger: "blur"
                    },
                    {
                        max: 100,
                        message: "领队信息字数不超过100字",
                        trigger: "blur"
                    }
                ],
                times: [
                    {
                        required: true,
                        message: "请选择分团时间",
                        trigger: "change"
                    }
                ]
            }
        };
    },
    methods: {
        openDialog() {
            if (this.tdid === null || this.tdid === "") return;
            this.title = "编辑";
            this.getRead();
        },
        saveData(form) {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    this.btn_loading = true;
                    if (!this.tdid) {
                        this.form.p_id = this.xlid;
                    }
                    let api_type = this.tdid ? "put" : "post";
                    let data = JSON.parse(JSON.stringify(this.form));
                    TeamNewEdit(data, api_type)
                        .then(res => {
                            this.$message.success("保存成功！");
                            this.$emit("CB-dialogStatus", true);
                            this.btn_loading = false;
                            this.clearForm();
                        })
                        .catch(() => {
                            this.btn_loading = false;
                        });
                }
            });
        },
        getRead() {
            this.loading = true;
            TeamRead(this.tdid)
                .then(res => {
                    this.form = res;
                    this.form.times = [res.start_time, res.end_time];
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
            this.title = "新增";
            this.form = JSON.parse(JSON.stringify(formData));
            this.$refs["form"].resetFields();
        }
    }
};
</script>
<style lang="scss">
.demo-time {
    .el-date-editor {
        .el-range-separator {
            padding: 0 30px 0 5px;
        }
    }
}
</style>
