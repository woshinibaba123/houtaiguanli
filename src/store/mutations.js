import state from './state'

// 导入LocalStorage的封装器，详细使用方式参考 Git上storejs
import LS from 'storejs'

// 定义数据仓库前缀，避免保存到LocalStorage中的数据节点冲突
var sysKeys = 'DB_SLLXY_ADMIN_'

// mutations

/* 从本地存储读取数据 */
for (var item in state) {
	LS.get(sysKeys + item) ? state[item] = JSON.parse(LS.get(sysKeys + item)) : false
}

// 从组件中提交请求方法，写在此类下，注意保存时，一定要保存为json
const mutations = {
	setPageSize(state, payload) {
		state.pageSize = payload
		LS.set(sysKeys + 'pageSize', JSON.stringify(state.pageSize))
	},
	setImgPageSize(state, payload) {
		state.imgPageSize = payload
		LS.set(sysKeys + 'imgPageSize', JSON.stringify(state.imgPageSize))
	},
	// 记录最后操作时间
	setLast_time(state, payload) {
		state.last_time = payload
		LS.set(sysKeys + 'last_time', JSON.stringify(state.last_time))
	},
	// 存储用户信息
	setUserinfo(state, payload) {
		state.user = payload
		LS.set(sysKeys + 'user', JSON.stringify(state.user))
	},
	// 存储导航菜单节点
	setRoles(state, payload) {
		state.roles = payload
		LS.set(sysKeys + 'roles', JSON.stringify(state.roles))
	},
	setAddRouters(state, payload) {
		state.addRouters = payload
		LS.set(sysKeys + 'addRouters', JSON.stringify(state.addRouters))
	},
	setRouters(state, payload) {
		state.routers = payload
		LS.set(sysKeys + 'routers', JSON.stringify(state.routers))
	},
	//设置用户组
	setUserGroup(state, payload) {
		state.userGroup = payload
		LS.set(sysKeys + 'userGroup', JSON.stringify(state.userGroup))
	},
	//设置我的面板走势图缓存数据
	setIndexAll(state, payload) {
		state.index_all = payload
		LS.set(sysKeys + 'index_all', JSON.stringify(state.index_all))
	},
	//设置主题换肤
	setTheme(state, payload) {
		state.originalTheme = payload
		LS.set(sysKeys + 'originalTheme', JSON.stringify(state.originalTheme))
	},
	//保存角色组
	setRoleData(state, payload) {
		state.roleData = payload
		LS.set(sysKeys + 'roleData', JSON.stringify(state.roleData))
	},
	//设置是否显示引导
	setGuide(state, payload) {
		state.guide_show = payload
		LS.set(sysKeys + 'guide_show', JSON.stringify(state.guide_show))
	},
	//窗体默认高度
	setHeight(state, payload) {
		state.clientHeight = payload
		LS.set(sysKeys + 'clientHeight', JSON.stringify(state.clientHeight))
	},
	//窗体年份
	setYear(state, payload) {
		state.nianfenData = payload
		LS.set(sysKeys + 'nianfenData', JSON.stringify(state.nianfenData))
	},
	//所属部门
	setSchool(state, payload) {
		state.schoolData = payload
		LS.set(sysKeys + 'schoolData', JSON.stringify(state.schoolData))
	},
	// 阅读协议
	setXieyi(state, payload) {
		state.Xieyi = payload
		LS.set(sysKeys + 'Xieyi', JSON.stringify(state.Xieyi))
	}
}

export default mutations