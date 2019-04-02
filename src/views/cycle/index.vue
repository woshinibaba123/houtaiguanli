<template>
    <div>
        <div class="app-container">
            <div class="filter-container">
                <el-input @keyup.enter.native="handleFilter" style="width: 290px;" class="filter-item" placeholder="检索：疗休养周期"
                    :clearable="true" v-model="listQuery.keys">
                </el-input>
                <el-button class="filter-item" type="primary" v-waves plain icon="el-icon-search" @click="handleFilter">搜索</el-button>
                <!-- <Download v-if="authCheck(56)" :value="listQuery" model="member" name="导出个人注册信息"></Download> -->
                <el-button class="filter-item" type="primary" icon="el-icon-circle-plus-outline" v-if="authCheck(44)" v-waves @click="newEdit(null)">新增疗休养周期</el-button>
            </div>
            <el-table :data="tableData" fit stripe highlight-current-row v-loading="loading" :max-height="clientHeight"
                element-loading-text="数据载入中" @sort-change="handleSort">
                <el-table-column label="序号" type="index" width="60" align="center"></el-table-column>
                <el-table-column label="疗休养周期" min-width="140" prop="times" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.times}} 年
                    </template>
                </el-table-column>
                <el-table-column label="人数设置" min-width="140" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="currentYear>scope.row.end_time">
                            共 {{scope.row.count}} 人
                        </span>
                        <span v-else-if="currentYear<scope.row.start_time" class="text-muted">
                            尚未设置
                        </span>
                        <span v-else>
                            {{currentYear}}年：<span :class="scope.row.count?'':'text-muted'">{{scope.row.count?scope.row.count:'尚未设置'}}</span>
                            <span v-if="scope.row.count">人</span>
                        </span>
                        <el-button type="text" class="no-margin no-padding" @click="handleSet(scope.row.id,scope.row.times,scope.row.start_time,scope.row.end_time)">查看</el-button>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="170" fixed="right" class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                        <el-button v-if="authCheck(46)" type="primary" size="mini" v-waves plain icon="el-icon-edit"
                            @click="newEdit(scope.row.id)">编辑</el-button>
                        <el-button v-if="authCheck(47)" type="danger" size="mini" v-waves plain icon="el-icon-delete"
                            @click="deleteData(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <Page v-model="listQuery" :total="total" />
        <new-edit :dialogStatus="dialogStatus" :lxyid="lxyid" @CB-dialogStatus="CB_dialogStatus"></new-edit>
        <user-set :dialogSet="dialogSet" :nfid="nfid" :times="times" :start_time="start_time" :end_time="end_time"
            @CB-dialogSet="CB_dialogSet"></user-set>
    </div>
</template>

<script>
import { mapState } from "vuex";
import waves from "@/directive/waves"; // 水波纹指令
import NewEdit from "./newEdit";
import UserSet from "./users_set";
import { cycleList, cycleDelete } from "@/api/cycle.js";

export default {
    name: "cycle_index",
    directives: {
        waves
    },
    computed: {
        ...mapState(["typeData"]),
        clientHeight() {
            return this.$store.state.clientHeight - 115;
        }
    },
    components: { NewEdit, UserSet },
    data() {
        return {
            total: 0,
            loading: false,
            dialogStatus: false,
            lxyid: null,
            //模拟数据
            tableData: [],
            currentYear: "",
            dialogSet: false,
            nfid: null,
            times: "",
            start_time: "",
            end_time: "",
            // 检索参数
            listQuery: {
                keys: "",
                _order: "",
                _sort: "",
                page: 1,
                listRows: this.$store.state.pageSize
            }
        };
    },
    activated() {
        var date = new Date();
        this.currentYear = date.getFullYear();
        this.listQuery.listRows = this.$store.state.pageSize;
        this.getData();
    },
    methods: {
        //排序
        handleSort(val) {
            this.listQuery._order = val.prop;
            this.listQuery._sort = val.order == "ascending" ? "asc" : "desc";
            this.getData();
        },
        //根据条件检索
        handleFilter() {
            this.listQuery.page = 1;
            this.getData();
        },
        //编辑编辑疗休养
        newEdit(id) {
            this.lxyid = id ? id : null;
            this.dialogStatus = true;
        },
        CB_dialogStatus(val) {
            if (val) {
                this.getData();
            }
            this.lxyid = null;
            this.dialogStatus = false;
        },
        //人数设置
        handleSet(id, times, start_time, end_time) {
            this.nfid = id;
            this.times = times;
            this.start_time = start_time;
            this.end_time = end_time;
            this.dialogSet = true;
        },
        CB_dialogSet(val) {
            if (val) {
                this.getData();
            }
            this.dialogSet = false;
            this.nfid = null;
            this.times = "";
            this.start_time = "";
            this.end_time = "";
        },
        //获取主数据
        getData() {
            this.loading = true;
            cycleList(this.listQuery)
                .then(rs => {
                    this.loading = false;
                    this.tableData = rs.data;
                    this.total = rs.count;
                })
                .catch(() => {
                    this.loading = false;
                });
        },
        //删除
        deleteData(id) {
            this.$confirm(
                "确定要删除该信息吗？删除后将不可恢复！",
                "系统提示",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }
            )
                .then(() => {
                    this.loading = true;
                    cycleDelete({ id: id })
                        .then(rs => {
                            this.loading = false;
                            this.$message({
                                message: "删除成功",
                                type: "success"
                            });
                            this.getData();
                        })
                        .catch(() => {
                            this.loading = false;
                        });
                })
                .catch(() => {});
        }
    }
};
</script>
