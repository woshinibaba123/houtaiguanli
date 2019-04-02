<template>
    <div>
        <div class="app-container margin-top-10">
            <div class="filter-container font-120">
                线路名称：{{title}}<span v-if="beizhu!=''">（{{beizhu}}）</span>
            </div>
            <div class="filter-container margin-top-20">
                <el-input @keyup.enter.native="handleFilter" style="width: 290px;" class="filter-item" placeholder="检索：分团名称、领队信息"
                    :clearable="true" v-model="listQuery.keys">
                </el-input>
                <el-button class="filter-item" type="primary" v-waves plain icon="el-icon-search" @click="handleFilter">搜索</el-button>
                <el-button class="filter-item" type="primary" v-waves icon="el-icon-circle-plus-outline" v-if="authCheck(78)"
                    @click="newEdit(null)">新增团队</el-button>
                <el-button class="filter-item" type="primary" v-waves icon="el-icon-circle-plus-outline" v-if="authCheck(88)"
                    @click="newPeople()">新增成员</el-button>
            </div>
            <el-table :data="tableData" fit stripe highlight-current-row v-loading="loading" :max-height="clientHeight"
                element-loading-text="数据载入中" @sort-change="handleSort">
                <!-- <el-table-column label="序号" type="index" width="60" align="center"></el-table-column> -->
                <el-table-column label="分团名称" min-width="260" prop="title" show-overflow-tooltip sortable="custom"></el-table-column>
                <el-table-column label="领队信息" min-width="180" prop="ld" show-overflow-tooltip sortable="custom">
                    <template slot-scope="scope">
                        {{scope.row.ld||'--'}}
                    </template>
                </el-table-column>
                <el-table-column label="成员" min-width="130">
                    <template slot-scope="scope">
                        共 {{scope.row.count}} 人
                        <el-button class="no-padding no-margin" type="text" v-if="authCheck(104)" @click="handleUser(scope.row.id,scope.row.title)">查看</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="成员设置" min-width="120">
                    <template slot-scope="scope">
                        <!-- 共 {{scope.row.children.length}} 人 -->
                        <el-button type="text" class="no-margin no-padding" v-if="authCheck(82)" @click="handlePeople(scope.row.id,scope.row.title)">设置</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="出行时间" min-width="190" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.start_time}} ~ {{scope.row.end_time}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="170" fixed="right" class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                        <el-button v-if="authCheck(80)" type="primary" size="mini" v-waves plain icon="el-icon-edit"
                            @click="newEdit(scope.row.id)">编辑</el-button>
                        <el-button v-if="authCheck(81)" type="danger" size="mini" v-waves plain icon="el-icon-delete"
                            @click="handleDelete(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <Page v-model="listQuery" :total="total" />
        <team-newedit  :dialogStatus="dialogStatus" :tdid="tdid" :newTitle="newTitle" :shuoming="shuoming" :xlid="xlid" :start_time="start_time"
            :end_time="end_time" @CB-dialogStatus="CB_dialogStatus"></team-newedit>
        <team-user :dialogUserset="dialogUserset" :ftid="ftid" :xlid="xlid" :xtitle="xtitle" @CB-dialogUserset="CB_dialogUserset"></team-user>
        <new-people :dialogPeople="dialogPeople" :p_id="p_id" @CB-dialogPeople="CB_dialogPeople"></new-people>
        <people-user :dialogUser="dialogUser" :xlid="xlid" :tdid="tdid" :xtitle="xtitle" @CB-dialogUser="CB_dialogUser"></people-user>
    </div>
</template>

<script>
import { mapState } from "vuex";
import waves from "@/directive/waves"; // 水波纹指令
import { TeamList, TeamDel } from "@/api/line";
import PeopleUser from "./userlist";

import NewPeople from "./newPeople";
import TeamNewedit from "./newEdit";
import TeamUser from "./user_set";
export default {
    name: "subgroup_index",
    directives: { waves },
    computed: {
        clientHeight() {
            return this.$store.state.clientHeight - 115;
        }
    },
    components: { TeamNewedit, TeamUser, NewPeople, PeopleUser },
    data() {
        return {
            total: 0,
            loading: false,
            tableData: [],
            tdid: null,
            xlid: null,
            dialogStatus: false,
            ftid: null,
            beizhu: "",
            title: "",
            xtitle: "",
            dialogUser: false,
            tdid: null,
            dialogUserset: false,
            p_id: null,
            dialogPeople: false,
            end_time: "",
            start_time: "",
            newTitle: "",
            shuoming:"",
            multipleSelection: [],
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
        this.listQuery.listRows = this.$store.state.pageSize;
        this.listQuery.p_id = JSON.parse(JSON.stringify(this.$route.params.id));
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
        newPeople() {
            this.p_id = this.$route.params.id;
            this.dialogPeople = true;
        },
        CB_dialogPeople(val) {
            this.p_id = null;
            this.dialogPeople = false;
        },
        //获取主数据
        getData() {
            this.loading = true;
            TeamList(this.listQuery)
                .then(rs => {
                    this.loading = false;
                    this.tableData = rs.data;
                    this.start_time = rs.info.start_time;
                    this.end_time = rs.info.end_time;
                    this.title = rs.info.title;
                    this.beizhu = rs.info.beizhu;
                    this.total = rs.count;
                })
                .catch(() => {
                    this.loading = false;
                });
        },
        //查看成员
        handleUser(id, title) {
            this.xlid = JSON.parse(JSON.stringify(this.$route.params.id));
            this.tdid = id;
            this.xtitle = title;
            this.dialogUser = true;
        },
        CB_dialogUser(val) {
            if (val) {
                this.getData();
            }
            this.xlid = null;
            this.tdid = null;
            this.xtitle = "";
            this.dialogUser = false;
        },
        //管理成员
        handlePeople(id, title) {
            this.xlid = JSON.parse(JSON.stringify(this.$route.params.id));
            this.ftid = id ? id : null;
            this.xtitle = title;
            this.dialogUserset = true;
        },
        CB_dialogUserset(val) {
            if (val) {
                this.getData();
            }
            this.xlid = null;
            this.xtitle = "";
            this.ftid = null;
            this.dialogUserset = false;
        },
        //新增编辑分团
        newEdit(id) {
            console.log(this.beizhu)
            this.xlid = this.$route.params.id ? this.$route.params.id : null;
            this.tdid = id ? id : null;
            this.newTitle = this.title;
            this.shuoming = this.beizhu
            this.dialogStatus = true;
        },
        CB_dialogStatus(val) {
            if (val) {
                this.getData();
            }
            this.newTitle = "";
            this.xlid = null;
            this.tdid = null;
            this.dialogStatus = false;
        },
        handleDelete(id) {
            this.$confirm(
                "删除将同时移除分团下分配的成员，确定要删除吗？",
                "系统提示",
                {
                    confirmButtonText: "确定删除",
                    showCancelButton: false,
                    type: "warning"
                }
            )
                .then(() => {
                    TeamDel({ id: id }).then(rs => {
                        this.$message.success("删除成功！");
                        this.getData();
                    });
                })
                .catch(() => {});
        }
    }
};
</script>
