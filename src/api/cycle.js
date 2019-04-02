import {
	read,
    write,
    del
} from "./index.js"

export function cycleList(params) { //疗休养周期列表
	return read('/admin-api/lxy', params)
}

export function cycleRead(id) { //读取疗休养周期
	return read('/admin-api/lxy/' + id)
}

export function cyclenewEdit(params, method) { //编辑编辑疗休养周期
	return write('/admin-api/lxy', params, method)
}

export function cycleDelete(params) { //删除疗休养周期
	return del('/admin-api/lxy', params)
}

export function usersetList(params) { //疗休养人数设置列表
	return read('/admin-api/lxync', params)
}

export function usersetRead(id) { //读取疗休养人数设置
	return read('/admin-api/lxync/' + id)
}

export function usersetnewEdit(params, method) { //编辑疗休养人数设置
	return write('/admin-api/lxync', params, method)
}

export function usersetDelete(params) { //删除疗休养人数设置
	return del('/admin-api/lxync', params)
}

// 预处理成员 退休 满五

export function  getMemberList(params){
	return read('/admin-api/member',params)
}