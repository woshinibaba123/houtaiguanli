<template>
    <div>
        <div class="naver-container" v-bind:style="{'width': sidebar.opened? '200px':'36px' }">
            <div class="margin-right-10">
                <img src="../../../../assets/images/defalut.jpg" class="margin-right-10" alt="">
                <div v-bind:style="{'display': sidebar.opened? 'block':'none' }" class="font-110">疗休养管理系统</div>
            </div>
        </div>
        <scroll-bar style="top:50px">
            <el-menu mode="vertical" :show-timeout="200" :default-active="$route.path" :collapse="isCollapse" background-color="#304156" text-color="#bfcbd9" active-text-color="#409EFF" :unique-opened="true">
                <sidebar-item :routes="permission_routers"></sidebar-item>
            </el-menu>
        </scroll-bar>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import SidebarItem from "./SidebarItem";
import ScrollBar from "@/components/ScrollBar";

export default {
    components: { SidebarItem, ScrollBar },
    computed: {
        ...mapGetters(["permission_routers", "sidebar"]),
        isCollapse() {
            return !this.sidebar.opened;
        }
    }
};
</script>

<style lang="scss" scoped>
.naver-container {
    position: fixed;
    background-color: #1e2e42;
    z-index: 1002;
    height: 50px;
    line-height: 50px;
    top: 0;
    left: 0px;
    font-size: 16px;
    color: aliceblue;
    padding-left: 5px;
    transition-duration: 0.3s;
    div {
        float: left;
    }
    img {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        margin-top: 10px;
        margin-left:-3px;
        float: left;
    }
}
</style>
