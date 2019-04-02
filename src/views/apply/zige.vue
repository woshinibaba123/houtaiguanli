<template>
    <div>
        <div class="app-container">
            <div class="filter-container">
                <el-input @keyup.enter.native="handleFilter" style="width: 230px;" class="filter-item" placeholder="检索：教师姓名、工号"
                    :clearable="true" v-model="listQuery.keys">
                </el-input>
                <Xisuo :values="listQuery"></Xisuo>
                <el-button class="filter-item" type="primary" v-waves plain icon="el-icon-search" @click="handleFilter">搜索</el-button>
                <el-button class="filter-item" type="primary" v-waves icon="el-icon-circle-plus-outline" v-if="authCheck(70)"
                    @click="newEdit(null)">新增资格转让</el-button>
            </div>
            <el-table :data="tableData" fit stripe highlight-current-row v-loading="loading" :max-height="clientHeight"
                element-loading-text="数据载入中" @sort-change="handleSort">
                <el-table-column label="序号" type="index" width="60" align="center"></el-table-column>
                <el-table-column label="转让人" min-width="100" prop="zr_name" show-overflow-tooltip sortable="custom"></el-table-column>
                <el-table-column label="工号" min-width="100" prop="zr_account" show-overflow-tooltip sortable="custom"></el-table-column>
                <el-table-column label="所在部门" min-width="180" prop="zr_xisuo" show-overflow-tooltip sortable="custom">
                    <template slot-scope="scope">
                        {{scope.row.zr_xisuo_title||'--'}}
                    </template>
                </el-table-column>
                <el-table-column label="被转让人" min-width="100" prop="js_name" show-overflow-tooltip sortable="custom"></el-table-column>
                <el-table-column label="工号" min-width="100" prop="js_account" show-overflow-tooltip sortable="custom"></el-table-column>
                <el-table-column label="所在部门" min-width="180" prop="js_xisuo" show-overflow-tooltip sortable="custom">
                    <template slot-scope="scope">
                        {{scope.row.js_xisuo_title||'--'}}
                    </template>
                </el-table-column>
                <el-table-column label="转让时间" min-width="100" prop="nf" show-overflow-tooltip sortable="custom">
                    <template slot-scope="scope">
                        {{scope.row.nf||'--'}} 年
                    </template>
                </el-table-column>
                <el-table-column label="转让周期" min-width="120" prop="zq" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.start_time}} ~ {{scope.row.end_time}} 年
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="170" fixed="right" class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                        <el-button v-if="authCheck(71) && scope.row.nf===currentYear" type="primary" size="mini"
                            v-waves plain icon="el-icon-edit" @click="newEdit(scope.row.id)">编辑</el-button>
                        <el-button v-if="authCheck(76) && scope.row.nf===currentYear" type="danger" size="mini" v-waves
                            plain icon="el-icon-delete" @click="handleDelete(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <Page v-model="listQuery" :total="total" />
        <new-edit :dialogStatus="dialogStatus" :zgid="zgid" @CB-dialogStatus="CB_dialogStatus"></new-edit>
    </div>
</template>

<script>
import { mapState } from "vuex";
import waves from "@/directive/waves"; // 水波纹指令
import NewEdit from "./zige_new";

import { ZigeList, ZigeDel } from "@/api/apply";

export default {
    name: "zige_index",
    directives: {
        waves
    },
    computed: {
        clientHeight() {
            return this.$store.state.clientHeight - 115;
        }
    },
    components: { NewEdit },
    data() {
        return {
            total: 0,
            loading: false,
            tableData: [],
            zgid: null,
            dialogStatus: false,
            multipleSelection: [],
            currentYear: new Date().getFullYear().toString(),
            // 检索参数
            listQuery: {
                xisuo: "",
                keys: "",
                _order: "",
                _sort: "",
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
        //编辑编辑
        newEdit(id) {
            this.zgid = id ? id : null;
            this.dialogStatus = true;
        },
        CB_dialogStatus(val) {
            if (val) {
                this.getData();
            }
            this.zgid = null;
            this.dialogStatus = false;
        },
        //获取主数据
        getData() {
            this.loading = true;
            ZigeList(this.listQuery)
                .then(rs => {
                    this.loading = false;
                    this.tableData = rs.data;
                    this.total = rs.count;
                })
                .catch(() => {
                    this.loading = false;
                });
        },
        handleDelete(id) {
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
                    ZigeDel({ id: id })
                        .then(rs => {
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
