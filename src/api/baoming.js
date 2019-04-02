import {
	read,
    write,
    del
} from "@/api/index"

export function BaomingIndex(data) { //线路列表
	return read('/admin-api/lxyxl-t', data)
}

export function LxyZhouq() { //获取疗休养周期
	return read('/admin-api/lxy-t')
}

export function ReadBaoming(id) { //读取疗休养
	return read('/admin-api/lxyxl-t/' + id)
}

export function Zige() { //获取是否有资格
	return read('/admin-api/teacher-t')
}

export function Baoming(data) { //报名
	return write('/admin-api/lxysh-t', data, 'post')
}

export function cancelSignup(data) {
	return del('/admin-api/lxysh-t', data)
}