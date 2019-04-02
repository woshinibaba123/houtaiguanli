import {
	read,
	update,
	modify,
	del
} from "@/api/index"

export function dashboardTJ(data) { //我的面板数据统计
	return read('/admin-api/index', data)
}

export function dashboardLine(data) { //我的面板走势图
	return read('/admin-api/xxt', data)
}

export function dashboardCircle(data) { //我的面板饼图
	return modify('/admin-api/circle', data)
}

export function fentuanRead() { //读取分团信息
	return read('/admin-api/ft-t')
}

export function getPillar(params) { //获取柱状数据
	return read('/admin-api/getPillar', params)
}

export function getZhouq() { //获取周期
	return read('/admin-api/getzq')
}

export function getRenshu(){//周期使用/剩余人数统计
    return read('/admin-api/getTotal')
}