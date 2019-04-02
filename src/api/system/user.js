/**
 * @author zhy 2018-07-5
 * @description 角色组-成员-相关接口
 */
import {
	read,
	del,
	update,
	modify,
	write
} from "@/api/index"

export function getuserGroup() { //获取用户组
	return read('/admin-api/auth-select')
}

export function userList(data) { //管理员列表
	return read('/admin-api/user', data)
}

export function userRead(id) { //读取管理员
	return read('/admin-api/users/' + id)
}

export function userSet(data, method) { //编辑管理员
	return write('/admin-api/users', data, method)
}

export function userInsert(data) { //编辑已存在管理员
	return modify('/admin-api/user', data)
}

export function userDel(data) { //删除管理员
	return del('/admin-api/user', data)
}

export function userQiyong(data) { //启用禁用
	return update('/admin-api/user', data)
}

export function userChange(group) { //角色切换
	return read('/admin-api/userinfo/' + group)
}

export function changepwd(data) { //修改密码
	return update('/admin-api/changepwd', data)
}

export function userZiliao(data) { //修改资料
	return update('/admin-api/user-update', data)
}

export function getHead(params) { //获取默认头像
	return read('/admin-api/headimg', params)
}

export function changeHead(params) { //修改头像
	return update('/admin-api/set-head', params)
}

export function Search(params) { //搜索教师
	return read('/admin-api/teacher', params)
}

export function checkAccount(value) { //检测管理员账号
	return read('/admin-api/getTeacher', value)
}

export function ResetPassword(data) { //重置密码
	return update('/admin-api/user-reset', data)
}