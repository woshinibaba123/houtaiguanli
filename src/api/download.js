/**
 * @author zhy 2018-10-10
 * @description 导出-相关接口
 */
import {
	read
} from '@/api/index'

export function download(params) { //导出
	return read('/admin-api/export', params)
}

export function downLoadLine(params) { //导出分团信息
	return read('/admin-api/export-xl', params)
}

export function getseleYear() { //获取年份下拉信息
	return read('/admin-api/getYear')
}

export function getschool() { //获取部门信息
	return read('/admin-api/dwxx')
}