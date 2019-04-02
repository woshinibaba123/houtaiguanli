<template>
    <div>
        <div class="app-container">
            <div class="filter-container">
                <el-input @keyup.enter.native="handleFilter" style="width: 290px;" class="filter-item" placeholder="检索：教师姓名、工号、线路名称"
                    :clearable="true" v-model="listQuery.keys">
                </el-input>
                <Xisuo :values="listQuery"></Xisuo>
                <el-button class="filter-item" type="primary" v-waves plain icon="el-icon-search" @click="handleFilter">搜索</el-button>
                <el-button class="filter-item" type="primary" v-if="multipleSelection.length>0 && authCheck(69)"
                    v-waves icon="el-icon-document" @click="handleShenhe">批量审核</el-button>
            </div>
            <el-table :data="tableData" fit stripe highlight-current-row v-loading="loading" :max-height="clientHeight"
                element-loading-text="数据载入中" @selection-change="handleSelection" @sort-change="handleSort">
                <el-table-column type="selection" width="60" align="center"></el-table-column>
                <el-table-column label="教师姓名" min-width="100" prop="name" show-overflow-tooltip sortable="custom"></el-table-column>
                <el-table-column label="工号" min-width="100" prop="account" show-overflow-tooltip sortable="custom"></el-table-column>
                <el-table-column label="所在部门" min-width="180" prop="xisuo" show-overflow-tooltip sortable="custom">
                    <template slot-scope="scope">
                        {{scope.row.xisuo_title||'--'}}
                    </template>
                </el-table-column>
                <el-table-column label="线路名称" min-width="260" prop="title" show-overflow-tooltip sortable="custom">
                    <template slot-scope="scope">
                        {{scope.row.title}}<span v-if="scope.row.beizhu!=''">（{{scope.row.beizhu}}）</span>
                    </template>
                </el-table-column>
                <el-table-column label="收费金额（元）" min-width="150" prop="sf" show-overflow-tooltip sortable="custom">
                    <template slot-scope="scope">
                        ￥{{scope.row.sf||0}}
                    </template>
                </el-table-column>
                <el-table-column label="补贴金额（元）" min-width="150" prop="bt" show-overflow-tooltip sortable="custom">
                    <template slot-scope="scope">
                        ￥{{scope.row.bt||0}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="170" fixed="right" class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                        <el-button v-if="authCheck(68)" type="info" size="mini" v-waves plain icon="el-icon-info"
                            @click="handleDetail(scope.row.id)">详情</el-button>
                        <el-button v-if="authCheck(69)" type="success" size="mini" v-waves plain icon="el-icon-document"
                            @click="handleApproval(scope.row.id)">审批</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <Page v-model="listQuery" :total="total" />
        <approval-liao :dialogStatus="dialogStatus" :sid="sid" @CB-dialogStatus="CB_dialogStatus"></approval-liao>
        <Detail :dialogDetailstatus="dialogDetailstatus" :did="did" @CB-dialogDetailstatus="CB_dialogDetailstatus"></Detail>
    </div>
</template>

<script>
import { mapState } from "vuex";
import waves from "@/directive/waves"; // 水波纹指令

import Detail from "./detail";
import ApprovalLiao from "./shenpi";
import { ApplyIndex, ApplyEdit } from "@/api/apply";

export default {
    name: "dai_index",
    directives: {
        waves
    },
    computed: {
        clientHeight() {
            return this.$store.state.clientHeight - 115;
        }
    },
    components: { Detail, ApprovalLiao },
    data() {
        return {
            total: 0,
            loading: false,
            tableData: [],
            did: null,
            dialogDetailstatus: false,
            sid: null,
            dialogStatus: false,
            multipleSelection: [],
            // 检索参数
            listQuery: {
                keys: "",
                status: 1,
                _order: "",
                _sort: "",
                page: 1,
                listRows: this.$store.state.pageSize,
                nf: new Date().getFullYear()
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
        //获取主数据
        getData() {
            this.loading = true;
            ApplyIndex(this.listQuery)
                .then(rs => {
                    this.loading = false;
                    this.tableData = rs.data;
                    this.total = rs.count;
                })
                .catch(() => {
                    this.loading = false;
                });
        },
        //审批
        handleApproval(id) {
            this.sid = id;
            this.dialogStatus = true;
        },
        CB_dialogStatus(val) {
            if (val) {
                this.getData();
            }
            this.sid = null;
            this.dialogStatus = false;
        },
        handleShenhe() {
            if (this.multipleSelection.length === 0) {
                this.$message.warning("请选择批量审核通过的数据");
                return;
            }
            this.$confirm("确定要批量通过选中的教师申请？", "系统提示", {
                confirmButtonText: "确定通过",
                showClose: false
            })
                .then(() => {
                    ApplyEdit({
                        id: this.multipleSelection.map(item => item.id)
                    }).then(res => {
                        this.$message.success("审核成功！");
                        this.getData();
                    });
                })
                .catch(() => {});
        },
        //详情
        handleDetail(id) {
            this.did = id;
            this.dialogDetailstatus = true;
        },
        CB_dialogDetailstatus(val) {
            this.did = null;
            this.dialogDetailstatus = false;
        },
        //复选框
        handleSelection(val) {
            this.multipleSelection = val;
        }
    }
};
</script>
