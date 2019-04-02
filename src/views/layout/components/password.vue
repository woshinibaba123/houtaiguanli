<template>
    <el-dialog v-el-drag-dialog title="修改密码" class="zIndex" width="520px" top="30vh" :visible="passwordDialog" @close="closeDialog"
        @open="openDialog" :close-on-click-modal="false" :close-on-press-escape="false" :modal-append-to-body='false'>
        <el-form :rules="rules" ref="form" :model="form" v-loading="loading" label-width="120px" label-suffix="："
            @submit.native.prevent>
            <el-form-item label="旧密码" prop="oldpwd">
                <el-input v-model="form.oldpwd" placeholder="请填写旧密码" type="password" autoComplete="off" clearable></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="newpwd">
                <el-input v-model="form.newpwd" placeholder="请填写新密码（6-16位）" :type="newpwdType" autoComplete="off"></el-input>
                <span class="show-pwd" @click="showPwd('newpwd')">
                    <svg-icon :icon-class="newpwdIcon" />
                </span>
            </el-form-item>
            <el-form-item label="确认新密码" prop="confirmpwd">
                <el-input v-model="form.confirmpwd" placeholder="请再次填写新密码（6-16位）" :type="confirmpwdType" autoComplete="off"></el-input>
                <span class="show-pwd" @click="showPwd('confirmpwd')">
                    <svg-icon :icon-class="confirmpwdIcon" />
                </span>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button v-waves @click="createData" icon="fa fa-floppy-o" :loading="loadingBiao" type="primary">
                <svg-icon icon-class="keep"></svg-icon> 保存
            </el-button>
        </div>
    </el-dialog>
</template>
<script>
import waves from "@/directive/waves"; // 水波纹指令
import { changepwd } from "@/api/system/user";
import { encrypt } from "@/api/jsencrypt";
import elDragDialog from "@/directive/el-dragDialog"; //拖拽
export default {
    directives: {
        waves,
        elDragDialog
    },
    props: ["passwordDialog"],
    data() {
        return {
            loading: false,
            loadingBiao: false,
            newpwdType: "password",
            newpwdIcon: "eye",
            confirmpwdType: "password",
            confirmpwdIcon: "eye",
            form: {
                oldpwd: "",
                newpwd: "",
                confirmpwd: ""
            },
            rules: {
                oldpwd: [
                    {
                        required: true,
                        message: "请填写旧密码!",
                        trigger: "blur"
                    }
                ],
                newpwd: [
                    {
                        required: true,
                        message: "请填写新密码!",
                        trigger: "blur"
                    },
                    {
                        min: 6,
                        message: "密码最小为6位！",
                        trigger: "blur"
                    },
                    {
                        max: 16,
                        message: "密码最大设置为16位！",
                        trigger: "change"
                    }
                ],
                confirmpwd: [
                    {
                        required: true,
                        message: "请再次填写新密码!",
                        trigger: "blur"
                    },
                    {
                        min: 6,
                        message: "密码最小为6位！",
                        trigger: "blur"
                    },
                    {
                        max: 16,
                        message: "密码最大设置为16位！",
                        trigger: "change"
                    }
                ]
            }
        };
    },
    methods: {
        //打开
        openDialog() {},
        //关闭
        closeDialog() {
            this.$emit("CB-passwordDialog", false);
            this.$refs["form"].resetFields();
        },
        showPwd(passtype) {
            if (passtype == "newpwd") {
                if (this.newpwdType === "password") {
                    this.newpwdType = "";
                    this.newpwdIcon = "blink";
                } else {
                    this.newpwdType = "password";
                    this.newpwdIcon = "eye";
                }
            } else {
                if (this.confirmpwdType === "password") {
                    this.confirmpwdType = "";
                    this.confirmpwdIcon = "blink";
                } else {
                    this.confirmpwdType = "password";
                    this.confirmpwdIcon = "eye";
                }
            }
        },
        async save() {
            try {
                this.loadingBiao = true;
                const oldpwd = await encrypt(this.form.oldpwd);
                const newpwd = await encrypt(this.form.newpwd);
                const confirmpwd = await encrypt(this.form.confirmpwd);
                changepwd({
                    oldpwd: oldpwd,
                    newpwd: newpwd,
                    confirmpwd: confirmpwd
                })
                    .then(rs => {
                        this.$message({
                            type: "success",
                            message: "密码修改成功，即将退出请重新登录！"
                        });
                        this.loadingBiao = false;
                        this.$emit("CB-passwordDialog", false);
                        this.$refs["form"].resetFields();
                        this.$store.dispatch("setUserinfo", {
                            userinfo: {},
                            rules: []
                        });
                        this.$store.dispatch("setRoles", []);
                        this.$store.dispatch("setRouters", []);
                        this.$store.dispatch("setAddRouters", []);
                        this.$router.push({
                            name: "login"
                        });
                    })
                    .catch(() => {
                        this.loadingBiao = false;
                    });
            } catch (e) {
                this.loadingBiao = false;
            }
        },
        //编辑保存
        createData() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    if (this.form.newpwd !== this.form.confirmpwd) {
                        this.$message.error("您两次输入的密码不一致！");
                        return;
                    }
                    this.save();
                }
            });
        }
    }
};
</script>
<style lang="scss" scoped>
.show-pwd {
    position: absolute;
    right: 10px;
    top: 2px;
    font-size: 16px;
    cursor: pointer;
    user-select: none;
}
</style>
<style>

</style>

