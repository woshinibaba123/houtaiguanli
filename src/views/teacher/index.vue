
<template>
  <div>
    <div class="app-container">
      <div class="filter-container">
        <el-input
          @keyup.enter.native="handleFilter"
          style="width: 230px;"
          class="filter-item"
          placeholder="检索：教师姓名、工号"
          :clearable="true"
          v-model="listQuery.keys"
        ></el-input>
        <Xisuo :values="listQuery"></Xisuo>
        <el-select
          v-if="isshow === true"
          class="filter-item"
          v-model="listQuery.status"
          placeholder="不限使用状态"
          clearable
        >
          <el-option
            v-for="(item,index) in stateData"
            :key="index"
            :label="item.title"
            :value="item.id"
          ></el-option>
        </el-select>
        <el-select
          v-if="isshow === true"
          class="filter-item"
          v-model="listQuery.dqzt"
          placeholder="不限在职状态"
          clearable
        >
          <el-option
            v-for="(item,index) in teacherStatus"
            :key="index"
            :label="item.title"
            :value="item.id"
          ></el-option>
        </el-select>
        <el-button
          class="filter-item"
          type="primary"
          plain
          icon="el-icon-search"
          @click="handleFilter"
        >搜索</el-button>
        <el-button class="filter-item" plain @click="handleMore">
          {{ butname }}
          <i :class="isshow ===false? 'el-icon-arrow-down':'el-icon-arrow-up'"></i>

        </el-button>
        <el-button
          class="filter-item"
          type="primary"
          v-if="authCheck(108)"
          icon="el-icon-refresh"
          @click="synchronization"
        >同步数据</el-button>
      </div>
      <!-- 注意：产品默认按照编辑的正序显示，可以手动排序，序号越大排列越靠前，默认序号为0 -->
      <el-table
        :data="tableData"
        fit
        stripe
        highlight-current-row
        v-loading="loading"
        :max-height="clientHeight"
        element-loading-text="数据载入中"
        @sort-change="handleSort"
      >
        <el-table-column type="index" width="60" align="center"></el-table-column>
        <el-table-column
          label="教师姓名"
          prop="name"
          min-width="100"
          show-overflow-tooltip
          sortable="custom"
        ></el-table-column>
        <el-table-column
          label="工号"
          prop="account"
          min-width="100"
          show-overflow-tooltip
          sortable="custom"
        ></el-table-column>
        <el-table-column
          label="性别"
          prop="sex"
          min-width="80"
          show-overflow-tooltip
          sortable="custom"
        >
          <template slot-scope="scope">{{scope.row.sex===2?'女':'男'}}</template>
        </el-table-column>
        <el-table-column label="出生日期" prop="csrq" min-width="110" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.csrq||'--'}}</template>
        </el-table-column>
        <el-table-column label="身份证号" prop="idcard" min-width="190" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.idcard||'411422123405145115'}}</template>
        </el-table-column>
        <el-table-column
          label="所属部门"
          prop="xisuo_title"
          min-width="200"
          show-overflow-tooltip
          sortable="custom"
        >
          <template slot-scope="scope">{{scope.row.xisuo_title||'--'}}</template>
        </el-table-column>

        <el-table-column label="入职日期" prop="rzrq" min-width="110" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.rzrq||'--'}}</template>
        </el-table-column>
        <el-table-column
          label="手机号码"
          prop="phone"
          min-width="120"
          show-overflow-tooltip
          sortable="custom"
        >
          <template slot-scope="scope">{{scope.row.phone||'--'}}</template>
        </el-table-column>
        <el-table-column
          label="电子邮箱"
          prop="email"
          min-width="160"
          show-overflow-tooltip
          sortable="custom"
        >
          <template slot-scope="scope">{{scope.row.email||'--'}}</template>
        </el-table-column>
        <el-table-column
          label="在职状态"
          min-width="120"
          prop="dqzt"
          show-overflow-tooltip
          sortable="custom"
        >
          <template slot-scope="scope">
            <span
              :class="scope.row.dqzt===1?'text-danger':'text-success'"
            >{{scope.row.dqzt_title||'--'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="疗休养状态" min-width="300" prop="lxy_title" show-overflow-tooltip>
          <template slot-scope="scope">
            <span
              :class="scope.row.lxy_status?'text-success':'text-danger'"
            >{{scope.row.lxy_title||'--'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="使用状态"
          min-width="110"
          prop="status"
          show-overflow-tooltip
          sortable="custom"
        >
          <template slot-scope="scope">
            <span
              :class="scope.row.status===2?'text-success':'text-danger'"
            >{{scope.row.status===2?'正常':"禁用"}}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
          width="170"
          class-name="small-padding fixed-width"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              v-waves
              plain
              icon="el-icon-edit"
              v-if="authCheck(107)"
              @click="newEdit(scope.row.id)"
            >编辑</el-button>
            <el-dropdown @command="handleCommand" trigger="click" class="margin-left-10">
              <el-button type="info" size="mini" plain>
                更多
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-if="authCheck(75)&&scope.row.dqzt===1"
                  :command="{type:'fan',ID:scope.row.id}"
                >
                  <span class="text-warning">返聘</span>
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="scope.row.status===1&&authCheck(56)"
                  :command="{type:'enable',ID:scope.row.id,status:scope.row.status}"
                >
                  <span class="text-success">启用</span>
                </el-dropdown-item>
                <el-dropdown-item
                  v-if="scope.row.status===2&&authCheck(56)"
                  :command="{type:'enable',ID:scope.row.id,status:scope.row.status}"
                >
                  <span class="text-success">禁用</span>
                </el-dropdown-item>
                <el-dropdown-item v-if="authCheck(55)" :command="{type:'del',ID:scope.row.id}">
                  <span class="text-danger">删除</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <teacher-new-edit
        :dialogTeacher="dialogTeacher"
        :tcid="tcid"
        @CB-dialogTeacher="CB_dialogTeacher"
      ></teacher-new-edit>
    </div>
    <Page v-model="listQuery" :total="total"/>
  </div>
</template>
<script>
import { mapState } from "vuex";
import waves from "@/directive/waves"; // 水波纹指令

import TeacherNewEdit from "./newEdit";

import {
  TeacherIndex,
  TeacherDel,
  TeacherStartEnd,
  TeacherFan
} from "@/api/teacher.js";

export default {
  name: "teacher_index",
  computed: {
    ...mapState(["stateData", "teacherStatus"]),
    clientHeight() {
      return this.$store.state.clientHeight - 115;
    }
  },
  components: { TeacherNewEdit },
  directives: { waves },
  data() {
    return {
      total: 0,
      loading: false,
      dialogTeacher: false,
      tcid: null,
      isshow: false,
      tableData: [],
      butname: '更多',
      listQuery: {
        keys: "",
        _order: "id",
        _sort: "desc",
        status: "",
        xisuo: "",
        page: 1,
        dqzt: "",
        listRows: this.$store.state.pageSize
      }
    };
  },
  activated() {
    this.listQuery.listRows = this.$store.state.pageSize;
    this.getData();
  },
  methods: {
    //检索
    handleFilter() {
      this.listQuery.page = 1;
      this.getData();
    },
    // 更多按钮
    handleMore() {
      this.isshow = !this.isshow;
      this.butname = this.isshow === false ?'更多':'收起'
    },
    //排序
    handleSort(val) {
      this.listQuery._order = val.prop;
      this.listQuery._sort = val.order == "ascending" ? "asc" : "desc";
      this.getData();
    },
    //编辑
    newEdit(id) {
      this.tcid = id;
      this.dialogTeacher = true;
    },
    CB_dialogTeacher(val) {
      if (val) {
        this.getData();
      }
      this.tcid = null;
      this.dialogTeacher = false;
    },
    //更多
    handleCommand(row) {
      switch (row.type) {
        case "fan":
          this.handleFan(row.ID);
          break;
        case "enable":
          this.handleEnable(row.ID, row.status);
          break;
        case "del":
          this.handleDelete(row.ID);
          break;
      }
    },
    //返聘教师
    handleFan(id) {
      this.$confirm("确定要返聘当前教师吗？", "系统提示", {
        confirmButtonText: "确定返聘",
        showCancelButton: false,
        type: "warning"
      })
        .then(() => {
          TeacherFan({ id: id })
            .then(res => {
              this.$message.success("返聘成功！");
              this.getData();
            })
            .catch(() => {});
        })
        .catch(() => {});
    },
    //启用禁用
    handleEnable(id, status) {
      let typestatus = status === 2 ? 1 : 2;
      TeacherStartEnd({
        id: id,
        status: typestatus
      }).then(res => {
        let message = status === 2 ? "禁用成功" : "启用成功";
        this.$message.success(message);
        this.getData();
      });
    },
    //删除数据
    handleDelete(id) {
      this.$confirm("删除后不可恢复，确定要删除当前教师吗？", "系统提示", {
        confirmButtonText: "确定删除",
        showCancelButton: false,
        type: "warning"
      })
        .then(() => {
          TeacherDel({ id: id }).then(res => {
            this.$message.success("删除成功！");
            this.getData();
          });
        })
        .catch(() => {});
    },
    //同步数据
    synchronization() {},
    //获取数据源
    getData() {
      this.loading = true;
      TeacherIndex(this.listQuery)
        .then(res => {
          this.tableData = res.data;
          this.total = res.count;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    }
  }
};
</script>

