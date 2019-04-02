<template>
    <span class="filter-item demo-select">
        <el-select v-model="values.xisuo" placeholder="不限部门" clearable filterable>
            <el-option v-for="(item,index) in schoolData" :key="index" :label="item.xisuo_title" :value="item.xisuo"></el-option>
        </el-select>
    </span>
</template>
<script>
import { mapState } from "vuex";
export default {
    name: "select_index",
    props: {
        values: Object,
        defalt: { xisuo: "" }
    },
    computed: {
        ...mapState(["schoolData"])
    }
};
</script>
<style>
.demo-select input {
    cursor: text !important;
}
</style>

