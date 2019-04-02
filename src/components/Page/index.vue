<template>
    <div class="pagination-container">
        <el-pagination :current-page="value.page" :page-sizes="$store.state.pageSizes"
		 :page-size="$store.state.pageSize" :total="total" background
		  layout="total, sizes, prev, pager, next, jumper"
		   @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Page",
  props: ["value", "total"],
  methods: {
    //改变每页显示条数时
    handleSizeChange(val) {
      this.$store.dispatch("setPageSize", val).then(() => {
        this.value.listRows = val;
        this.$parent.getData();
      });
    },
    //当前变更时
    handleCurrentChange(val) {
      this.value.page = val;
      this.$parent.getData();
    }
  }
};
</script>

