import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/display.css';

import '@/styles/index.scss' // global css

import 'babel-polyfill';
import App from './App'
import router from './router'
import store from './store'

import './icons' // icon
import './errorLog' // error log
import './permission' // permission control
import './plugin' // component plugin

import * as filters from './filters' // global filters

Vue.use(Element, {
	size: 'medium', // set element-ui default size/
})

Vue.prototype.API_ROOT = process.env.API_ROOT
Vue.prototype.NODE_ENV = process.env.NODE_ENV;

//节点验证
Vue.prototype.authCheck = function (id) {
	if (store.getters.group === 1) {
		return true;
	}
	//获取角色拥有的所有节点
	let rules = store.state.user.rules;
	if (rules) {
		if (rules.indexOf(id) === -1) {
			//没有权限
			return false;
		} else {
			//拥有权限
			return true;
		}
	} else {
		return false;
	}
}

//替换回车符
Vue.prototype.Trim = (str) => {
	return str.toString().replace(/\n|\r\n/g, "<br/>");
}

// 注销
Vue.prototype.logout = function () {
	store.commit("setUserinfo", {
		userinfo: {},
		rules: []
	});
	store.commit("setRoles", []);
	store.commit("setRouters", []);
	store.commit("setAddRouters", []);
	location.reload();
}

//配置页面主体内容 容器的默认高度
Vue.prototype._PageHeight = document.documentElement.clientHeight - 105
// register global utility filters.
Object.keys(filters).forEach(key => {
	Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
	el: '#app',
	router,
	store,
	template: '<App/>',
	components: {
		App
	},
	data: {
		eventHub: new Vue()
	}
})
