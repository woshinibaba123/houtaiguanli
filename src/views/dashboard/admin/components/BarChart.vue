<template>
    <div v-loading="loading" element-loading-text="拼命加载中">
        <el-select v-model="zqid" clearable placeholder="不限周期" class="margin-bottom-10 pull-left" @change="getData">
            <el-option v-for="(item,index) in typeData" :key="index" :label="item.title" :value="item.id"></el-option>
        </el-select>
        <div :id="idName" :style="{height:height,width:width}"></div>
    </div>
</template>

<script>
import echarts from "echarts";
import { getPillar, getZhouq } from "@/api/dashboard.js";
require("echarts/theme/macarons"); // echarts theme
import { debounce } from "@/utils";

const animationDuration = 6000;

export default {
    props: {
        idName: {
            type: String,
            default: "chart"
        },
        width: {
            type: String,
            default: "100%"
        },
        height: {
            type: String,
            default: "300px"
        }
    },
    data() {
        return {
            chart: null,
            loading: false,
            zqid: null,
            typeData: []
        };
    },
    activated() {
        this.getData();
        this.getZq();
    },
    mounted() {
        this.initChart();
        this.__resizeHanlder = debounce(() => {
            if (this.chart) {
                this.chart.resize();
            }
        }, 100);
        window.addEventListener("resize", this.__resizeHanlder);
    },
    beforeDestroy() {
        if (!this.chart) {
            return;
        }
        window.removeEventListener("resize", this.__resizeHanlder);
        this.chart.dispose();
        this.chart = null;
    },

    methods: {
        setOptions(keys, data) {
            this.chart.setOption({
                tooltip: {
                    trigger: "axis",
                    axisPointer: {
                        // 坐标轴指示器，坐标轴触发有效
                        type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                grid: {
                    top: 10,
                    left: "2%",
                    right: "2%",
                    bottom: "3%",
                    containLabel: true
                },
                xAxis: [
                    {
                        type: "category",
                        data: keys,
                        axisTick: {
                            alignWithLabel: true
                        }
                    }
                ],
                yAxis: [
                    {
                        type: "value",
                        axisTick: {
                            show: false
                        }
                    }
                ],
                series: [
                    {
                        name: "人数",
                        type: "bar",
                        barWidth: "60%",
                        data: data,
                        itemStyle: {
                            color: "#DB3D3A"
                        },

                        animationDuration
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
        //获取数据
        getData() {
            this.loading = true;
            getPillar({ id: this.zqid })
                .then(res => {
                    let data = Object.values(res);
                    let keys = Object.keys(res).map(item => {
                        return (item = item + "年");
                    });
                    this.setOptions(keys, data);
                    this.loading = false;
                })
                .catch(() => {
                    this.loading = false;
                });
        },
        getZq() {
            getZhouq().then(res => {
                this.typeData = res;
            });
        }
    }
};
</script>
