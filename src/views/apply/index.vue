<template>
    <div>
        <div class="app-container">
            <div class="filter-container">
                <el-steps :active="active" simple>
                    <el-step title="发布线路" icon="el-icon-edit"></el-step>
                    <el-step title="检测报名" icon="el-icon-upload"></el-step>
                    <el-step title="发布分团" icon="el-icon-picture"></el-step>
                    <el-step title="发布缴费" icon="el-icon-tickets"></el-step>
                    <el-step title="发布通知" icon="el-icon-bell"></el-step>
                </el-steps>
            </div>
            <div class="filter-container margin-top-10">
                <el-input @keyup.enter.native="handleFilter" style="width: 290px;" class="filter-item" placeholder="检索：教师姓名、工号、线路名称"
                    :clearable="true" v-model="listQuery.keys">
                </el-input>
                <el-select class="filter-item" v-model="listQuery.nf" placeholder="不限年份" filterable clearable>
                    <el-option v-for="(item,index) in nianfenData" :key="index" :value="item" :label="item"></el-option>
                </el-select>
                <Xisuo :values="listQuery"></Xisuo>
                <el-button class="filter-item" type="primary" v-waves plain icon="el-icon-search" @click="handleFilter">搜索</el-button>
                <Download name="导出名单" :value="listQuery" model="baoming"></Download>
            </div>
            <el-table :data="tableData" fit stripe highlight-current-row v-loading="loading" :max-height="clientHeight-69"
                element-loading-text="数据载入中" @sort-change="handleSort">
                <el-table-column label="序号" type="index" width="60" align="center" fixed></el-table-column>
                <el-table-column label="教师姓名" min-width="100" prop="name" show-overflow-tooltip sortable="custom" fixed></el-table-column>
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
                <el-table-column label="总价" min-width="100" prop="sf" show-overflow-tooltip sortable="custom">
                    <template slot-scope="scope">
                        {{scope.row.sf||0}} 元
                    </template>
                </el-table-column>
                <el-table-column label="自费门票" min-width="100" prop="bt" show-overflow-tooltip sortable="custom">
                    <template slot-scope="scope">
                        {{scope.row.bt||0}} 元
                    </template>
                </el-table-column>
                <el-table-column label="分团发布状态" min-width="130" prop="status" show-overflow-tooltip sortable="custom">
                    <template>
                       
                    </template>
                </el-table-column>
                <el-table-column label="缴费状态" min-width="100" prop="status" show-overflow-tooltip sortable="custom">
                    <template>
                       
                    </template>
                </el-table-column>
                <el-table-column label="退费状态" min-width="100" prop="status" show-overflow-tooltip sortable="custom">
                    <template>
                       
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="170" fixed="right" class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                        <el-button v-if="authCheck(68)" type="info" size="mini" v-waves plain icon="el-icon-info"
                            @click="handleDetail(scope.row.id)">详情</el-button>
                        <!-- <el-button type="success" size==="mini" v-waves plain icon="el-icon-document"
                            @click="handleApproval(scope.row.id)">审批</el-button> -->
                        <el-dropdown @command="handleCommand" trigger="click" class="margin-left-10" v-if="authCheck(69)||authCheck(84)">
                            <el-button type="info" size="mini" plain>
                                更多
                                <i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item v-if="authCheck(69)" :command="{type:'shen',ID:scope.row.id}">
                                    <span class="text-success">审批</span>
                                </el-dropdown-item>
                                <el-dropdown-item v-if="authCheck(84)&&scope.row.status==2" :command="{type:'tiao',ID:scope.row.id}">
                                    <span class="text-primary">调剂</span>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <Page v-model="listQuery" :total="total" />
        <approval-liao :dialogStatus="dialogStatus" :sid="sid" @CB-dialogStatus="CB_dialogStatus"></approval-liao>
        <Detail :dialogDetailstatus="dialogDetailstatus" :did="did" @CB-dialogDetailstatus="CB_dialogDetailstatus"></Detail>
        <tiao-ji :dialogTiaoji="dialogTiaoji" :tjid="tjid" @CB-dialogTiaoji="CB_dialogTiaoji"></tiao-ji>
    </div>
</template>

<script>
import { mapState } from "vuex";
import waves from "@/directive/waves"; // 水波纹指令

import TiaoJi from "./tiaoji";
import Detail from "./detail";
import ApprovalLiao from "./shenpi";
import { ApplyIndex } from "@/api/apply";

export default {
    name: "index",
    directives: {
        waves
    },
    computed: {
        ...mapState(["statusData", "nianfenData"]),
        statusState() {
            return this.statusData.filter(
                item => item.id === 2 || item.id === 3
            );
        },
        clientHeight() {
            return this.$store.state.clientHeight - 115;
        }
    },
    components: { Detail, ApprovalLiao, TiaoJi },
    data() {
        return {
            total: 0,
            loading: false,
            active: 1,
            tableData: [],
            did: null,
            dialogDetailstatus: false,
            sid: null,
            dialogStatus: false,
            tjid: null,
            dialogTiaoji: false,
            multipleSelection: [],
            // 检索参数
            listQuery: {
                keys: "",
                status: 2,
                nf: new Date().getFullYear().toString(),
                _order: "",
                _sort: "",
                xisuo: "",
                page: 1,
                nf: "",
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
        //调剂
        handleTiao(id) {
            this.tjid = id;
            this.dialogTiaoji = true;
        },
        CB_dialogTiaoji(val) {
            if (val) {
                this.getData();
            }
            this.tjid = null;
            this.dialogTiaoji = false;
        },
        //更多
        handleCommand(row) {
            switch (row.type) {
                case "shen":
                    this.handleApproval(row.ID);
                    break;
                case "tiao":
                    this.handleTiao(row.ID);
                    break;
            }
        },
        //详情
        handleDetail(id) {
            this.did = id;
            this.dialogDetailstatus = true;
        },
        CB_dialogDetailstatus(val) {
            this.did = null;
            this.dialogDetailstatus = false;
        }
    }
};
</script>
