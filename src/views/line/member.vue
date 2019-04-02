<template>
    <!--编辑编辑角色弹框-->
    <el-dialog v-el-drag-dialog :title="xtitle+'报名人数'" width="880px" top="10vh" :visible="dialogMember" @close="handleClose"
        @open="readNode">
        <el-row class="margin-bottom-10">
            <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="检索：姓名、工号"
                :clearable="true" v-model="listQuery.keys">
            </el-input>
            <Xisuo :values="listQuery"></Xisuo>
            <el-button class="filter-item" type="primary" v-waves plain icon="el-icon-search" @click="handleFilter">搜索</el-button>
            <Download model="baoming" name="导出报名人数" :value="listQuery"></Download>
        </el-row>
        <div :style="{'min-height':clientHeight+'px'}">
            <el-table :data="tableData" fit stripe highlight-current-row v-loading="loading" :max-height="clientHeight"
                element-loading-text="数据载入中" @sort-change="handleSort">
                <el-table-column label="序号" type="index" width="60"></el-table-column>
                <el-table-column label="教师姓名" prop="name" min-width="100" show-overflow-tooltip sortable="custom">
                </el-table-column>
                <el-table-column label="工号" prop="account" min-width="100" show-overflow-tooltip sortable="custom">
                </el-table-column>
                <el-table-column label="所属部门" prop="xisuo" min-width="150" show-overflow-tooltip sortable="custom">
                    <template slot-scope="scope">
                        {{scope.row.xisuo_title||'--'}}
                    </template>
                </el-table-column>
                <el-table-column label="手机号码" prop="phone" min-width="150" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.phone||'--'}}
                    </template>
                </el-table-column>
                <el-table-column label="审核状态" prop="status" min-width="150" show-overflow-tooltip sortable="custom">
                    <template slot-scope="scope">
                        <span :class="scope.row.status|shenheColor">
                            <i :class="scope.row.status|shenheIcon"></i> {{scope.row.status|shenheState}}
                        </span>
                    </template>
                </el-table-column>
                <!-- <el-table-column align="center" label="操作" width="100" fixed="right" class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                        <el-button type="danger" size="mini" v-waves plain icon="el-icon-delete" @click="handleDelete(scope.row.id)">移除</el-button>
                    </template>
                </el-table-column> -->
            </el-table>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-pagination :current-page="listQuery.page" :page-sizes="$store.state.pageSizes" :page-size="$store.state.pageSize"
                :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
                @current-change="handleCurrentChange" />
        </div>
    </el-dialog>
</template>

<script>
import elDragDialog from "@/directive/el-dragDialog"; //拖拽
import waves from "@/directive/waves"; // 水波纹指令
import { mapState } from "vuex";
import { MemberList, MemberDel } from "@/api/line.js";

export default {
    name: "member_index",
    props: {
        dialogMember: Boolean,
        memID: [String, Number],
        xtitle: String
    },
    computed: {
        ...mapState([]),
        clientHeight() {
            return this.$store.state.clientHeight - 300;
        }
    },
    directives: { elDragDialog, waves },
    data() {
        return {
            total: 0,
            loading: false,
            tableData: [],
            typestate: false,
            listQuery: {
                p_id: this.memID,
                keys: "",
                _order: "",
                _sort: "",
                page: 1,
                type: 2,
                listRows: this.$store.state.pageSize
            }
        };
    },
    methods: {
        readNode() {
            this.typestate = false;
            if (this.memID === "" || this.memID === null) return;
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
        //读取数据
        getData() {
            this.loading = true;
            this.listQuery.p_id = this.memID;
            MemberList(this.listQuery)
                .then(res => {
                    this.total = res.count;
                    this.tableData = res.data;
                    this.loading = false;
                })
                .catch(() => {
                    this.loading = false;
                });
        },
        //移除
        handleDelete(id) {
            this.$confirm("确定要将该成员移除码？", "系统提示", {
                confirmButtonText: "确定移除",
                showCancelButton: false,
                type: "warning"
            }).then(() => {
                MemberDel({ id: id })
                    .then(() => {
                        this.$message.success("移除成功！");
                        this.typestate = true;
                        this.getData();
                    })
                    .catch(() => {});
            });
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
        //关闭
        handleClose() {
            this.$emit("CB-dialogMember", this.typestate);
        }
    }
};
</script>
