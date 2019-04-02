<template>
    <div>
        <div class="display_name">欢迎进入 “上海理工大学” 疗休养后台管理系统</div>
        <div class="display_title margin-bottom-20">{{user.userinfo.name}}（{{user.userinfo.account}}），祝您开心每一天！</div>
        <el-row class="panel-group margin-top-20" :gutter="40" v-if="authCheck(53)||authCheck(57)||authCheck(62)">
            <el-col :xs="24" :sm="12" :md="8" :lg="6" class="card-panel-col" v-if="authCheck(53)">
                <div class="card-panel  card-panels" @click="handleSetLineChartData('/apply/dai_index')">
                    <div class="card-panel-icon-wrapper icon-shoppingCard">
                        <svg-icon icon-class="peoples" class-name="card-panel-icon" />
                    </div>
                    <div class="card-panel-description">
                        <div class="card-panel-text">待审批人数</div>
                        <count-to class="card-panel-num" :startVal="0" :endVal="data.dsh" :duration="1000"></count-to>
                    </div>
                </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="6" class="card-panel-col" v-if="authCheck(62)">
                <div class="card-panel  card-panels" @click="handleSetLineChartData('/apply/index')">
                    <div class="card-panel-icon-wrapper icon-shoppingCard">
                        <svg-icon icon-class="peoples" class-name="card-panel-icon" />
                    </div>
                    <div class="card-panel-description">
                        <div class="card-panel-text">已审批人数</div>
                        <count-to class="card-panel-num" :startVal="0" :endVal="data.ytg" :duration="1000"></count-to>
                    </div>
                </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="6" class="card-panel-col" v-if="authCheck(57)">
                <div class="card-panel card-panels" @click="handleSetLineChartData('/line/index')">
                    <div class="card-panel-icon-wrapper icon-shoppingCard">
                        <svg-icon icon-class="line" class-name="card-panel-icon" />
                    </div>
                    <div class="card-panel-description">
                        <div class="card-panel-text">已添加线路</div>
                        <count-to class="card-panel-num" :startVal="0" :endVal="data.lxyxl" :duration="1000"></count-to>
                    </div>
                </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="6" class="card-panel-col" v-if="authCheck(102)">
                <div class="card-panel">
                    <div class="card-panel-icon-wrapper icon-shoppingCard">
                        <svg-icon icon-class="statistics" class-name="card-panel-icon" />
                    </div>
                    <div class="card-panel-description">
                        <div class="card-panel-text">周期使用/剩余人数</div>
                        <span class="card-panel-num">{{info.data}} / {{info.total}}</span>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import CountTo from "vue-count-to";
import { mapState } from "vuex";
import { dashboardTJ, getRenshu } from "@/api/dashboard";

export default {
    components: {
        CountTo
    },
    data() {
        return {
            data: {
                dsh: 0,
                lxyxl: 0,
                ytg: 0
            },
            info: {
                data: 0,
                total: 0
            }
        };
    },
    activated() {
        if (this.authCheck(74)) {
            this.getData();
        }
        if (this.authCheck(102)) {
            this.getRenshu();
        }
    },
    computed: {
        ...mapState(["user"])
    },
    methods: {
        handleSetLineChartData(type) {
            if (
                type === "/memberAll/index" &&
                this.user.userinfo.group !== 1 &&
                this.user.userinfo.group !== 2
            )
                return;
            this.$router.push({
                path: type
            });
        },
        //获取数据
        getData() {
            dashboardTJ()
                .then(rs => {
                    this.data = rs;
                })
                .catch(err => {});
        },
        getRenshu() {
            getRenshu().then(res => {
                this.info = res;
            });
        }
    }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.display_name {
    font-size: 26px;
    line-height: 30px;
    color: #212121;
}
.display_title {
    font-size: 20px;
    padding-top: 20px;
    display: inline-block;
}

.panel-group {
    margin-top: 18px;
    .card-panel-col {
        margin-bottom: 32px;
    }
    .card-panels {
        cursor: pointer;
    }

    .card-panel {
        height: 108px;

        font-size: 12px;
        position: relative;
        overflow: hidden;
        color: #666;
        background: #fff;
        box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
        border-color: rgba(0, 0, 0, 0.05);
        &:hover {
            .card-panel-icon-wrapper {
                color: #fff;
            }
            .icon-people {
                background: #40c9c6;
            }
            .icon-message {
                background: #36a3f7;
            }
            .icon-money {
                background: #f4516c;
            }
            .icon-shoppingCard {
                background: #34bfa3;
            }
        }
        .icon-people {
            color: #40c9c6;
        }
        .icon-message {
            color: #36a3f7;
        }
        .icon-money {
            color: #f4516c;
        }
        .icon-shoppingCard {
            color: #34bfa3;
        }
        .card-panel-icon-wrapper {
            float: left;
            margin: 14px 0 0 14px;
            padding: 16px;
            transition: all 0.38s ease-out;
            border-radius: 6px;
        }
        .card-panel-icon {
            float: left;
            font-size: 48px;
        }
        .card-panel-description {
            // float: right;
            font-weight: bold;
            margin: 26px;
            margin-left: 110px;
            .card-panel-text {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                line-height: 18px;
                color: rgba(0, 0, 0, 0.45);
                font-size: 16px;
                margin-bottom: 12px;
            }
            .card-panel-num {
                font-size: 20px;
            }
        }
    }
}
</style>
