<template>
    <div class="app-wrapper" :class="{hideSidebar:!sidebar.opened}">
        <sidebar class="sidebar-container"></sidebar>
        <div class="main-container">
            <navbar></navbar>
            <tags-view></tags-view>
            <keep-alive>
                <app-main></app-main>
            </keep-alive>
        </div>
        <back-to-top transitionName="fade" :visibilityHeight="200" :backPosition="50"></back-to-top>
    </div>
</template>

<script>
import { Navbar, Sidebar, AppMain, TagsView } from "./components";
import { getschool } from "@/api/download.js";
import BackToTop from "@/components/BackToTop";
import ResizeMixin from "./mixin/ResizeHandler";

import Vue from "vue";

export default {
    name: "layout",
    components: {
        Navbar,
        Sidebar,
        AppMain,
        TagsView,
        BackToTop
    },
    mixins: [ResizeMixin],
    created() {
        if (this.authCheck(106)) {
            this.getSchool();
        }

        this.resizeHandler();
        this.$store.commit(
            "setHeight",
            document.documentElement.clientHeight - 105
        );
    },
    computed: {
        sidebar() {
            return this.$store.state.app.sidebar;
        }
    },
    methods: {
        getSchool() {
            getschool().then(res => {
                this.$store.dispatch("setSchool", res);
            });
        }
    },
    mounted() {
        const that = this;
        window.onresize = function temp() {
            that.$store.commit(
                "setHeight",
                document.documentElement.clientHeight - 105
            );
        };
    }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
}
</style>
