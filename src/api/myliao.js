import {
	read
} from "@/api/index"

export function MyliaoIndex(data) { //线路列表
	return read('/admin-api/lxyjl-t', data)
}

export function MyliaoRead(id) {//读取疗休养经历
	return read('/admin-api/lxyjl-t/' + id)
}