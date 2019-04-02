<template>
    <span>
        <span v-if="type==='double'">
            <el-date-picker :unlink-panels="true" v-model="value.bm_times" format="yyyy-MM-dd" value-format="yyyy-MM-dd" type="daterange" :picker-options="pickerOptions" :start-placeholder="startTitle" :end-placeholder="endTitle" align="right" style="width: 260px;">
            </el-date-picker>
        </span>
        <span v-if="type==='doubles'">
            <el-date-picker :unlink-panels="true" v-model="value.times" format="yyyy-MM-dd" value-format="yyyy-MM-dd" type="daterange" :picker-options="pickerOptions" :start-placeholder="startTitle" :end-placeholder="endTitle" align="right" style="width: 275px;">
            </el-date-picker>
        </span>
        <span v-else-if="type==='single'">
            <el-date-picker v-model="value.times" :placeholder="title" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" type="datetime" align="right" style="width: 300px;">
            </el-date-picker>
        </span>
        <span v-else-if="type==='singleYear'">
            <el-date-picker v-model="value.nf" :placeholder="title" format="yyyy" value-format="yyyy" type="year" align="right" style="width: 220px;">
            </el-date-picker>
        </span>
    </span>
</template>
<script>
export default {
    props: ["value", "title", "type"],
    data() {
        return {
            pickerOptions: {
                shortcuts: [
                    {
                        text: "最近一周",
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(
                                start.getTime() - 3600 * 1000 * 24 * 7
                            );
                            picker.$emit("pick", [start, end]);
                        }
                    },
                    {
                        text: "最近一个月",
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(
                                start.getTime() - 3600 * 1000 * 24 * 30
                            );
                            picker.$emit("pick", [start, end]);
                        }
                    },
                    {
                        text: "最近三个月",
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(
                                start.getTime() - 3600 * 1000 * 24 * 90
                            );
                            picker.$emit("pick", [start, end]);
                        }
                    }
                ]
            },
            startTitle: (this.title ? this.title : "") + "开始时间",
            endTitle: (this.title ? this.title : "") + "结束时间"
        };
    }
};
</script>

