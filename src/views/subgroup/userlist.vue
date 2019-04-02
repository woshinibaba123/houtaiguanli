<template>
    <el-dialog v-el-drag-dialog :title="xtitle" top="10vh" width="840px" :visible="dialogUser" @open="openDialog"
        @close="closeDialog">
        <el-row class="filter-container">
            <el-input @keyup.enter.native="handleFilter" style="width: 230px;" class="filter-item" placeholder="检索：教师姓名、工号"
                :clearable="true" v-model="listQuery.keys"></el-input>
            <Xisuo :values="listQuery"></Xisuo>
            <el-button class="filter-item" type="primary" v-waves plain icon="el-icon-search" @click="handleFilter">搜索</el-button>
            <el-button class="filter-item" type="primary" v-waves plain icon="el-icon-set" @click="handleSet">成员设置</el-button>
        </el-row>
        <div :style="{'min-height':clientHeight-210+'px'}">
            <el-table :data="peopleData" fit stripe highlight-current-row v-loading="loading" element-loading-text="数据载入中"
                @sort-change="handleSort" :max-height="clientHeight-210">
                <el-table-column label="序号" type="index" width="60"></el-table-column>
                <el-table-column label="姓名" min-width="110" prop="name" sortable="custom"></el-table-column>
                <el-table-column label="工号" min-width="110" prop="account" sortable="custom"></el-table-column>
                <el-table-column label="所在部门" min-width="160" show-overflow-tooltip prop="xisuo" sortable="custom">
                    <template slot-scope="scope">
                        {{scope.row.xisuo_title||'--'}}
                    </template>
                </el-table-column>
                <el-table-column label="手机号码" min-width="120" show-overflow-tooltip prop="phone">
                    <template slot-scope="scope">
                        {{scope.row.phone||'--'}}
                    </template>
                </el-table-column>
                <el-table-column label="电子邮箱" min-width="160" prop="email" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.email||'--'}}
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <user-set :dialogUserset="dialogUserset" :ftid="ftid" :xlid="xlid" :xtitle="xtitle" @CB-dialogUserset="CB_dialogUserset"></user-set>
        <div slot="footer" class="dialog-footer">
            <el-pagination :current-page="listQuery.page" :page-sizes="$store.state.pageSizes" :page-size="$store.state.pageSize"
                :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
                @current-change="handleCurrentChange" />
        </div>
    </el-dialog>
</template>
<script>
import { mapState } from "vuex";
import elDragDialog from "@/directive/el-dragDialog"; //拖拽
import waves from "@/directive/waves"; // 水波纹指令
import UserSet from "./user_set";

import { ApplyIndex } from "@/api/apply";
export default {
    name: "user-list",
    props: {
        dialogUser: Boolean,
        xtitle: String,
        xlid: [String, Number],
        tdid: [String, Number]
    },
    computed: {
        clientHeight() {
            return this.$store.state.clientHeight - 115;
        }
    },
    components: { UserSet },
    directives: { elDragDialog, waves },
    data() {
        return {
            total: 0,
            loading: false,
            dialogUserset: false,
            ftid: null,
            peopleData: [],
            typestate: false,
            listQuery: {
                keys: "",
                _order: "id",
                _sort: "desc",
                page: 1,
                type: 1,
                listRows: this.$store.state.pageSize
            }
        };
    },
    methods: {
        openDialog() {
            if (this.tdid === null || this.tdid === "") return;
            this.listQuery.ft = this.tdid;
            this.getData();
        },
        //根据条件检索
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
        getData() {
            this.loading = true;
            ApplyIndex(this.listQuery)
                .then(res => {
                    this.total = res.count;
                    this.peopleData = res.data;
                    this.loading = false;
                })
                .catch(() => {
                    this.loading = false;
                });
        },
        //成员设置
        handleSet() {
            this.ftid = JSON.parse(JSON.stringify(this.tdid));
            this.dialogUserset = true;
        },
        CB_dialogUserset(val) {
            if (val) {
                this.getData();
                this.typestate = true;
            }
            this.ftid = null;
            this.dialogUserset = false;
        },
        //改变每页显示条数时
        handleSizeChange(val) {
            this.$store.dispatch("setPageSize", val).then(() => {
                this.listQuery.listRows = val;
                this.getData();
            });
        },
        //当前变更时
        handleCurrentChange(val) {
            this.listQuery.page = val;
            this.getData();
        },
        closeDialog() {
            this.$emit("CB-dialogUser", this.typestate);
        },
        clearForm() {
            this.peopleData = [];
        }
    }
};
</script>
<style>
.demo-transfer .el-transfer-panel {
    width: 300px !important;
}
.el-transfer-panel .el-transfer-panel__footer {
    height: 30px !important;
}
.el-transfer-panel .el-transfer-panel__header .el-checkbox .el-checkbox__label {
    font-size: 14px !important;
}
</style>
