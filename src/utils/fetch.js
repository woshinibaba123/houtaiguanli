// 数据资源请求
import axios from 'axios'
import store from '@/store/index.js'
import {
	Message
} from 'element-ui'
import router from '@/router/index.js'
import qs from 'qs'

// 设置默认请求头
axios.defaults.baseURL = process.env.API_ROOT

// 请求拦截器
axios.interceptors.request.use(config => {
	return config
}, err => {
	return Promise.reject(err)
})

// 响应拦截器即异常处理
axios.interceptors.response.use(response => {
	return response
}, err => {
	if (err && err.response) {
		switch (err.response.status) {
			case 400:
				err.message = err.response.data || '错误请求'
				break
			case 401:
				err.message = err.response.data || '未授权，请重新登录'
				store.commit('setUserinfo', {
					userinfo: {},
					rules: []
				});
				store.commit("setRoles", []);
				store.commit("setRouters", []);
				store.commit("setAddRouters", []);
				router.push({
					name: 'login'
				})
				break
			case 403:
				err.message = '您没有访问该内容的权限！'
				router.push({
					path: '/401'
				})
				break
			case 405:
				err.message = '数据接口不存在，请联系系统管理员进行排查！'
				break
			case 408:
				err.message = '数据请求超时，请检查您的网络是否有问题！'
				break
			case 500:
				err.message = '您请求的数据接口出错，请检查接口代码！'
				router.push({
					path: '/500'
				})
				break
			case 501:
				err.message = '网络未实现'
				break
			case 502:
				err.message = '网络错误'
				break
			case 503:
				err.message = '服务不可用'
				break
			case 504:
				err.message = '网络超时'
				break
			case 505:
				err.message = 'http版本不支持该请求'
				break
			default:
				err.message = `连接错误${err.response.status}`
		}
	} else {
		err.message = '连接到服务器失败'
	}
	Message.error(err.message)

	return Promise.reject(err)
})

//重新设置token
function setToken(authorization) {
	if (authorization) {
		let user = store.state.user;
		user.userinfo.token = authorization
		store.commit("setUserinfo", user);
	}
}

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.headers.common['cache-control'] = 'no-cache'
axios.defaults.headers.common['Pragma'] = 'no-cache'
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.transformRequest = [data => qs.stringify(data)] // qs处理输出类型

export function fetch(options) {
	return new Promise((resolve, reject) => {
		axios.defaults.headers.common['Authorization'] = store.getters.token
		axios({
			url: options.url,
			data: options.data || null,
			method: options.method
		}).then((rs) => {
			setToken(rs.headers.authorization)
			return resolve(rs.data)
		}).catch((err) => {
			reject({
				'err': err
			})
		})
	})
}

export function fetch_get(options) {
	return new Promise((resolve, reject) => {
		axios.defaults.headers.common['Authorization'] = store.getters.token
		//过滤筛选条件
		for (var val in options.params) {
			if (!options.params[val]) {
				delete options.params[val]
			}
		}
		axios({
			url: options.url,
			params: options.params || null,
			method: options.method
		}).then((rs) => {
			setToken(rs.headers.authorization)
			return resolve(rs.data)
		}).catch((err) => {
			reject({
				'err': err
			})
		})
	})
}
