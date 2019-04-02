<template>
    <div class="login-container">
        <el-form :class="'login-form ' + (labelPosition == 'top' ? 'margin_auto' : '' )" autoComplete="off" :model="loginForm"
            :rules="rules" ref="loginForm" label-position="left">
            <el-card class="box-card" shadow="always" style="width:100%;min-height:400px;">
                <div slot="header" class="clearfix">
                    <div slot="header" class="clearfix">
                        <div class="font-130 text-dark">
                            <div class="margin-10">
                                上海理工大学疗休养管理系统
                            </div>
                        </div>
                    </div>
                </div>
                <div class="text-danger font-90  margin-bottom-10 margin-top-10 margin-bottom-20" style="line-height:20px;">
                    友情提示：推荐使用谷歌、火狐等浏览器，如果您使用的是IE浏览器，请将其升级到9及以上版本。
                </div>
                <el-form-item prop="account">
                    <span class="svg-container svg-container_login">
                        <svg-icon icon-class="user" />
                    </span>
                    <el-input name="account" autoComplete="off" type="text" v-model="loginForm.account" placeholder="登录账号" />
                </el-form-item>

                <el-form-item class="margin-top-30" prop="password">
                    <span class="svg-container">
                        <svg-icon icon-class="password" />
                    </span>
                    <el-input name="password" autoComplete="off" :type="passwordType" @keyup.enter.native="handleLogin()"
                        v-model="loginForm.password" placeholder="登录密码" />
                    <span class="show-pwd" @click="showPwd">
                        <svg-icon :icon-class="icon" />
                    </span>
                </el-form-item>

                <el-radio-group v-model="loginForm.type" class="margin-top-20">
                    <el-radio v-for="(item,index) in shenfen" :key="index" :label="item.id">{{item.title}}</el-radio>
                    <!-- <el-radio label="1">统一身份认证用户</el-radio>
                    <el-radio label="2">系统管理员</el-radio> -->
                </el-radio-group>

                <el-row :gutter="15" class="margin-top-40">
                    <el-button size="large" type="primary" style="width:100%;margin-bottom:30px;" :loading="loading"
                        @click.native.prevent="handleLogin()">登录系统</el-button>
                </el-row>
            </el-card>
        </el-form>
    </div>
</template>

<script>
import { mapState } from "vuex";
import { login } from "@/api/login.js";
import { encrypt } from "@/api/jsencrypt.js";

export default {
    name: "login",
    data() {
        return {
            labelPosition: "right",
            icon: "eye",
            loginForm: {
                account: "",
                password: "",
                type: "1"
            },
            rules: {
                account: [
                    {
                        required: true,
                        message: "请输入登录账号",
                        trigger: "blur"
                    }
                ],
                password: [
                    {
                        required: true,
                        message: "请输入登录密码",
                        trigger: "blur"
                    }
                ]
            },
            passwordType: "password",
            loading: false
        };
    },
    computed: {
        ...mapState(["shenfen"])
    },
    created() {
        if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
            this.labelPosition = "top";
        } else {
            this.labelPosition = "right";
        }
    },
    methods: {
        //注册登录切换
        handType(val) {
            if (val == "unit") {
                this.$router.push({ path: "/unit" });
            } else {
                this.$router.push({ path: "/trainee" });
            }
        },
        showPwd() {
            if (this.passwordType === "password") {
                this.passwordType = "";
                this.icon = "blink";
            } else {
                this.passwordType = "password";
                this.icon = "eye";
            }
        },
        handleLogin(val) {
            this.$refs.loginForm.validate(valid => {
                if (valid) {
                    encrypt(this.loginForm.password)
                        .then(rs => {
                            let data = JSON.parse(
                                JSON.stringify(this.loginForm)
                            );
                            data["password"] = rs;
                            this.loading = true;
                            login(data)
                                .then(rs => {
                                    this.$store.commit("setUserinfo", rs);
                                    this.$router.push({ path: "/" });
                                })
                                .catch(err => {
                                    this.loading = false;
                                });
                        })
                        .catch(() => {
                            this.loading = false;
                        });
                } else {
                    return false;
                }
            });
        }
    }
};
</script>

<style rel="stylesheet/scss" lang="scss">
$bg: #2d3a4b;
$light_gray: rgb(0, 0, 0);

/* reset element-ui css */
.login-container {
    .el-input {
        display: inline-block;
        height: 47px;
        width: 85%;
        input {
            background: transparent;
            border: 0px;
            -webkit-appearance: none;
            border-radius: 0px;
            padding: 12px 5px 12px 15px;
            color: $light_gray;
            height: 47px;
            &:-webkit-autofill {
                -webkit-box-shadow: 0 0 0px 1000px #f1f1f1 inset !important;
                -webkit-text-fill-color: #000 !important;
            }
        }
    }
    .el-form-item {
        border: 1px solid rgba(240, 240, 240, 0.1);
        background: rgb(241, 241, 241);
        border-radius: 5px;
        color: #454545;
    }
    div.el-card__header {
        background-color: #f3f3f3;
        padding: 10px;
    }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: rgb(2, 2, 2);
.margin_auto {
    margin: 0 auto !important;
}

.login-container {
    position: absolute;
    height: 100%;
    width: 100%;
    overflow: auto;
    background-color: $bg;
    .login-form {
        max-width: 549px;
        padding: 35px 25px 15px 35px;
        margin: 120px auto;
    }
    .tips {
        font-size: 16px;
        color: #fff;
        margin-bottom: 10px;
        span {
            &:first-of-type {
                margin-right: 16px;
            }
        }
    }
    .svg-container {
        padding: 6px 5px 6px 15px;
        color: $light_gray;
        vertical-align: middle;
        width: 30px;
        display: inline-block;
        &_login {
            font-size: 20px;
        }
    }
    p {
        line-height: 23px;
        color: #da7c31;
    }

    .show-pwd {
        position: absolute;
        right: 10px;
        top: 7px;
        font-size: 16px;
        color: $dark_gray;
        cursor: pointer;
        user-select: none;
    }
}
</style>
