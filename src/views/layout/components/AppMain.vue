<template>
	<section class="app-main" style="min-height: 100%">
		<transition name="fade" mode="out-in">
			<keep-alive>
				<router-view :key="$route.path"></router-view>
			</keep-alive>
		</transition>
		<!-- <Wanshan :dialogInfo="dialogInfo" @CB-dialogInfo="CB_dialogInfo"></Wanshan> -->
	</section>
</template>

<script>
// import Wanshan from "./buchong.vue";
export default {
  name: "AppMain",
//   components: { Wanshan },
  created: function() {
    if (this.user.phone == "" || this.user.phone == null) {
      setTimeout(() => {
        this.dialogInfo = true;
      }, 500);
    }
  },
  data() {
    return {
      dialogInfo: false
    };
  },
  methods: {
    CB_dialogInfo(val) {
      this.dialogInfo = false;
    }
  },
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews;
    },
    user() {
      return this.$store.state.user.userinfo;
    }
  }
};
</script>
