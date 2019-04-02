import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'


/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)  First-level directory(Only one subset)  name + '_index' use in Judgment of authority
* meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [{
		path: '/login',
		component: () =>
			import('@/views/login/index'),
		hidden: true
	},
	{
		path: '/authredirect',
		component: () =>
			import('@/views/login/authredirect'),
		hidden: true
	},
	{
		path: '/404',
		component: () =>
			import('@/views/errorPage/404'),
		hidden: true,
		name: "404"
	},
	{
		path: '/401',
		component: () =>
			import('@/views/errorPage/401'),
		hidden: true,
		name: "401"
	},
	{
		path: '/500',
		component: () =>
			import('@/views/errorPage/500'),
		hidden: true,
		name: "500"
	},
	{
		path: '',
		component: Layout,
		redirect: 'dashboard',
		children: [{
			path: 'dashboard',
			component: () =>
				import('@/views/dashboard/index'),
			name: 'dashboard',
			meta: {
				title: '我的面板',
				icon: 'dashboard',
				noCache: true
			}
		}]
	}
]

let AppPath = process.env.APP_PATH
export default new Router({
	mode: 'history', // require service support
	base: AppPath,
	//当开启history模式时，此项有效，实现返回上一个页面时默认将滚动条定位到原位置
	scrollBehavior(to, from, savedPosition) {
		if (savedPosition) {
			return savedPosition
		} else {
			return {
				x: 0,
				y: 0
			}
		}
	},
	routes: constantRouterMap
})

export const asyncRouterMap = [{
		path: '/cycle',
		name: 'cycle',
		redirect: {
			name: 'cycle_index'
		},
		component: Layout,
		children: [{
				path: 'index',
				component: () => import('@/views/cycle/index'),
				name: 'cycle_index',
				meta: {
					title: '疗休养周期管理',
					icon: 'unit'
				}
			}

		]
	},
	{
		path: '/line',
		name: 'line',
		redirect: {
			name: 'line_index'
		},
		component: Layout,
		children: [{
			path: 'index',
			component: () => import('@/views/line/index'),
			name: 'line_index',
			meta: {
				title: '线路管理',
				icon: 'line'
			}
		}, {
			path: 'subgroup_index/:id',
			component: () => import('@/views/subgroup/index'),
			name: 'subgroup_index',
			hidden: true,
			meta: {
				title: '分团管理'
			}
		}]
	},
	{
		path: '/apply',
		name: 'apply',
		redirect: {
			name: 'dai_index'
		},
		meta: {
			title: "疗休养申请管理",
			icon: "apply"
		},
		component: Layout,
		children: [{
			path: 'index',
			component: () => import('@/views/apply/index'),
			name: 'index',
			meta: {
				title: "疗休养报名管理",
				icon: "apply"
			}
		}]
	},
	{
		path: '/teacher',
		name: 'teacher',
		redirect: {
			name: 'teacher_index'
		},
		component: Layout,
		children: [{
			path: 'index',
			component: () => import('@/views/teacher/index'),
			name: 'teacher_index',
			meta: {
				title: '教师信息管理',
				icon: "user"
			}
		}]
	},
	{
		path: '/baoming',
		name: 'baoming',
		redirect: {
			name: 'baoming_index'
		},
		component: Layout,
		children: [{
			path: 'index',
			component: () => import('@/views/baoming/index'),
			name: 'baoming_index',
			meta: {
				title: '疗休养报名',
				icon: "sign"
			}
		}]
	},
	{
		path: '/myliao',
		name: 'myliao',
		redirect: {
			name: 'myliao_index'
		},
		component: Layout,
		children: [{
			path: 'index',
			component: () => import('@/views/myliao/index'),
			name: 'myliao_index',
			meta: {
				title: '我的疗休养',
				icon: "renyuan"
			}
		}]
	},
	{
		path: '/system',
		name: 'system',
		redirect: {
			name: 'group'
		},
		component: Layout,
		meta: {
			title: '系统信息设置',
			icon: 'set'
		},
		children: [{
				path: 'group',
				component: () => import('@/views/users/usersGroup'),
				name: 'group',
				meta: {
					title: '用户组管理'
				}
			},
			{
				path: 'list/:group',
				component: () => import('@/views/users/usersList'),
				name: 'list',
				hidden: true,
				meta: {
					title: '管理员管理'
				}
			}, {
				path: 'node',
				component: () => import('@/views/system/node'),
				name: 'node',
				meta: {
					title: '系统节点管理'
				}
			},
			{
				path: 'category',
				component: () => import('@/views/system/category'),
				name: 'category',
				meta: {
					title: '字典表管理'
				}
			},
			{
				path: 'log',
				component: () => import('@/views/system/log'),
				name: 'log',
				meta: {
					title: '系统日志管理'
				}
			}
		]
	},
	{
		path: '*',
		redirect: '/404',
		hidden: true
	}
]