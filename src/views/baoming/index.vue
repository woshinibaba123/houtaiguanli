<template>
    <div>
        <div class="app-container">
            <h3>{{lxy}}年疗休养线路</h3>
            <div class="filter-container">
                <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="检索：线路名称"
                    :clearable="true" v-model="listQuery.keys">
                </el-input>
                <Datepicker class="filter-item" :value="listQuery" title="疗休养" type="doubles"></Datepicker>
                <Datepicker class="filter-item" :value="listQuery" title="报名" type="double"></Datepicker>
                <el-button class="filter-item" type="primary" plain icon="el-icon-search" @click="handleFilter">搜索</el-button>
            </div>
            <div class="filter-container">
                {{currentYear}}年疗休养线路
            </div>
            <!-- 注意：产品默认按照编辑的正序显示，可以手动排序，序号越大排列越靠前，默认序号为0 -->
            <el-table :data="tableData" fit stripe highlight-current-row v-loading="loading" :max-height="clientHeight"
                element-loading-text="数据载入中" @sort-change="handleSort">
                <el-table-column width="60" label="序号" type="index"></el-table-column>
                <el-table-column label="线路名称" min-width="300" prop="title" show-overflow-tooltip sortable="custom">
                    <template slot-scope="scope">
                        {{scope.row.title}}<span v-if="scope.row.beizhu!=''">（{{scope.row.beizhu}}）</span>
                    </template>
                </el-table-column>
                <el-table-column label="收费金额（元）" min-width="142" prop="sf" sortable="custom">
                    <template slot-scope="scope">
                        ￥{{scope.row.sf}}
                    </template>
                </el-table-column>
                <el-table-column label="补贴金额（元）" min-width="142" prop="bt" sortable="custom">
                    <template slot-scope="scope">
                        ￥{{scope.row.bt}}
                    </template>
                </el-table-column>
                <el-table-column label="疗休养时间" min-width="190" prop="title" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.start_time}} ~ {{scope.row.end_time}}
                    </template>
                </el-table-column>
                <el-table-column label="报名状态" min-width="110" prop="status_title" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span :class="scope.row.status_title|statsuFilter">{{scope.row.status_title}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="right" label="操作" width="180" fixed="right" class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                        <el-button type="success" size="mini" v-waves plain icon="el-icon-document" v-if="authCheck(92)&&scope.row.status===2&&scope.row.bm_status===1"
                            @click="handleSign(scope.row.id)">报名</el-button>
                        <el-button type="danger" size="mini" v-waves plain icon="el-icon-tickets" v-if="authCheck(92)&&scope.row.status===2&&scope.row.bm_status===2"
                            @click="handleCancelSign(scope.row.id)">取消报名</el-button>
                        <el-button type="info" size="mini" v-waves plain icon="el-icon-info" v-if="authCheck(91)"
                            @click="handleDetail(scope.row.id)">详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <Page v-model="listQuery" :total="total" />
        <baoming-detail :dialogDetail="dialogDetail" :mid="mid" :baoming="baoming" @CB-dialogDetail="CB_dialogDetail"></baoming-detail>
    </div>
</template>
<script>
import { mapState } from "vuex";
import waves from "@/directive/waves"; // 水波纹指令

import BaomingDetail from "./index_detail";

import { BaomingIndex, LxyZhouq, Zige, cancelSignup } from "@/api/baoming.js";

export default {
    name: "baoming_index",
    components: { BaomingDetail },
    computed: {
        clientHeight() {
            return this.$store.state.clientHeight - 115;
        }
    },
    directives: { waves },
    data() {
        return {
            total: 0,
            loading: false,
            tableData: [],
            mid: null,
            dialogDetail: false,
            lxy: "",
            is_zi: false,
            baoming: false,
            listQuery: {
                keys: "",
                _order: "id",
                _sort: "desc",
                times: [],
                bm_times: [],
                page: 1,
                listRows: this.$store.state.pageSize
            },
            currentYear: new Date().getFullYear()
        };
    },
    created() {
        this.getLxy();
    },
    activated() {
        this.listQuery.listRows = this.$store.state.pageSize;
        this.getData();
    },
    filters: {
        statsuFilter(statustitle) {
            const statusData = [
                {
                    title: "正在报名中",
                    color: "text-success"
                },
                {
                    title: "报名未开始",
                    color: "text-muted"
                },
                {
                    title: "报名已结束",
                    color: "text-danger"
                }
            ];
            let data = statusData.find(item => item.title == statustitle);
            if (data) {
                return data.color;
            }
        }
    },
    methods: {
        //检索
        handleFilter() {
            this.listQuery.page = 1;
            this.getData();
        },
        //排序
        handleSort(val) {
            this.listQuery._order = val.prop;
            this.listQuery._sort = val.order == "ascending" ? "asc" : "desc";
            this.getData();
        },
        //疗休养报名
        handleSign(id) {
            this.mid = id;
            this.baoming = true;
            this.dialogDetail = true;
        },
        handleCancelSign(id) {
            this.$confirm("确定要取消当前线路的报名吗？", "系统提示", {
                confirmButtonText: "确定取消",
                showCancelButton: false,
                type: "warning"
            })
                .then(() => {
                    cancelSignup({ id: id }).then(res => {
                        this.$message.success("取消成功!");
                        this.getData();
                    });
                })
                .catch(() => {});
        },
        //详情
        handleDetail(id) {
            this.mid = id;
            this.dialogDetail = true;
        },
        CB_dialogDetail(val) {
            if (val) {
                this.getData();
            }
            this.mid = null;
            this.baoming = false;
            this.dialogDetail = false;
        },
        //获取数据源
        getData() {
            this.loading = true;
            BaomingIndex(this.listQuery)
                .then(res => {
                    this.tableData = res.data;
                    this.total = res.count;
                    this.is_zi = res.info.status;
                    this.loading = false;
                })
                .catch(() => {
                    this.loading = false;
                });
        },
        //获取疗休养周期
        getLxy() {
            LxyZhouq().then(res => {
                this.lxy = res.times;
            });
        }
    }
};
</script>
