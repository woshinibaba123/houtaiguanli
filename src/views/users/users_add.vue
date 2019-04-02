<template>
    <el-dialog v-el-drag-dialog title="添加管理员" width="460px" top="20vh" :visible="dialogFormVisible" @close="cleardialog"
        @open="openDialog" :close-on-click-modal="false">
        <div v-loading="loading" element-loading-text="数据加载中......">
            <el-form :rules="rules" ref="form" @submit.native.prevent :model="form" v-loading="loading" label-width="110px"
                label-suffix="：">
                <el-form-item label="用户组">
                    {{groupTitle}}
                </el-form-item>
                <el-form-item label="教师姓名" prop="name" class="cursorText">
                    <el-select style="width:100%" v-model="form.name" clearable :filterable="true" :remote="true"
                        reserve-keyword placeholder="填入姓名检索" no-data-text="未检索到相关教师信息" :remote-method="handleAccount"
                        :loading="xloading" @change="handleChange">
                        <el-option v-for="item in options" :key="item.value" :label="item.account" :value="item">
                            <el-row>
                                <el-col :span="12">{{item.name}}</el-col>
                                <el-col :span="12" class="text-right text-info">{{item.account}}</el-col>
                            </el-row>
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button v-waves @click="createData" :loading="loadingBiao" type="primary">
                <svg-icon icon-class="keep"></svg-icon> 保存数据
            </el-button>
            <el-button v-waves type="info" icon="el-icon-refresh" @click="resetTemp">重置</el-button>
        </div>
    </el-dialog>
</template>
<script>
import { mapState } from "vuex";
import elDragDialog from "@/directive/el-dragDialog"; //拖拽
import waves from "@/directive/waves"; // 水波纹指令
import { userRead, checkAccount, userInsert } from "@/api/system/user";
var timeout = null;
var i = null;

const form = {
    uid: "",
    account: ""
};
export default {
    directives: { waves, elDragDialog },
    props: {
        dialogFormVisible: Boolean,
        group: [Number, String],
        groupTitle: String,
        usid: [Number, String]
    },
    data() {
        return {
            loading: false,
            xloading: false,
            loadingBiao: false,
            options: [],
            title: "编辑",
            form: JSON.parse(JSON.stringify(form)),
            rules: {
                account: [
                    {
                        required: true,
                        message: "请填写教师工号",
                        trigger: "blur"
                    }
                ]
            }
        };
    },
    methods: {
        //打开
        openDialog() {
            this.form.group = this.group;
            if (this.usid === null) return;
            this.getRead();
        },
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
        handleChange(val) {
            if (val) {
                this.form.account = val.account;
                this.form.name = val.name;
                this.form.uid = val.uid;
            } else {
                this.form.account = "";
                this.form.name = "";
                this.form.uid = "";
            }
        },
        //关闭
        cleardialog() {
            this.resetTemp();
            this.$emit("CB-dialogStatus", false);
        },
        //编辑保存
        createData() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    userInsert(this.form)
                        .then(res => {
                            this.$message({
                                type: "success",
                                message: "保存成功"
                            });
                            this.loadingBiao = false;
                            this.resetTemp();
                            this.$emit("CB-dialogStatus", 1);
                        })
                        .catch(() => {
                            this.loadingBiao = false;
                        });
                }
            });
        },
        //读取数据
        getRead() {
            this.loading = true;
            userRead(this.usid)
                .then(res => {
                    this.form = res;
                    this.showStatus = true;
                    this.loading = false;
                })
                .catch(() => {
                    this.loading = false;
                });
        },
        //重置表单
        resetTemp() {
            this.form = JSON.parse(JSON.stringify(form));
            this.options = [];
            this.$refs["form"].resetFields();
        }
    }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
$dark_gray: #889aa4;

.show-pwd {
    position: absolute;
    right: 10px;
    top: 2px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
}
</style>
<style>
.cursorText input {
    cursor: text !important;
}
</style>
