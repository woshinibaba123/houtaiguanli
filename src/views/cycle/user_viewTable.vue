<template>
    <el-dialog v-el-drag-dialog :title="title" width="1000px" top="10vh" append-to-body :visible="showTable"
        @open="openDialog" @close="closeDialog">

		            <div class="filter-container">
                <el-input @keyup.enter.native="handleFilter" style="width: 230px;" class="filter-item" placeholder="检索：教师姓名、工号"
                    :clearable="true" v-model="listQuery.keys">
                </el-input>
                <Xisuo :values="listQuery"></Xisuo>
                <el-button class="filter-item" type="primary" plain icon="el-icon-search" @click="handleFilter">搜索</el-button>
            </div>
            <!-- 注意：产品默认按照编辑的正序显示，可以手动排序，序号越大排列越靠前，默认序号为0 -->
            <el-table   height="480px"  :data="tableData" fit stripe highlight-current-row v-loading="loading" :max-height="clientHeight"
                element-loading-text="数据载入中" @sort-change="handleSort">
                <el-table-column type="index" width="60" align="center"></el-table-column>
                <el-table-column label="教师姓名" prop="name" min-width="100" show-overflow-tooltip sortable="custom"></el-table-column>
                <el-table-column label="工号" prop="account" min-width="100" show-overflow-tooltip sortable="custom"></el-table-column>
                <el-table-column label="性别" prop="sex" min-width="80" show-overflow-tooltip sortable="custom">
                    <template slot-scope="scope">
                        {{scope.row.sex===2?'女':'男'}}
                    </template>
                </el-table-column>
                <el-table-column label="出生日期" prop="csrq" min-width="110" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.csrq||'--'}}
                    </template>
                </el-table-column>
                <el-table-column label="所属部门" prop="xisuo" min-width="200" show-overflow-tooltip sortable="custom">
                    <template slot-scope="scope">
                        {{scope.row.xisuo_title||'--'}}
                    </template>
                </el-table-column>

                <el-table-column label="入职日期" prop="rzrq" min-width="110" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.rzrq||'--'}}
                    </template>
                </el-table-column>
                <el-table-column label="手机号码" prop="phone" min-width="120" show-overflow-tooltip sortable="custom">
                    <template slot-scope="scope">
                        {{scope.row.phone||'--'}}
                    </template>
                </el-table-column>
                <el-table-column label="电子邮箱" prop="email" min-width="160" show-overflow-tooltip sortable="custom">
                    <template slot-scope="scope">
                        {{scope.row.email||'--'}}
                    </template>
                </el-table-column>
            </el-table>
			<el-pagination :current-page="listQuery.page"
					:page-sizes="$store.state.pageSizes"
					class="pagination"
		 			:page-size="$store.state.pageSize"
					:total="total" background
		 			layout="total, sizes, prev, pager, next, jumper"
		  			@size-change="handleSizeChange"
					@current-change="pageChange" />




    </el-dialog>
</template>
<script>
import elDragDialog from "@/directive/el-dragDialog"; //拖拽
import waves from "@/directive/waves"; // 水波纹指令
import { mapState } from "vuex";

import { getMemberList } from "@/api/cycle.js";

const formData = {
  nf: "",
  count: 0
};
export default {
  name: "user_set",
  props: {
    showTable: Boolean,
    type: [String, Number],
    year: [String, Number],
    nfid: [String, Number]
  },
  directives: { elDragDialog, waves },

  data() {
    return {
      loading: false,
      total: 0,
      tableData: [],
      title: "",
      listQuery: {
        keys: "",
        _order: "id",
        _sort: "desc",
        nfid: "",
        xisuo: "",
        p_id: "",
        is_jtx: 1,
        is_mw: 1,
        page: 1,
        listRows: this.$store.state.pageSize
      }
    };
  },

  methods: {
    // 过滤
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

    pageChange(curr) {
      this.listQuery.page = curr;
      this.getData();
    },
    getData() {
      getMemberList(this.listQuery)
        .then(res => {
          this.tableData = res.data;
          this.total = res.count;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    //  分页规则修改
    handleSizeChange(val) {
      this.$store.dispatch("setPageSize", val).then(() => {
        this.listQuery.listRows = val;
        this.getData();
      });
    },

    //打开弹出框
    openDialog() {
      this.listQuery.listRows = this.$store.state.pageSize;
      this.listQuery.p_id = this.nfid;

      switch (this.type) {
        case "retired":
          this.listQuery.is_jtx = 2;
          this.title = this.year + "年退休人员基本信息";
          break;
        case "mw":
          this.listQuery.is_mw = 2;
          this.title = this.year + "年满5年人员基本信息";
          break;
        case "firstBatch":
          this.listQuery.is_mw = 2;
          this.title = this.year + "年第一批次人员基本信息";
          break;
      }
      this.getData();
    },

    // 关闭弹窗
    closeDialog() {
      this.$emit("CB-closeViewTable");
    }
  },
  computed: {
    ...mapState(["stateData"]),
    clientHeight() {
      return this.$store.state.clientHeight - 210;
    }
  }
};
</script>
<style lang="scss" scoped>
.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
  position: static;
  background: #fff;
}
</style>
