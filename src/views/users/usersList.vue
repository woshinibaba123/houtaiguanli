<template>
    <div>
        <div class="app-container">
            <div class="filter-container">
                <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="检索：用户名、姓名"
                    :clearable="true" v-model="listQuery.keys">
                </el-input>
                <el-select clearable class="filter-item" v-model="listQuery.status" placeholder="根据状态筛选用户">
                    <el-option v-for="item in  UserStatusOptions" :key="item.id" :label="item.title" :value="item.id">
                    </el-option>
                </el-select>
                <el-button class="filter-item" type="primary" v-waves plain icon="el-icon-search" @click="handleFilter">搜索</el-button>
                <el-button class="filter-item margin-left-10" v-waves @click="handleCreate" type="primary" v-if="authCheck(17)"
                    icon="el-icon-circle-plus-outline">新增</el-button>
                <el-button class="filter-item" v-waves type="danger" icon="el-icon-delete" v-if="multipleSelection.length > 0 && authCheck(20)"
                    @click="handlePlDelete">批量移除</el-button>
                <!-- <goBack class="filter-item"></goBack> -->
            </div>

            <el-table :key='tableKey' :data="dataList" v-loading="listLoading" element-loading-text="数据载入中"
                @selection-change="handleSelectionChange" @sort-change="handleSort" fit stripe>
                <el-table-column align="center" type="selection" width="45"></el-table-column>
                <el-table-column min-width="150px" prop="account" label="用户名" show-overflow-tooltip sortable></el-table-column>
                <el-table-column min-width="110px" prop="name" label="姓名" show-overflow-tooltip sortable></el-table-column>
                <el-table-column min-width="160" prop="xisuo" label="系所" show-overflow-tooltip sortable="custom" v-if="$route.params.group==9">
                    <template slot-scope="scope">
                        <span v-if="scope.row.xisuo">{{scope.row.xisuo|division}}</span>
                        <span v-else>--</span>
                    </template>
                </el-table-column>
                <el-table-column min-width="120px" prop="title" label="用户组" show-overflow-tooltip></el-table-column>
                <el-table-column min-width="100px" align="center" prop="status" label="状态" sortable>
                    <template slot-scope="scope">
                        <i :class="scope.row.status == '2'?'el-icon-success text-primary font-60':'el-icon-remove text-danger'"></i>
                        {{scope.row.status|statusFilter}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="170" fixed="right" class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                        <el-button class="no-margin padding-5" plain size="mini" type="info" v-if="scope.row.status=='2' && authCheck(22)"
                            @click="handleStatus(scope.row.id,'1')">
                            <i class="el-icon-remove font-60"></i> 禁用</el-button>
                        <el-button class="no-margin padding-5" plain size="mini" type="warning" v-if="scope.row.status=='1' && authCheck(22)"
                            @click="handleStatus(scope.row.id,'2')">
                            <i class="el-icon-success font-60"></i> 启用</el-button>
                        <el-button class="no-margin padding-5" plain size="mini" type="danger" icon="el-icon-delete"
                            @click="handleDelete(scope.row.id,scope.row.name,scope.row.title)">移除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination-container">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="listQuery.page" :page-sizes="pageSizes" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>
        <usersAdd :dialogFormVisible="dialogFormVisible" :dialogStatus="dialogStatus" :usid="usid" :group="group"
            :groupTitle="groupTitle" @CB-dialogStatus="CB_dialogStatus"></usersAdd>
    </div>
</template>

<script>
import { mapState } from "vuex";
import waves from "@/directive/waves"; // 水波纹指令
import {
    getuserGroup,
    userList,
    userDel,
    userQiyong,
    ResetPassword
} from "@/api/system/user";
import goBack from "@/components/goBack";
import usersAdd from "./users_add";

const UserStatusOptions = [
    { id: "2", title: "正常" },
    { id: "1", title: "禁用" }
];

export default {
    name: "userList",
    directives: { waves },
    components: { usersAdd, goBack },
    computed: mapState({
        pageSizes: state => state.pageSizes,
        pageSize: state => state.pageSize,
        userGroup: state => state.userGroup
    }),
    data() {
        return {
            tableKey: 0,
            dataList: [],
            multipleSelection: [],
            total: 0,
            listLoading: false,
            usid: null,
            dialogStatus: "create",
            listQuery: {
                listRows: this.$store.state.pageSize,
                page: 1,
                keys: "",
                group: null,
                status: null,
                _sort: "desc",
                _order: "id"
            },
            UserStatusOptions,
            dialogFormVisible: false,
            group: "",
            groupTitle: ""
        };
    },
    filters: {
        statusFilter(status) {
            const statusMap = {
                "2": "正常",
                "1": "禁用"
            };
            return statusMap[status];
        },
        statusFeiFilter(status) {
            const statusMap = {
                "1": "启用",
                "2": "禁用"
            };
            return statusMap[status];
        },
        colorFeiFilter(status) {
            const statusMap = {
                "1": "text-success",
                "2": "text-muted"
            };
            return statusMap[status];
        }
    },
    activated() {
        this.listQuery.group = this.$route.params.group;
        this.getList();
        this.getGroup();
    },
    methods: {
        //排序
        handleSort(val) {
            this.listQuery._order = val.prop;
            if (val.order == "ascending") {
                this.listQuery._sort = "asc";
            } else {
                this.listQuery._sort = "desc";
            }
            this.getList();
        },
        getGroup() {
            getuserGroup()
                .then(rs => {
                    this.$store.dispatch("setUserGroup", rs);
                })
                .catch(() => {});
        },
        //获取主数据
        getList() {
            this.listLoading = true;
            userList(this.listQuery)
                .then(rs => {
                    this.dataList = rs.data;
                    this.total = rs.count;
                    this.listLoading = false;
                })
                .catch(() => {
                    this.listLoading = false;
                });
        },
        //根据条件检索
        handleFilter() {
            this.listQuery.page = 1;
            this.getList();
        },
        //改变每页显示条数时
        handleSizeChange(val) {
            this.$store.dispatch("setPageSize", val);
            this.listQuery.listRows = val;
            this.getList();
        },
        //当前变更时
        handleCurrentChange(val) {
            this.listQuery.page = val;
            this.getList();
        },
        //列表多选
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        //重置密码
        resetPass(id) {
            this.$confirm(
                "重置后密码为手机号后六位数字，确认要重置么？",
                "系统提示",
                {
                    confirmButtonText: "确认重置",
                    type: "warning"
                }
            )
                .then(() => {
                    ResetPassword({ id: id }).then(res => {
                        this.$message.success(
                            "重置成功,重置后密码为：" + res.password
                        );
                    });
                })
                .catch(() => {});
        },
        //编辑管理员
        handleUpdate(id) {
            this.usid = id;
            if (this.$route.params.group) {
                this.group = this.$route.params.group;
            } else {
                this.group = "";
            }
            let item = this.userGroup.find(item => {
                return item.id == this.group;
            });
            if (item) {
                this.groupTitle = item.title;
            } else {
                this.groupTitle = "";
            }
            this.dialogStatus = "update";
            this.dialogFormVisible = true;
        },
        //批量移除
        handlePlDelete() {
            if (this.multipleSelection.length === 0) {
                this.$message.warning("请选择删除的数据！");
                return;
            }
            this.handleDelete(this.multipleSelection.map(item => item.id));
        },
        //移除
        handleDelete(row, name, title) {
            this.$confirm("确定要将该教师从当前管理员中移除吗？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    userDel({ id: row })
                        .then(rs => {
                            this.$message({
                                type: "success",
                                message: "移除成功！"
                            });
                            this.getList();
                        })
                        .catch(() => {});
                })
                .catch(() => {});
        },
        //编辑管理员
        handleCreate() {
            if (this.$route.params.group) {
                this.group = this.$route.params.group;
            } else {
                this.group = "";
            }
            let item = this.userGroup.find(item => {
                return item.id == this.group;
            });
            if (item) {
                this.groupTitle = item.title;
            } else {
                this.groupTitle = "";
            }
            this.dialogStatus = "create";
            this.dialogFormVisible = true;
        },
        CB_dialogStatus(val) {
            if (val) {
                this.getList();
            }
            this.usid = null;
            this.dialogFormVisible = false;
            this.group = "";
            this.groupTitle = "";
        },
        //禁用启用
        handleStatus(id, status) {
            userQiyong({ id: id, status: status }).then(rs => {
                this.$message({
                    type: "success",
                    message: "操作成功"
                });
                this.getList();
            });
        }
    }
};
</script>
