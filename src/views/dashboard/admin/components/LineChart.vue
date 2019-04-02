<template>
    <div v-loading="loading" element-loading-text="拼命加载中">
        <el-select v-model="group" clearable placeholder="不限注册类型" class="margin-bottom-10 pull-left" @change="getData">
            <el-option v-for="(item,index) in typeData" :key="index" :label="item.title" :value="item.id"></el-option>
        </el-select>
        <el-date-picker v-model="start_time" align="right" value-format="yyyy-MM-dd" format="yyyy-MM-dd" type="date"
            placeholder="选择开始日期" @change="getData">
        </el-date-picker>
        <el-date-picker v-model="end_time" align="right" value-format="yyyy-MM-dd" format="yyyy-MM-dd" type="date"
            placeholder="选择结束日期" @change="getData">
        </el-date-picker>
        <div :id="idName" :style="{height:height,width:width}"></div>
    </div>
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import { debounce } from "@/utils";
import { mapState } from "vuex";
import { dashboardLine } from "@/api/dashboard";

export default {
    props: {
        idName: {
            type: String,
            default: "index_line"
        },
        width: {
            type: String,
            default: "100%"
        },
        height: {
            type: String,
            default: "350px"
        },
        autoResize: {
            type: Boolean,
            default: true
        },
        chartData: {
            type: Object
        }
    },
    computed: {
        ...mapState(["typeData"])
    },
    data() {
        return {
            chart: null,
            loading: false,
            data: [],
            date: [],
            time: "",
            group: null,
            start_time: "",
            end_time: ""
        };
    },
    activated() {
        this.getData();
    },
    mounted() {
        this.initChart();
        if (this.autoResize) {
            this.__resizeHanlder = debounce(() => {
                if (this.chart) {
                    this.chart.resize();
                }
            }, 100);
            window.addEventListener("resize", this.__resizeHanlder);
        }

        // 监听侧边栏的变化
        const sidebarElm = document.getElementsByClassName(
            "sidebar-container"
        )[0];
        sidebarElm.addEventListener("transitionend", this.__resizeHanlder);
    },
    beforeDestroy() {
        if (!this.chart) {
            return;
        }
        if (this.autoResize) {
            window.removeEventListener("resize", this.__resizeHanlder);
        }

        const sidebarElm = document.getElementsByClassName(
            "sidebar-container"
        )[0];
        if (sidebarElm) {
            sidebarElm.removeEventListener(
                "transitionend",
                this.__resizeHanlder
            );
        }

        this.chart.dispose();
        this.chart = null;
    },
    methods: {
        setOptions(data, date) {
            this.chart.setOption({
                xAxis: {
                    data: date,
                    boundaryGap: false,
                    axisTick: {
                        show: false
                    }
                },
                grid: {
                    left: 10,
                    right: 10,
                    bottom: 20,
                    top: 30,
                    containLabel: true
                },
                tooltip: {
                    trigger: "axis",
                    axisPointer: {
                        type: "cross"
                    },
                    padding: [5, 10]
                },
                yAxis: {
                    axisTick: {
                        show: false
                    }
                },
                legend: {
                    data: ["expected"]
                },
                series: [
                    {
                        name: "注册数量",
                        itemStyle: {
                            normal: {
                                color: "#FF005A",
                                lineStyle: {
                                    color: "#FF005A",
                                    width: 2
                                }
                            }
                        },
                        smooth: true,
                        type: "line",
                        data: data,
                        animationDuration: 2800,
                        animationEasing: "cubicInOut"
                    }
                ]
            });
        },
        initChart() {
            this.chart = echarts.init(
                document.getElementById(this.idName),
                "macarons"
            );
        },
        getData() {
            this.data = [];
            this.date = [];
            this.loading = true;
            dashboardLine({
                group: this.group,
                start_time: this.start_time,
                end_time: this.end_time
            })
                .then(rs => {
                    for (var i in rs) {
                        this.data.push(rs[i].count);
                        this.date.push(rs[i].day);
                    }
                    this.setOptions(this.data, this.date);
                    this.loading = false;
                })
                .catch(err => {
                    this.loading = false;
                });
        }
    }
};
</script>
