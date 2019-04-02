import Mock from 'mockjs'
import { param2Obj } from '@/utils'

const List = []
const count = 10

for (let i = 0; i < count; i++) {
	List.push(Mock.mock({
		id: '@increment',
		title: '@ctitle',
		"miaoshu|10": '@ctitle',
		'status|1': ['1', '2']
	}))
}

export default {
	getList: config => {
		const { title, miaoshu, page = 1, limit = 20, sort } = param2Obj(config.url)

		let mockList = List.filter(item => {
			if (title && item.title.indexOf(title) < 0) return false
			if (miaoshu && item.miaoshu.indexOf(miaoshu) < 0) return false
			return true
		})

		const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

		return {
			total: mockList.length,
			items: pageList
		}
	},

}
