<template>
    <el-dialog title="导航栏信息" width="580px" top="25vh" :visible="dialogStatus" close-on-press-escape @close="cleardialog" @open="openDialog">
        <el-form :model="form" label-width="150px" :rules="rules" ref="form" v-loading="loading" element-loading-text="数据载入中">
            <el-form-item label="上级类别名称" required>
                <el-cascader :options="options" change-on-select v-model="form.path" :props="props" style="width:100%" size="medium"></el-cascader>
            </el-form-item>
            <el-form-item label="规则名称" prop="title">
                <el-input v-model="form.title" placeholder="请填写规则名称" size="medium"></el-input>
            </el-form-item>
            <el-form-item label="接口标识" prop="name">
                <el-input v-model="form.name" placeholder="请填写接口标识" size="medium"></el-input>
            </el-form-item>
            <el-form-item label="路由标识" prop="api_name">
                <el-input v-model="form.api_name" @keyup.enter.native="handleBaocun()" placeholder="请填写规则标识" size="medium"></el-input>
            </el-form-item>
            <el-form-item label="传值方式" prop="method">
                <el-select placeholder="请选择传值方式" v-model="form.method" filterable clearable size="medium">
                    <el-option v-for="item in methodData" :label="item.title" :value="item.title" :key="item.title">
                        <i :class="item.title"></i> {{item.title}}
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" v-if="!loading">
            <el-button type="primary" :loading="vloading" @click="handleBaocun()"><svg-icon icon-class="keep"></svg-icon> 确认保存</el-button>
        </div>
    </el-dialog>
</template>
<script>
import { mapState } from "vuex";
import { nodeRead, nodeWrite, nodeList } from "@/api/system/node";

const form = {
    name: "",
    api_name: "",
    title: "",
    path: [],
    method: ""
};
export default {
    props: ["dialogStatus", "nodeid", "path"],
    data() {
        return {
            vloading: false,
            loading: false,
            form: form,
            options: [],
            props: {
                value: "id",
                label: "title",
                children: "children"
            },
            rules: {
                title: [
                    {
                        required: true,
                        message: "请填写规则名称",
                        trigger: "blur"
                    }
                ],
                name: [
                    {
                        required: true,
                        message: "请填写接口标识",
                        trigger: "blur"
                    }
                ]
            }
        };
    },
    methods: {
        openDialog() {
            this.getSelect();
            if (this.nodeid) {
                this.getRead();
            }
            if (this.path && this.path.length > 0) {
                this.form.path = this.path;
            }
        },
        //提交
        handleBaocun() {
            this.vloading = true;
            let api_type = "";
            if (typeof this.nodeid == "number") {
                api_type = "put";
            } else {
                api_type = "post";
            }
            this.$refs["form"].validate(valid => {
                if (valid) {
                    nodeWrite(this.form, api_type)
                        .then(rs => {
                            this.$message({
                                type: "success",
                                message: "保存成功"
                            });
                            this.vloading = false;
                            this.clearForm();
                            this.$emit("CB-dialogStatus", true);
                        })
                        .catch(() => {
                            this.vloading = false;
                        });
                } else {
                    this.vloading = false;
                }
            });
        },
        //菜单下拉列表
        getSelect() {
            this.loading = true;
            nodeList()
                .then(rs => {
                    this.options = [
                        {
                            id: 0,
                            title: "作为一级菜单",
                            children: rs
                        }
                    ];
                    this.loading = false;
                })
                .catch(() => {
                    this.loading = false;
                });
        },
        //获取详情
        getRead() {
            this.loading = true;
            nodeRead(this.nodeid)
                .then(rs => {
                    this.form = rs;
                    this.loading = false;
                })
                .catch(() => {
                    this.loading = false;
                });
        },
        //关闭弹框
        cleardialog() {
            this.clearForm();
            this.$emit("CB-dialogStatus", false);
        },
        //清理表单
        clearForm() {
            this.form = form;
            this.form.path = [];
            this.$refs["form"].resetFields();
        }
    },
    computed: mapState({
        methodData: state => state.methodData
    })
};
</script>
