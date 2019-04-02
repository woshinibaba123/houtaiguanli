<template>
    <el-button waves type="danger" icon="el-icon-d-arrow-left" @click="goBack">返回上一页</el-button>
</template>
<script>
import waves from "@/directive/waves"; // 水波纹指令
export default {
    directives: {
        waves
    },
    methods: {
        goBack() {
            this.$router.go(-1);
        }
    },
    props: ["btn"]
};
</script>
