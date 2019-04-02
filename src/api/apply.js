import {
	read,
	del,
	write
} from "./index.js"

export function ApplyIndex(params) { //疗休养申请列表
	return read('/admin-api/lxysh', params)
}

export function ApplyRead(id) { //读取疗休养申请信息
	return read('/admin-api/lxysh/' + id)
}

export function ApplyEdit(params, method) { //审核申请信息
	return write('/admin-api/lxysh-sh', params, method)
}

export function ApplyDel(id) { //删除疗休养申请信息
	return del('/admin-api/lxysh', id)
}

export function ZigeList(params) { //资格转让列表
	return read('/admin-api/zgzr', params)
}

export function ZigeRead(id) { //读取资格转让
	return read('/admin-api/zgzr/' + id)
}

export function ZigeEdit(params, method) { //编辑编辑资格转让
	return write('/admin-api/zgzr', params, method)
}

export function ZigeDel(id) { //删除资格转让
	return del('/admin-api/zgzr', id)
}

export function HuoZiliao(id) { //获取线路及分团信息
	return read('/admin-api/lxysh-tj/' + id)
}

export function JianCycle(params) {//搜索线路名称
	return read('/admin-api/getLxyxl', params)
}

export function HuoquFentuan(id) { //获取分团数据
	return read('/admin-api/getLxyft/' + id)
}

export function Tiaoji(params) { //保存调剂结果
	return write('/admin-api/lxysh-tj', params, 'put')
}