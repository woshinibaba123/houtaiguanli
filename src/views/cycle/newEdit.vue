<template>
    <el-dialog v-el-drag-dialog :title="title+'疗休养周期'" width="400px" top="20vh" :visible="dialogStatus" @open="openDialog"
        @close="closeDialog">
        <el-form :model="form" :rules="rules" ref="form" label-width="110px" label-suffix="：">
            <el-form-item label="开始年份" prop="start_time">
                <el-date-picker v-model="form.start_time" :picker-options="pickerOptions" type="year" placeholder="选择开始年份"
                    format="yyyy" value-format="yyyy" @change="startChange"></el-date-picker>
            </el-form-item>
            <el-form-item label="结束年份" prop="end_time">
                <el-date-picker v-model="form.end_time" disabled type="year" placeholder="结束年份" format="yyyy"
                    value-format="yyyy"></el-date-picker>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" :loading="btn_loading" v-waves v-if="authCheck(44)||authCheck(46)" @click="saveData('form ')">
                <svg-icon icon-class="keep"></svg-icon>确认保存
            </el-button>
        </div>
    </el-dialog>
</template>
<script>
import elDragDialog from "@/directive/el-dragDialog"; //拖拽
import waves from "@/directive/waves"; // 水波纹指令

import { cycleRead, cyclenewEdit } from "@/api/cycle";

const formData = {
    start_time: "",
    end_time: ""
};

export default {
    name: "cycle_newEdit",
    props: {
        dialogStatus: Boolean,
        lxyid: [String, Number]
    },
    directives: { elDragDialog, waves },
    data() {
        return {
            laoding: false,
            btn_loading: false,
            title: "编辑",
            form: JSON.parse(JSON.stringify(formData)),
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() < Date.now();
                }
            },
            rules: {
                start_time: [
                    {
                        required: true,
                        message: "请选择开始年份",
                        trigger: "change"
                    }
                ],
                end_time: [
                    {
                        required: true,
                        message: "请选择开始年份",
                        trigger: "change"
                    }
                ]
            }
        };
    },
    methods: {
        openDialog() {
            if (this.lxyid === null) return;
            this.title = "编辑";
            this.getRead();
        },
        //开始年份
        startChange(val) {
            if (val) {
                this.form.end_time = (parseInt(val) + 3).toString();
            }
        },
        //保存
        saveData(form) {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    this.btn_loading = true;
                    let api_type = this.lxyid ? "put" : "post";
                    let data = JSON.parse(JSON.stringify(this.form));
                    data["times"] = [data["start_time"], data["end_time"]];
                    delete data["start_time"];
                    delete data["end_time"];
                    cyclenewEdit(data, api_type)
                        .then(res => {
                            this.$message.success("保存成功！");
                            this.$emit("CB-dialogStatus", true);
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
            cycleRead(this.lxyid)
                .then(res => {
                    this.laoding = false;
                    this.form.id = res.id;
                    this.form.start_time = res.times[0];
                    this.form.end_time = res.times[1];
                })
                .catch(() => {
                    this.laoding = false;
                });
        },
        //关闭弹出框
        closeDialog() {
            this.clearForm();
            this.$emit("CB-dialogStatus");
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
