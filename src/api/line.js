import {
	read,
	del,
	write
} from "./index.js"

export function LineIndex(params) { //线路列表
	return read('/admin-api/lxyxl', params)
}

export function LineRead(id) { //读取线路信息
	return read('/admin-api/lxyxl/' + id)
}

export function LineEdit(params, method) { //编辑编辑线路信息
	return write('/admin-api/lxyxl', params, method)
}

export function LineDel(id) { //删除线路信息
	return del('/admin-api/lxyxl', id)
}

export function TeamList(params) { //分团列表
	return read('/admin-api/lxyft', params)
}

export function TeamRead(id) { //读取分团数据
	return read('/admin-api/lxyft/' + id)
}

export function TeamNewEdit(params, method) { //新增编辑分团
	return write('/admin-api/lxyft', params, method)
}

export function TeamDel(id) { //删除分团
	return del('/admin-api/lxyft', id)
}

export function TeamPeople(p_id, id) { //读取分团成员信息
	return read('/admin-api/lxyft-csk/' + p_id + '/' + id)
}

export function TeamSet(params, method) { //设置分团成员
	return write('/admin-api/lxyft-csk', params, method)
}

export function PeopleNew(params) {//新增成员
	return write('/admin-api/lxysh-add', params, 'post')
}

export function MemberList(params) { //报名人数列表
	return read('/admin-api/lxysh', params)
}

export function MemberRead(id) { //读取报名人数信息
	return read('/admin-api/lxysh/' + id)
}

export function MemberDel(id) { //删除报名人数信息
	return del('/admin-api/lxysh', id)
}