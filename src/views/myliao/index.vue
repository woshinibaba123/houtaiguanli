<template>
    <div>
        <div class="app-container">
            <div class="filter-container">
                <el-input @keyup.enter.native="handleFilter" style="width: 290px;" class="filter-item" placeholder="检索：线路名称"
                    :clearable="true" v-model="listQuery.keys">
                </el-input>
                <Datepicker class="filter-item" :value="listQuery" title="疗休养" type="doubles"></Datepicker>
                <el-button class="filter-item" type="primary" plain icon="el-icon-search" @click="handleFilter">搜索</el-button>
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
                <el-table-column label="疗休养周期" min-width="120" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.times}} 年
                    </template>
                </el-table-column>
                <el-table-column label="疗休养年份" min-width="110" prop="nf" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.nf}} 年
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="90" fixed="right" class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                        <el-button type="info" size="mini" v-waves plain icon="el-icon-info" v-if="authCheck(96)"
                            @click="handleDetail(scope.row.id)">详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <Page v-model="listQuery" :total="total" />
        <baoming-detail :dialogDetail="dialogDetail" :mid="mid" @CB-dialogDetail="CB_dialogDetail"></baoming-detail>
    </div>
</template>
<script>
import { mapState } from "vuex";
import waves from "@/directive/waves"; // 水波纹指令

import BaomingDetail from "./index_detail";

import { MyliaoIndex } from "@/api/myliao.js";

export default {
    name: "myliao_index",
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
            listQuery: {
                keys: "",
                _order: "id",
                _sort: "desc",
                times: [],
                page: 1,
                listRows: this.$store.state.pageSize
            }
        };
    },
    activated() {
        this.listQuery.listRows = this.$store.state.pageSize;
        this.getData();
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
            this.dialogDetail = false;
        },
        //获取数据源
        getData() {
            this.loading = true;
            MyliaoIndex(this.listQuery)
                .then(res => {
                    this.tableData = res.data;
                    this.total = res.count;
                    this.is_zi = res.info.status;
                    this.loading = false;
                })
                .catch(() => {
                    this.loading = false;
                });
        }
    }
};
</script>
