<template>
    <div class="dashboard-editor-container" v-bind:style=" { 'min-height': clientHeight + 134 +'px'}">
        <panel-group></panel-group>
        <el-row :gutter="32">
            <el-col :span="12" v-if="authCheck(100)&&authCheck(101)">
                <el-col class="chart-wrapper">
                    <div class="font-120 margin-top-10 margin-bottom-20">
                        周期内疗休养人数对比图
                    </div>
                    <bar-chart></bar-chart>
                </el-col>
            </el-col>
        </el-row>
        <el-row :gutter="32">
            <el-col :span="12" v-loading="loading" element-loading-text="拼命加载中..." v-if="authCheck(97)&&authCheck(98)&&user.userinfo.group!=1">
                <el-card shadow="hover" :body-style="{'min-height':infoData.ft&&infoData.ft.title?'518px': status===2?'440px':'294px'}">
                    <el-col :span="24" class="font-120 margin-top-10 margin-bottom-10">
                        <div class="xiaolian text-center">
                            <svg-icon :icon-class="info.status?'smile':'faceline'" :class="info.status?'text-success':'text-danger'"></svg-icon>
                        </div>
                        <div :class="info.status?'text-success':'text-danger'" class="font-120 margin-bottom-10 text-center">{{info.msg}}！</div>
                        <div class="margin-top-20 font-80" v-if="info.status">
                            友情提醒：请在以下时间内使用本次机会，过期后将自动取消您本周期的疗休养资格。
                        </div>
                        <div class="margin-top-20 margin-bottom-30 font-80" v-if="info.status">
                            疗休养周期：{{cycleData}}年
                        </div>
                    </el-col>
                </el-card>
            </el-col>
            <el-col :span="12" v-if="authCheck(99)&&user.userinfo.group!=1">
                <el-card shadow="hover" id="card" :body-style="{'min-height':infoData.ft&&infoData.ft.title?'518px': status===2?'440px':'294px'}">
                    <el-col :span="24" class="font-120 margin-bottom-10">
                        <h3>分团</h3>
                        <div class="padding-left-20" v-if="status===2">
                            <h4>线路信息</h4>
                            <div class="font-80">
                                <p>线路名称：{{infoData.title||'--'}}</p>
                                <p v-if="infoData.beizhu!=''">线路说明：<span v-html="Trim(infoData.beizhu)"></span></p>
                                <p>收费金额：{{infoData.sf||0}}元</p>
                                <p>补贴金额：{{infoData.bt||0}}元</p>
                            </div>
                            <h4>分团信息</h4>
                            <div class="font-80 margin-bottom-50" v-if="infoData.ft&&infoData.ft.title">
                                <p>分团名称：{{infoData.ft.title||'--'}}</p>
                                <p>领队信息：{{infoData.ft.ld||'--'}}</p>
                                <p>出行时间：{{infoData.ft.start_time}} ~ {{infoData.ft.end_time}}</p>
                            </div>
                            <div v-else class="text-center font-80 text-muted">
                                暂无分团信息
                            </div>
                        </div>
                        <div v-else class="text-center font-80 text-muted margin-bottom-50">
                            暂无线路、分团信息
                        </div>
                    </el-col>
                </el-card>
            </el-col>
        </el-row>
        <XieYi :dialogXieyi="dialogXieyi"
        @CB_dialogXieyi="CB_dialogXieyi"></XieYi>
    </div>
</template>

<script>
import { mapState } from "vuex";
import PanelGroup from "./components/PanelGroup";
import BarChart from "./components/BarChart";
import XieYi from "./components/xieyi"
import { Zige, LxyZhouq } from "@/api/baoming.js";
import { fentuanRead } from "@/api/dashboard.js";

export default {
    name: "dashboard-admin",
    components: {
        PanelGroup,
        BarChart,
        XieYi
    },
    data() {
        return {
            dialogXieyi: true,
            loading: false,
            floading: false,
            info: {
                status: true,
                msg: ""
            },
            infoData: {
                title: "",
                beizhu: "",
                sf: "",
                status: "",
                sh_beizhu: "",
                is_tj: "",
                ft: {
                    title: "",
                    ld: "",
                    times: []
                }
            },
            status: 1,
            cycleData: ""
        };
    },
    activated() {
        if (this.authCheck(99)) {
            this.getFentuan();
        }
        if (this.authCheck(97) && this.authCheck(98)) {
            this.getZige();
        }
    },
    methods: {
        CB_dialogXieyi(val){
this.dialogXieyi = false
        },
        getZige() {
            this.loading = true;
            Zige()
                .then(res => {
                    this.getLxy();
                    this.info = res;
                })
                .catch(() => {
                    this.loading = false;
                });
        },
        getFentuan() {
            this.floading = true;
            fentuanRead()
                .then(res => {
                    this.infoData = res.data;
                    this.status = res.status;
                    this.floading = false;
                })
                .catch(() => {
                    this.floading = false;
                });
        },
        getLxy() {
            LxyZhouq()
                .then(res => {
                    this.cycleData = res.times;
                    this.loading = false;
                })
                .catch(res => {
                    this.loading = false;
                });
        },
        //替换回车符
        Trim(str) {
            return str.toString().replace(/\n|\r\n/g, "<br/>");
        },
    },
    computed: {
        ...mapState(["user"]),
        clientHeight() {
            return this.$store.state.clientHeight - 115;
        }
    }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
    padding: 32px;
    background-color: rgb(240, 242, 245);
    .chart-wrapper {
        background: #fff;
        padding: 16px 16px 0;
        margin-bottom: 32px;
    }
}
.xiaolian {
    font-size: 90px;
    text-align: center;
}
</style>
