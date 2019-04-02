<template>
    <div>
        <div class="app-container">
            <div class="filter-container">
                <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="检索：线路名称"
                    :clearable="true" v-model="listQuery.keys">
                </el-input>
                <el-select class="filter-item" style="width:150px" v-model="listQuery.nf" placeholder="不限年份" filterable
                    clearable>
                    <el-option v-for="(item,index) in nianfenData" :key="index" :value="item" :label="item"></el-option>
                </el-select>
                <Datepicker class="filter-item" :value="listQuery" title="疗休养" type="doubles"></Datepicker>
                <Datepicker class="filter-item" :value="listQuery" title="报名" type="double"></Datepicker>
                <el-button class="filter-item" type="primary" plain icon="el-icon-search" @click="handleFilter">搜索</el-button>
                <el-button class="filter-item" type="primary" v-if="authCheck(63)" icon="el-icon-circle-plus-outline"
                    @click="newEdit('add',null)">新增线路</el-button>
                <el-button class="filter-item" type="danger" icon="el-icon-delete" v-if="multipleSelection.length>0 && authCheck(66)"
                    v-waves @click="plDelete">批量删除</el-button>
                    <el-button class="filter-item" type="primary" icon="el-icon-time" v-if="multipleSelection.length>0 && authCheck(66)"
                    v-waves @click="plTime">批量编辑时间</el-button>
            </div>
            <!-- 注意：产品默认按照编辑的正序显示，可以手动排序，序号越大排列越靠前，默认序号为0 -->
            <el-table :data="tableData" fit stripe highlight-current-row v-loading="loading" :max-height="clientHeight"
                element-loading-text="数据载入中" @selection-change="handleSelection" @sort-change="handleSort">
                <el-table-column type="selection" width="60" align="center"></el-table-column>
                <el-table-column label="年份" prop="nf" min-width="80" sortable="custom"></el-table-column>
                <el-table-column label="线路名称" min-width="300" prop="title" show-overflow-tooltip sortable="custom">
                    <template slot-scope="scope">
                        {{scope.row.title}}<span v-if="scope.row.beizhu!=''">（{{scope.row.beizhu}}）</span>
                    </template>
                </el-table-column>
                <el-table-column label="收费金额（元）" prop="sf" min-width="142" sortable="custom">
                    <template slot-scope="scope">
                        ￥{{scope.row.sf}}
                    </template>
                </el-table-column>
                <el-table-column label="补贴金额（元）" prop="bt" min-width="142" sortable="custom">
                    <template slot-scope="scope">
                        ￥{{scope.row.bt}}
                    </template>
                </el-table-column>
                <el-table-column label="分团管理" min-width="120">
                    <template slot-scope="scope">
                        共 {{scope.row.count}} 团
                        <el-button type="text" class="no-margin no-padding" v-if="authCheck(77)" @click="handleTuan(scope.row.id)">管理</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="已报名人数" min-width="120">
                    <template slot-scope="scope">
                        共 {{scope.row.count_bm}} 人
                        <el-button type="text" class="no-margin no-padding" @click="handleLook(scope.row.id,scope.row.title)">查看</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="疗休养时间" min-width="190" prop="title" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.start_time}} ~ {{scope.row.end_time}}
                    </template>
                </el-table-column>
                <el-table-column label="首批报名时间" min-width="190" prop="title" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.ks_time}} ~ {{scope.row.js_time}}
                    </template>
                </el-table-column>
                <el-table-column label="报名截止时间" min-width="110" prop="jz_time" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.jz_time||'--'}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="170" fixed="right" class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" v-waves plain icon="el-icon-edit" v-if="authCheck(65)"
                            @click="newEdit('edit',scope.row.id)">编辑</el-button>
                        <el-dropdown @command="handleCommand" trigger="click" class="margin-left-10" v-if="authCheck(69)||authCheck(66)">
                            <el-button type="info" size="mini" plain>
                                更多
                                <i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item v-if="authCheck(69)" :command="{type:'export',ID:scope.row.id}">
                                    <span class="text-success">导出分团</span>
                                </el-dropdown-item>
                                <el-dropdown-item v-if="authCheck(66)" :command="{type:'del',ID:scope.row.id}">
                                    <span class="text-danger">删除</span>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                        <!-- <el-button type="danger" size="mini" v-waves plain icon="el-icon-delete" v-if="authCheck(66)"
                            @click="handleDelete(scope.row.id)">删除</el-button> -->
                    </template>
                </el-table-column>
            </el-table>
            <line-newedit :dialogLine="dialogLine" :liid="liid" @CB-dialogLine="CB_dialogLine"></line-newedit>
            <line-team :downloadDialog="downloadDialog" :xlid="xlid" @CB-downloadDialog="CB_downloadDialog"></line-team>
            <member-index :dialogMember="dialogMember" :memID="memID" :xtitle="xtitle" @CB-dialogMember="CB_dialogMember"></member-index>
            <time-edit :dialogTime="dialogTime" :idList="idList" @CB-dialogTime="CB_dialogTime"></time-edit>
        </div>
        <Page v-model="listQuery" :total="total" />
    </div>
</template>
<script>
import { mapState } from "vuex";
import waves from "@/directive/waves"; // 水波纹指令

import { LineIndex, LineDel } from "@/api/line.js";
import { getseleYear } from "@/api/download.js";

import LineNewedit from "./newEdit";
import LineTeam from "./export";
import MemberIndex from "./member";
import TimeEdit from "./timeEdit"

export default {
    name: "line_index",
    components: { LineNewedit, LineTeam, MemberIndex,TimeEdit },
    computed: {
        ...mapState(["typeData", "nianfenData"]),
        clientHeight() {
            return this.$store.state.clientHeight - 115;
        }
    },
    directives: { waves },
    data() {
        return {
            total: 0,
            loading: false,
            dialogDetailStatus: false,
            downloadDialog: false,
            xlid: null,
            mid: null,
            tableData: [],
            memID: null,
            dialogMember: false,
            xtitle: "",
            multipleSelection: [],
            dialogTime: false,
            idList:[],
            listQuery: {
                keys: "",
                _order: "id",
                _sort: "desc",
                times: [],
                bm_times: [],
                nf: "",
                page: 1,
                listRows: this.$store.state.pageSize
            },
            dialogLine: false,
            liid: null,
            cptitle: ""
        };
    },
    activated() {
        this.listQuery.listRows = this.$store.state.pageSize;
        if (this.authCheck(103)) {
            this.getselYear();
        }
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
        getselYear() {
            getseleYear().then(res => {
                this.$store.dispatch("setYear", res);
            });
        },
        //分团管理
        handleTuan(id) {
            this.$router.push({
                name: "subgroup_index",
                params: {
                    id: id
                }
            });
        },
        CB_dialogLine(val) {
            if (val) {
                this.getData();
            }
            this.cptitle = "";
            this.liid = null;
            this.dialogLine = false;
        },
        //查看报名人数
        handleLook(id, title) {
            this.xtitle = title;
            this.memID = id ? id : null;
            this.dialogMember = true;
        },
        CB_dialogMember(val) {
            this.xtitle = "";
            this.memID = null;
            this.dialogMember = false;
        },
        // 批量时间
        CB_dialogTime(val){
            this.dialogTime = false
            // this.getData()
        },
        //编辑修改
        newEdit(type, id) {
            if (type === "edit") {
                this.liid = id;
            }
            this.dialogLine = true;
        },
        //获取数据源
        getData() {
            this.loading = true;
            LineIndex(this.listQuery)
                .then(res => {
                    this.tableData = res.data;
                    this.total = res.count;
                    this.loading = false;
                })
                .catch(() => {
                    this.loading = false;
                });
        },
        //更多
        handleCommand(row) {
            switch (row.type) {
                case "export":
                    this.xlid = row.ID;
                    this.downloadDialog = true;
                    break;
                case "del":
                    this.handleDelete(row.ID);
                    break;
            }
        },
        CB_downloadDialog(val) {
            this.xlid = null;
            this.downloadDialog = false;
        },
        //批量删除
        plDelete() {
            if (this.multipleSelection.length === 0) {
                this.$message.warning("请选择删除数据");
                return;
            }
            this.handleDelete(this.multipleSelection.map(item => item.id));
        },
        handleDelete(id) {
            this.$confirm(
                "删除后同时删除线路下分团及成员，确定要删除吗？",
                "系统提示",
                {
                    confirmButtonText: "确定删除",
                    showCancelButton: false,
                    type: "warning"
                }
            )
                .then(() => {
                    LineDel({ id: id }).then(res => {
                        this.$message.success("删除成功！");
                        this.getData();
                    });
                })
                .catch(() => {});
        },
        // 批量时间
        plTime(){
        this.dialogTime = true
        },
        //复选框
        handleSelection(val) {
            this.multipleSelection = val;
            // console.log(val)
            this.idList = []
            let listId = [] = val
            listId.forEach(res => {
                this.idList.push(res.id)
            });
        }
    }
};
</script>
