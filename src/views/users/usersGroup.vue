<template>
    <div>
        <div class="app-container">
            <div class="filter-container">
                <el-input @keyup.enter.native="handleFilter" style="width: 250px;" class="filter-item" placeholder="检索：用户组名称、教师、描述"
                    :clearable="true" v-model="listQuery.keys">
                </el-input>
                <el-select clearable class="filter-item" v-model="listQuery.status" placeholder="根据状态筛选用户组" style="width: 180px;">
                    <el-option v-for="item in  GroupStatusOptions" :key="item.id" :label="item.title" :value="item.id">
                    </el-option>
                </el-select>
                <el-button class="filter-item margin-right-10" type="primary" v-waves plain icon="el-icon-search"
                    @click="handleFilter">搜索</el-button>
                <el-button class="filter-item" v-waves @click="handleCreate" type="primary" icon="el-icon-circle-plus-outline"
                    v-if="authCheck(24)">新增</el-button>
            </div>
            <el-table :key='tableKey' :data="dataList" v-loading="listLoading" element-loading-text="数据载入中" fit stripe>
                <el-table-column align="center" prop="id" label="ID" width="65" sortable></el-table-column>
                <el-table-column min-width="150px" prop="title" label="用户组名称" show-overflow-tooltip sortable></el-table-column>
                <el-table-column min-width="260px" prop="describe" label="用户组描述" show-overflow-tooltip sortable></el-table-column>
                <el-table-column min-width="100px" align="center" prop="status" label="状态" sortable>
                    <template slot-scope="scope">
                        <i :class="scope.row.status == '2'?'el-icon-success text-primary font-60':'el-icon-remove text-muted'"></i>
                        {{scope.row.status|statusFilter}}
                    </template>
                </el-table-column>
                <el-table-column align="right" label="操作" width="250" fixed="right" class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" plain icon="el-icon-setting" @click="quanxian(scope.row.id,scope.row.title)"
                            v-if="authCheck(29)"> 权限 </el-button>
                        <router-link :to="{name:'list',params:{group:scope.row.id}}" class="el-button el-button--primary el-button--mini is-plain"
                            tag="button" v-if="authCheck(16)">
                            <i class="el-icon-edit"></i> 成员
                        </router-link>
                        <el-dropdown trigger="click" class="margin-left-10" v-if="authCheck(25)||authCheck(26)||authCheck(31)" @command="handleCommand">
                            <el-button type="info" size="mini" plain>
                                更多
                                <i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item :command="{type:'status',ID:scope.row.id,status:scope.row.status}"
                                    v-if="authCheck(31)">
                                    <span v-bind:class="scope.row.status|colorFeiFilter">{{scope.row.status|statusFeiFilter}}</span>
                                </el-dropdown-item>
                                <el-dropdown-item :command="{type:'edit',ID:scope.row.id}" v-if="authCheck(26)">
                                    <span class="text-primary">编辑</span>
                                </el-dropdown-item>
                                <el-dropdown-item :command="{type:'delete',ID:scope.row.id}" v-if="authCheck(25)">
                                    <span class="text-danger">删除</span>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
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
        <groupAdd :dialogState="dialogState" :groupId="groupId" @CB-dialogState="CB_dialogState">用户组编辑编辑Dialog</groupAdd>
        <nodeTree :dialogStatus="dialogStatus" :rlid="rlid" :groupTitle="groupTitle" @CB-dialogStatus="CB_dialogStatus">用户组权限节点Dialog</nodeTree>

    </div>
</template>

<script>
import { mapState } from "vuex";
import { groupList, groupDel, groupSet } from "@/api/system/userGroup";
import waves from "@/directive/waves"; // 水波纹指令
import groupAdd from "./group_add";
import nodeTree from "./node_tree";

const GroupStatusOptions = [
    { id: "2", title: "启用" },
    { id: "1", title: "禁用" }
];

export default {
    name: "userGroup",
    directives: {
        waves
    },
    data() {
        return {
            tableKey: 0,
            dataList: [],
            total: null,
            listLoading: false,
            listQuery: {
                page: 1,
                listRows: this.$store.state.pageSize,
                keys: this.keys,
                group: this.group,
                _order: "id",
                _sort: "asc"
            },
            GroupStatusOptions,
            // 新增（编辑）窗口
            // groupId 用户组Id
            dialogState: false,
            groupId: "",
            // 权限节点窗口
            //  rlid 用户组Id
            //  groupTitle 用户组名称
            dialogStatus: false,
            rlid: "",
            groupTitle: ""
        };
    },
    filters: {
        statusFilter(status) {
            const statusMap = {
                "2": "启用",
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
        },
        colorFilter(status) {
            const statusMap = {
                "2": "text-success",
                "1": "text-danger"
            };
            return statusMap[status];
        }
    },
    created() {
        this.getData();
    },
    methods: {
        //获取主数据
        getData() {
            this.listLoading = true;
            groupList(this.listQuery)
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
            this.getData();
        },
        //改变每页显示条数时
        handleSizeChange(val) {
            this.$store.dispatch("setPageSize", val);
            this.listQuery.listRows = val;
            this.getData();
        },
        //当前变更时
        handleCurrentChange(val) {
            this.listQuery.page = val;
            this.getData();
        },
        handleModifyStatus(row, status) {
            this.$message({
                message: "操作成功",
                type: "success"
            });
            row.status = status;
        },

        //编辑用户组
        handleCreate() {
            this.dialogState = true;
        },
        //编辑用户组
        handleUpdate(id) {
            this.groupId = id;
            this.dialogState = true;
        },
        //删除角色组
        handleDelete(val) {
            this.$confirm("删除后不可恢复，确定要删除吗？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    groupDel({ id: val })
                        .then(rs => {
                            this.$message({
                                message: "数据删除成功！",
                                type: "success"
                            });
                            this.getData();
                        })
                        .catch(() => {});
                })
                .catch(() => {});
        },
        //启用、锁定
        lock(id, status) {
            this.listLoading = true;
            let val = status == "2" ? "1" : "2";
            groupSet({
                id: id,
                status: val
            })
                .then(rs => {
                    this.listLoading = false;
                    this.$message.success("操作成功");
                    this.getData();
                })
                .catch(() => {
                    this.listLoading = false;
                });
        },
        //用户组Dialog回调
        CB_dialogState(val) {
            if (val === 1) {
                this.getData();
            }
            this.groupId = "";
            this.dialogState = false;
        },
        //用户组权限设置Dialog
        quanxian(id, title) {
            this.rlid = id;
            this.groupTitle = "设置【" + title + "】权限";
            this.dialogStatus = true;
        },
        CB_dialogStatus() {
            this.rlid = "";
            this.groupTitle = "";
            this.dialogStatus = false;
        },
        //点击下拉菜单按钮时触发
        handleCommand(row) {
            //根据传递的类型参数判断执行对应的方法
            switch (row.type) {
                //跳转到启用/锁定的方法
                case "status":
                    this.lock(row.ID, row.status);
                    break;
                //跳转到编辑的方法
                case "edit":
                    this.handleUpdate(row.ID);
                    break;
                //跳转到删除的方法
                case "delete":
                    this.handleDelete(row.ID);
                    break;
            }
        }
    },
    //计算属性
    computed: mapState({
        pageSizes: state => state.pageSizes,
        pageSize: state => state.pageSize
    }),
    components: {
        groupAdd,
        nodeTree
    }
};
</script>
