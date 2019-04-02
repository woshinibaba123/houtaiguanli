import {
	read
} from "@/api/index"

export function getJuese() {
	return read('/admin-api/getGroup')
}

//角色切换
export function UserChange(params) {
	return read('/admin-api/users-change', params)
}
