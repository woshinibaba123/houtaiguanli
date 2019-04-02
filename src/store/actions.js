// 一个 store.dispatch 在不同模块中可以触发多个 action 函数。在这种情况下，只有当所有触发函数完成后，返回的 Promise 才会执行。
const actions = {
	setPageSize({ commit }, data) {
		commit('setPageSize', data)
	},
	// 存储用户信息
	setUserinfo({ commit }, data) {
		commit('setUserinfo', data)
	},
	// 存储导航菜单节点
	setRoles({ commit }, data) {
		commit('setRoles', data)
	},
	// 存储动态路由
	setAddRouters({ commit }, data) {
		commit('setAddRouters', data)
	},
	// 存储路由
	setRouters({ commit }, data) {
		commit('setRouters', data)
	},
	//设置用户组
	setUserGroup({ commit }, data) {
		commit('setUserGroup', data)
	},
	//设置主题换肤
	setTheme({ commit }, data) {
		commit('setTheme', data)
	},
	//设置头像
	setAvatar({ commit }, data) {
		commit('setAvatar', data)
	},
	//设置默认窗体高度
	setHeight({ commit }, data) {
		commit('setHeight', data)
    },
    //设置年份
	setYear({ commit }, data) {
		commit('setYear', data)
    },
    //设置年份
	setSchool({ commit }, data) {
		commit('setSchool', data)
    }
}

export default actions
