<template>
    <el-dialog v-el-drag-dialog :title="times+'疗休养周期人数设置'" width="900px" top="20vh" :visible="dialogSet" @open="openDialog"
        @close="closeDialog">
        <div style="height:380px">
            <el-button type="primary" class="margin-bottom-10" icon="el-icon-circle-plus-outline" v-if="currentYear <= end_time && currentYear >= start_time &&authCheck(49)"
                @click="newEdit(null)">新增年份</el-button>
            <el-table :data="tableData" fit stripe highlight-current-row v-loading="loading" element-loading-text="数据载入中"
                @sort-change="handleSort" show-summary :summary-method="getSummaries">
                <el-table-column label="年份" prop="nf" min-width="90" sortable="custom"></el-table-column>
                <el-table-column label="名额" min-width="80" prop="count" sortable="custom">
                    <template slot-scope="scope">
                        <span v-if="scope.row.count===0">
                            尚未设置
                        </span>
                        <span v-else>{{scope.row.count}}</span>
                    </template>
                </el-table-column>
                                <el-table-column label="当年退休人数" min-width="80" prop="count" sortable="custom">
                    <template slot-scope="scope">
                        <span v-if="scope.row.count===0">
                            0
                        </span>
                        <span v-else>
                        {{scope.row.count}}人
						<el-button class="no-margin no-padding" type="text" @click="viewData('retired',scope.row.nf)">查看</el-button>
                        </span>
                    </template>
                </el-table-column>
                  <el-table-column label="刚满5年人数" min-width="80" prop="count" sortable="custom">
                    <template slot-scope="scope">
                        <span v-if="scope.row.count===0">
                            0
                        </span>
                        <span v-else>
							{{scope.row.count}}人
							<el-button class="no-margin no-padding" type="text" @click="viewData('mw',scope.row.nf)">查看</el-button>
						</span>
                    </template>
                </el-table-column>
			 <el-table-column label="第一批次人数" min-width="80" prop="count" sortable="custom">
                    <template slot-scope="scope">
                        <span v-if="scope.row.count===0">
                            0
                        </span>
                        <span v-else>
							{{scope.row.count}}人
							<el-button class="no-margin no-padding" type="text" @click="viewData('firstBatch',scope.row.nf)">查看</el-button>
						</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="180" sortable="custom" v-if="currentYear<=end_time&&currentYear>=start_time">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" v-waves plain icon="el-icon-edit" v-if="authCheck(51)"
                            @click="newEdit(scope.row.id)">编辑</el-button>
                        <el-button type="danger" size="mini" v-waves plain icon="el-icon-delete" v-if="authCheck(52)"
                            @click="handleDelete(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <user-newedit :dialogUserset="dialogUserset" :start_time="start_time" :usid="usid" :nfid="nfid"
                @CB-dialogUserset="CB_dialogUserset">
				</user-newedit>
			<user-viewTable :showTable="showTable" :type="viewType" :year="viewYear" :nfid="nfid"  @CB-closeViewTable="CB_closeViewTable"></user-viewTable>


        </div>

    </el-dialog>
</template>
<script>
import elDragDialog from "@/directive/el-dragDialog"; //拖拽
import waves from "@/directive/waves"; // 水波纹指令
import { usersetList, usersetDelete, getMenberInfo } from "@/api/cycle";

import UserNewedit from "./user_newEdit";
import UserViewTable from "./user_viewTable";

export default {
  name: "user_set",
  props: {
    dialogSet: Boolean,
    nfid: [Number, String],
    times: String,
    start_time: String,
    end_time: String
  },
  components: { UserNewedit, UserViewTable },
  directives: { elDragDialog, waves },
  data() {
    return {
      loading: false,
      dialogUserset: false,
      showTable: false,
      viewType: "retired",
      usid: null,
      newEdittype: false, //是否编辑或修改数据
      tableData: [],
      currentYear: "",
      viewYear: "",
      listQuery: {
        _order: "nf",
        _sort: "asc",
        page: 1,
        listRows: this.$store.state.pageSize
      }
    };
  },
  methods: {
    // 显示详情
    viewData(type, nf) {
	 this.viewType = type;
	 this.viewYear = nf;
	 this.showTable = true;
    },

    //打开弹出框
    openDialog() {
      let date = new Date();
      this.currentYear = date.getFullYear().toString();
      if (this.nfid == null || this.nfid === "") return;
      this.getRead();
    },
    //排序
    handleSort(val) {
      this.listQuery._order = val.prop;
      this.listQuery._sort = val.order == "ascending" ? "asc" : "desc";
      this.getRead();
    },
    //合计
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index] += " 人";
        } else {
          sums[index] = "--";
        }
      });

      return sums;
    },
    //编辑编辑
    newEdit(id) {
      this.usid = id ? id : null;
      this.dialogUserset = true;
    },
    CB_dialogUserset(val) {
      if (val) {
        this.getRead();
        this.newEdittype = true;
      }
      this.usid = null;
      this.dialogUserset = false;
    },
    //删除
    handleDelete(id) {
      this.$confirm("确定要删除该信息吗？删除后将不可恢复！", "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.loading = true;
          usersetDelete({ id: id })
            .then(rs => {
              this.$message({
                message: "删除成功",
                type: "success"
              });
              this.getRead();
              this.newEdittype = true;
            })
            .catch(() => {
              this.loading = false;
            });
        })
        .catch(() => {});
    },
    //读取数据源
    getRead() {
      this.listQuery.p_id = this.nfid;
      this.loading = true;
      usersetList(this.listQuery)
        .then(res => {
          this.tableData = res.data;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },

    closeDialog() {
      this.$emit("CB-dialogSet", this.newEdittype);
    },
    CB_closeViewTable() {
      this.showTable = false;
    }
  }
};
</script>
