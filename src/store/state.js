/**
 * 定义每页显示记录条数的下拉菜单选项
 * @type {Array}
 */
const pageSizes = [5, 10, 15, 20, 50, 100]

/**
 * 定义图片页面每页显示记录条数的下拉菜单选项
 * @type {Array}
 */
const imgPageSizes = [12, 24, 36, 48, 108]

/**
 * 定义图片页面默认显示记录条数
 * @type {int}
 */
const imgPageSize = 12

/**
 * pageSize：定义每页默认显示记录条数
 * @type {int}
 */
const pageSize = 15

/**
 * PublishOptions：定义我的面板走势图数据
 * @type {Array}
 */
const index_all = {}

/**
 * PublishOptions：定义登录的角色
 */
const roleData = []

/**
 * userGroup：用户组数据
 * @type {arr}
 */
const userGroup = [];

/**
 * [保存用户登录信息]
 * @type {Object}
 */
const user = {
	userinfo: {},
	rules: []
}

/**
 * [sliderNav_data 当前登录用户的左侧导航权限]
 * @type {Array}
 * @author leo
 */
const sliderNav_data = []

/**
 * [methodData 传值方式]
 * @type {Object}
 * @author zhy
 */
const methodData = [{
	title: 'PUT'
}, {
	title: 'GET'
}, {
	title: 'POST'
}, {
	title: 'DELETE'
}]

/**
 * [shenfen 用户身份类型]
 */
const shenfen = [{
	id: "1",
	title: "统一身份认证用户"
}, {
	id: "2",
	title: "内置用户"
}]

/**
 * [statusData 审核类型]
 * [@type Array]
 * [@author sy 2019-02-15]
 */
const statusData = [{
	id: 1,
	title: "待审核",
	icon: "el-icon-info",
	color: "text-muted"
}, {
	id: 2,
	title: "审核通过",
	icon: "el-icon-success",
	color: "text-success"
}, {
	id: 3,
	title: "退回申请",
	icon: "el-icon-error",
	color: "text-danger"
}]

/**
 * [stateData 使用状态]
 * @type {Array}
 * @author 2019 - 02 -21
 */
const stateData = [{
	id: 2,
	title: "正常"
}, {
	id: 1,
	title: "禁用"
}]
/** 
 * 在职状态
 * 
*/
const teacherStatus = [{
	id: 1,
	title: "退休"
}, {
	id: 2,
	title: "在职"
}]

/**
 * [roles 导航菜单节点]
 * @type {Object}
 * @author zhy
 */
const roles = []

/**
 * [addRouters 动态路由]
 * @type {Object}
 * @author zhy
 */
const addRouters = []

/**
 * [Routers 路由]
 * @type {Object}
 * @author zhy
 */
const routers = []

/**
 * [originalTheme 颜色主题]
 * @type {string}
 * @author zhy
 */
const originalTheme = '#409EFF'

/**
 * [last_time 记录最后操作时间戳]
 * @type {booler}
 */
const last_time = ''

/**
 * guide_show：是否显示引导
 * @type {str}
 */
const guide_show = '2';

/**
 * clientHeight 窗口默認大小
 * @type {str}
 */
const clientHeight = document.documentElement.clientHeight - 105;

/**
 * [nianfenData 存在数据年份]
 * @type {Array}
 * @author sy 2019-02-18
 */
const nianfenData = []

/**
 * [schoolData 所属部门]
 * @type {Array}
 * @author sy 2019-02-21
 */
const schoolData = []
/** 
 * 判断是否阅读协议
*/
const xieYi = 2
const state = {
	imgPageSizes: imgPageSizes,
	imgPageSize: imgPageSize,
	pageSizes: pageSizes,
	pageSize: pageSize,
	user: user,
	sliderNavData: sliderNav_data,
	last_time: last_time,
	methodData: methodData,
	roles: roles,
	addRouters: addRouters,
	routers: routers,
	userGroup: userGroup,
	index_all: index_all,
	originalTheme: originalTheme,
	roleData: roleData,
	guide_show: guide_show,
	clientHeight: clientHeight,
	shenfen: shenfen,
	statusData: statusData,
	nianfenData: nianfenData,
	schoolData: schoolData,
	stateData: stateData,
	teacherStatus: teacherStatus,
	xieYi: xieYi
}

export default state