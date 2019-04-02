<template>
    <div v-loading="loading" element-loading-text="拼命加载中">
        <div :id="idName" :style="{height:height,width:width}"></div>
    </div>
</template>

<script>
import { mapState } from "vuex";
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import { debounce } from "@/utils";
import { dashboardCircle } from "@/api/dashboard";

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
            default: "400px"
        }
    },
    data() {
        return {
            chart: null,
            loading: false,
            start_time: "",
            end_time: "",
            name: "",
            pickerBeginDateBefore: {
                disabledDate(time) {
                    return time.getTime() > Date.now();
                }
            },
            lingyu: [],
            status: "",
            shenheStatusOption: [
                { id: "1", title: "待审核" },
                { id: "2", title: "通过审核" },
                { id: "3", title: "退回材料" }
            ]
        };
    },
    activated() {
        this.lingyu = [];
        this.name =
            this.idName == "index_chengguo"
                ? "成果信息应用领域分布"
                : "需求信息所在领域分布";
        // this.getData();
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
        initChart() {
            this.chart = echarts.init(
                document.getElementById(this.idName),
                "macarons"
            );
        },
        setOptions(data) {
            this.chart.setOption({
                tooltip: {
                    trigger: "item",
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    left: "center",
                    bottom: "10",
                    data: this.lingyu
                },
                calculable: true,
                series: [
                    {
                        name: this.name,
                        type: "pie",
                        roseType: "radius",
                        radius: [15, 95],
                        center: ["50%", "38%"],
                        data: data,
                        animationEasing: "cubicInOut",
                        animationDuration: 2600
                    }
                ]
            });
        },
        startchange(val) {
            if (this.end_time && val > this.end_time) {
                this.start_time = "";
                this.$message.warning("开始时间不能晚于结束时间！");
                return;
            }
            this.getData();
        },
        endchange(val) {
            if (this.start_time && val < this.start_time) {
                this.end_time = "";
                this.$message.warning("结束时间不能早于开始时间！");
                return;
            }
            this.getData();
        },
        getData() {
            // var requestObj = {};
            // requestObj = {
            //     type: this.idName == 'index_xuqiu' ? '1' : '2',
            //     status: this.status,
            //     beforeTime: this.start_time,
            //     afterTime: this.end_time
            // };
            // this.loading = true;
            // dashboardCircle(requestObj)
            //     .then(rs => {
            //         this.setOptions(rs);
            //         this.loading = false;
            //     })
            //     .catch(err => {
            //         this.loading = false;
            //     });
        }
    },
    //计算属性
    computed: mapState({})
};
</script>
