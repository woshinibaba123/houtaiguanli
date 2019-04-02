import router from './router'
import store from './store'
import {
	Message
} from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import {
	getRoles
} from "@/api/login.js";


NProgress.configure({
	showSpinner: false
}) // NProgress Configuration

// permissiom judge function
const whiteLists = ['401', '404', '500'] // no redirect whitelist

function hasPermission(name) {
	if (store.getters.group === 1) {
		return true
	} // admin permission passed directly
	if (!name) {
		return true
	}
	if (whiteLists.indexOf(name) !== -1) {
		return true
	}
	let arr = store.getters.roles
	if (!arr.find(item => {
			return item.name == name
		})) {
		return false
	} else {
		let role = arr.find(item => {
			return item.name === name
		}).rules
		if (role.find(item => {
				return parseInt(store.getters.group) == item
			})) {
			return true
		} else {
			return false
		}
	}
}

const whiteList = ['/login', '/syslogin'] // no redirect whitelist

router.beforeEach((to, from, next) => {
	NProgress.start() // start progress bar
	if (store.state.user && store.state.user.userinfo && store.state.user.userinfo.token) { // determine if there has token
		/* has token*/
		if (store.state.xieYi === 1 && to.name !== 'dashboard') {
			next({
				path: '/dashboard'
			})	
		} else {
		//  next()
            if (store.state.user.userinfo.group == 6 && to.name == 'dashboard') {
			next({
				path: '/registration',
			})
			NProgress.done()
		} else if (to.path === '/login' || to.path === '/syslogin') {
			next({
				path: '/'
			})
			NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
		} else {
			if (store.state.roles.length === 0 || store.state.routers.length === 0) {
				getRoles().then(rs => {
					store.commit("setRoles", rs);
					store.dispatch('GenerateRoutes').then(() => { // 根据roles权限生成可访问的路由表, group为1： 超管过滤权限
						router.addRoutes(store.getters.addRouters) // 动态编辑可访问路由表
						next({
							...to,
							replace: true
						}) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
					})
				}).catch(() => {
					store.commit("setUserinfo", {
						userinfo: {},
						rules: []
					});
					store.commit("setRoles", []);
					store.commit("setRouters", []);
					store.commit("setAddRouters", []);
					next({
						path: '/login'
					})
				})
			} else {
				if (!to.name) {
					store.dispatch('GenerateRoutes').then(() => { // 根据roles权限生成可访问的路由表, group为1： 超管过滤权限
						router.addRoutes(store.getters.addRouters) // 动态编辑可访问路由表
						next({
							...to,
							replace: true
						}) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
					})
				}
				if (hasPermission(to.name)) {
					next()
				} else {
					next({
						path: '/401',
						replace: true,
						query: {
							noGoBack: true
						}
					})
				}
			}
		  
		}
		}
	} else {
		/* has no token*/
		if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
			next()
		} else {
			next({
				path: '/login'
			}) // 否则全部重定向到登录页
			NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
		}
	}
})

router.afterEach(() => {
	NProgress.done() // finish progress bar
})
