<template>
    <div style="overflow-x: auto;">
        <div class="app-container">
            <div class="filter-container">
                <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="检索：内容名称" :clearable="true" v-model="listQuery.keys">
                </el-input>
                <el-button class="filter-item margin-right-10" type="primary" v-waves plain icon="el-icon-search" @click="handleFilter">搜索</el-button>
                <el-button class="filter-item margin-right-10" v-waves type="primary" icon="el-icon-circle-plus-outline" @click="handleADD" v-if="authCheck(3)">新增</el-button>
            </div>
            <div class="custom-tree-container" v-loading="loading" element-loading-text="数据载入中" style="min-width:1200px;">
                <el-tree class="filter-tree" :data="tableData" :expand-on-click-node="false" default-expand-all :props="defaultProps" node-key="id" highlight-current :filter-node-method="filterNode" ref="nodeTree" empty-text="啊哦，您还没有编辑菜单哦！" @node-drop="handleDrop" draggable :allow-drop="allowDrop" :allow-drag="allowDrag">
                    <span class="custom-tree-node" slot-scope="{ node, data }">
                        <span style="min-width:140px">
                            {{ node.label }}
                            <el-tag size="mini" disable-transitions class="margin-left-10" type="info">ID：{{data.id}}</el-tag>
                        </span>

                        <span>
                            <span class="spanText" style="min-width:100px">
                                {{ data.api_name}}
                            </span>
                            <span class="spanText" style="min-width:180px">
                                {{ data.name }}
                            </span>
                            <span class="spanText hidden-md" style="width:40px">
                                {{ data.method || '--' }}
                            </span>
                            <span class="spanText hidden-md" style="width:70px" v-if="authCheck(14)">
                                <el-tooltip effect="dark" content="节点排序，数字越大，排列越靠前。" placement="left">
                                    <el-input-number :controls="false" size="small" v-model="data.sort" style="width:100%" @keyup.enter.native="handleSort(data)"></el-input-number>
                                </el-tooltip>
                            </span>
                            <div class="spanText" style="width:250px;float:right ">
                                <el-button type="primary" plain size="mini " @click="()=> append(data.path)" v-if="authCheck(3)">
                                    <i class="el-icon-circle-plus-outline"></i> 新增
                                </el-button>
                                <el-button type="primary" plain size="mini " @click="()=> edit(data.id)" v-if="authCheck(4)">
                                    <i class="el-icon-edit"></i> 编辑
                                </el-button>
                                <el-button type="danger" plain size="mini" @click="() => remove(data.id)" v-if="authCheck(5)">
                                    <i class="el-icon-delete"></i> 删除
                                </el-button>
                            </div>

                        </span>
                    </span>
                </el-tree>
            </div>
        </div>
        <nodeAdd :dialogStatus="dialogStatus" :nodeid="nodeid" :path="path" @CB-dialogStatus="CB_dialogStatus"></nodeAdd>
    </div>
</template>

<script>
import { nodeList, nodeDel, nodeSort, nodeDrag } from "@/api/system/node.js";
import waves from "@/directive/waves"; // 水波纹指令
import nodeAdd from "./node_add";

export default {
    name: "node",
    directives: {
        waves
    },
    data() {
        return {
            loading: false,
            tableData: [],
            dialogStatus: false,
            nodeid: "",
            path: [],
            defaultProps: {
                children: "children",
                label: "title"
            },
            sortData: [],
            listQuery: {
                keys: ""
            }
        };
    },
    created() {
        this.getData();
    },
    methods: {
        //编辑
        handleADD() {
            this.path = [0];
            this.dialogStatus = true;
        },
        // 编辑节点
        append(path) {
            this.path = path;
            this.dialogStatus = true;
        },
        //编辑
        edit(id) {
            this.nodeid = id;
            this.path = [];
            this.dialogStatus = true;
        },
        // 删除
        remove(id) {
            this.$confirm("删除后不可恢复，确定要删除吗？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    nodeDel({ id: id })
                        .then(rs => {
                            this.$message({
                                type: "success",
                                message: "删除成功"
                            });
                            this.getData();
                        })
                        .catch(() => {});
                })
                .catch(() => {});
        },
        //节点排序
        handleSort(data) {
            nodeSort({ sort: data.sort, id: data.id })
                .then(rs => {
                    this.$message({
                        type: "success",
                        message: "排序成功"
                    });
                    this.sortData = [];
                    this.getData();
                })
                .catch(() => {});
        },
        //筛选节点数据
        filterNode(value, data) {
            if (!value) return true;
            return data.title.indexOf(value) !== -1;
        },
        //根据条件检索
        handleFilter() {
            this.$refs.nodeTree.filter(this.listQuery.keys);
        },
        //获取主数据
        getData() {
            this.loading = true;
            nodeList()
                .then(rs => {
                    this.tableData = rs;
                    this.loading = false;
                })
                .catch(() => {
                    this.loading = false;
                });
        },
        CB_dialogStatus(val) {
            if (val) {
                setTimeout(() => {
                    this.getData();
                }, 200);
            }
            this.dialogStatus = false;
            this.path = [];
            this.nodeid = "";
        },

        //拖拽成功完成时触发的事件
        handleDrop(draggingNode, dropNode, dropType, ev) {
            const id = draggingNode.key;
            const pid = dropNode.key;
            this.loading = true;
            nodeDrag({ id: id, pid: pid, type: dropType })
                .then(rs => {
                    this.loading = false;
                })
                .catch(() => {
                    this.loading = false;
                });
        },
        //拖拽时判定目标节点能否被放置
        allowDrop(draggingNode, dropNode, type) {
            return true;
        },
        //判断节点能否被拖拽
        allowDrag(draggingNode) {
            return true;
        }
    },
    components: {
        nodeAdd
    }
};
</script>
