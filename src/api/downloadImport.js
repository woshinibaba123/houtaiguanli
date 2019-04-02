/**
 * @author sy 2019-01-10
 * @description 导入，导出-相关接口
 */
import {
	read,
	modify,
	del
} from '@/api/index'

export function inlet(data) { //导入
	return modify('/admin-api/import-jzgl', data)
}
