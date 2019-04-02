import {
	read,
	del,
	write
} from "./index.js"

export function TeacherIndex(params) { //线路列表
	return read('/admin-api/teacher', params)
}

export function TeacherRead(id) { //读取教师信息
	return read('/admin-api/teacher/' + id)
}

export function TeacherDel(id) { //删除教师
	return del('/admin-api/teacher', id)
}

export function TeacherNewEdit(params) { //编辑
	return write('/admin-api/teacher', params, 'put')
}

export function TeacherStartEnd(params) { //启用/禁用
	return write('/admin-api/set-status', params, 'put')
}

export function TeacherFan(params) { //返聘教师
	return write('/admin-api/fanp', params, 'put')
}