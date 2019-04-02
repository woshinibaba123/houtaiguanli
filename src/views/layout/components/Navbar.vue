<template>
    <el-menu class="navbar" mode="horizontal">
        <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>

        <breadcrumb class="breadcrumb-container hidden-xs-only"></breadcrumb>

        <div class="right-menu">
            <keep-alive>
                <RoleChange class="role-change right-menu-item"></RoleChange>
            </keep-alive>

            <el-tooltip effect="dark" content="查看Bug" placement="bottom" class="hidden-xs-only">
                <error-log class="errLog-container right-menu-item"></error-log>
            </el-tooltip>

            <el-tooltip effect="dark" content="全屏" placement="bottom" class="hidden-xs-only">
                <screenfull class="screenfull right-menu-item"></screenfull>
            </el-tooltip>

            <el-tooltip effect="dark" content="换肤" placement="bottom" class="hidden-xs-only">
                <theme-picker class="theme-switch right-menu-item"></theme-picker>
            </el-tooltip>

            <el-dropdown class="avatar-container right-menu-item" trigger="click" @command="handleCommand">
                <div class="avatar-wrapper">
                    <img class="user-avatar" :src="head" :onerror="defaultImg">
                </div>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="1" v-if="authCheck(39)">
                        <svg-icon icon-class="headImg" /> 修改头像
                    </el-dropdown-item>
                    <el-dropdown-item command="4" v-if="authCheck(37)">
                        <svg-icon icon-class="edit" /> 修改资料
                    </el-dropdown-item>
                    <el-dropdown-item command="2" v-if="authCheck(38)">
                        <svg-icon icon-class="password"></svg-icon> 修改密码
                    </el-dropdown-item>
                    <el-dropdown-item divided command="3">
                        <span style="display:block;">
                            <svg-icon icon-class="loginout"></svg-icon> 退出登录
                        </span>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <!-- 修改头像 -->
            <gaiInfoImg :dialogImg="dialogImg" @CB-dialogImg="CB_dialogImg"></gaiInfoImg>
            <!-- 修改密码 -->
            <Password :passwordDialog="passwordDialog" @CB-passwordDialog="CB_passwordDialog"></Password>
            <gai-info :dialogForm="dialogForm" @CB-dialogForm="CB_dialogForm"></gai-info>
        </div>
    </el-menu>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import ErrorLog from "@/components/ErrorLog";
import Screenfull from "@/components/Screenfull";
import ThemePicker from "@/components/ThemePicker";
import RoleChange from "./roleChange";
import Password from "./password.vue";
import gaiInfoImg from "./gaiInfo_img";
import * as Driver from "driver.js"; // import driver.js
import "driver.js/dist/driver.min.css"; // import driver.js css
import gaiInfo from "./gaiInfo";

export default {
    data() {
        return {
            defaultImg:
                'this.src="' + require("@/assets/images/nophoto.png") + '"',
            passwordDialog: false,
            dialogImg: false,
            driver: null,
            dialogForm: false
        };
    },
    components: {
        Breadcrumb,
        Hamburger,
        ErrorLog,
        Screenfull,
        ThemePicker,
        Password,
        RoleChange,
        gaiInfoImg,
        gaiInfo
    },
    mounted() {
        this.driver = new Driver();
        if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
        } else {
            if (
                this.roleData.length > 0 &&
                (this.guide_show == 2 || !this.guide_show)
            ) {
                this.guide();
            }
        }
    },
    computed: {
        ...mapState({
            userinfo: state => state.user.userinfo,
            guide_show: state => state.guide_show,
            roleData: state => state.roleData
        }),
        ...mapGetters(["sidebar", "name", "head"])
    },
    methods: {
        toggleSideBar() {
            this.$store.dispatch("toggleSideBar");
        },
        //下拉选中
        handleCommand(val) {
            if (val === "1") {
                this.dialogImg = true;
            } else if (val === "2") {
                this.passwordDialog = true;
            } else if (val === "3") {
                this.logout();
            } else if (val === "4") {
                this.dialogForm = true;
            }
        },
        //修改资料弹框回调
        CB_dialogForm() {
            this.dialogForm = false;
        },
        //更改密码弹框回调
        CB_passwordDialog() {
            this.passwordDialog = false;
        },
        //更改头像弹框回调
        CB_dialogImg(val) {
            this.dialogImg = false;
        },
        //引导
        guide() {
            this.driver.defineSteps([
                {
                    element: ".role-change",
                    popover: {
                        title: "切换角色",
                        description: "点击此处，可切换不同角色登录本系统！",
                        position: "bottom"
                    }
                }
            ]);
            this.driver.start();
            this.$store.commit("setGuide", "1");
        }
    }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
    height: 50px;
    line-height: 50px;
    border-radius: 0px !important;
    z-index: 1999;
    .hamburger-container {
        line-height: 58px;
        height: 50px;
        float: left;
        padding: 0 10px;
    }
    .breadcrumb-container {
        float: left;
    }
    .role-change {
        vertical-align: top;
    }
    .errLog-container {
        display: inline-block;
        vertical-align: top;
    }
    .right-menu {
        float: right;
        height: 100%;
        &:focus {
            outline: none;
        }
        .right-menu-item {
            display: inline-block;
            margin: 0 8px;
        }
        .screenfull {
            height: 20px;
        }
        .international {
            vertical-align: top;
        }
        .theme-switch {
            vertical-align: 15px;
        }
        .avatar-container {
            height: 50px;
            margin-right: 30px;
            .avatar-wrapper {
                cursor: pointer;
                margin-top: 5px;
                position: relative;
                .user-avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                }
                .el-icon-caret-bottom {
                    position: absolute;
                    right: -20px;
                    top: 25px;
                    font-size: 12px;
                }
            }
        }
    }
}
</style>
