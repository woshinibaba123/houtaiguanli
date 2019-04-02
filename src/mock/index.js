import Mock from 'mockjs'
import articleAPI from './article'
import usersAPI from './users'
import userGroupAPI from './userGroup'
// import logAPI from './log'
import notifyAPI from './notify'
import shenheAPI from './shenhe'
import remoteSearchAPI from './remoteSearch'
import transactionAPI from './transaction'

// Mock.setup({
//   timeout: '350-600'
// })

// 登录相关
// Mock.mock(/\/login\/login/, 'post', loginAPI.loginByUsername)
// Mock.mock(/\/login\/logout/, 'post', loginAPI.logout)
// Mock.mock(/\/user\/info\.*/, 'get', loginAPI.getUserInfo)

// 文章相关
// Mock.mock(/\/article\/list/, 'get', articleAPI.getList)
// Mock.mock(/\/article\/detail/, 'get', articleAPI.getArticle)
// Mock.mock(/\/article\/pv/, 'get', articleAPI.getPv)
// Mock.mock(/\/article\/create/, 'post', articleAPI.createArticle)
// Mock.mock(/\/article\/update/, 'post', articleAPI.updateArticle)

// // 用户管理相关
// Mock.mock(/\/users\/list/, 'get', usersAPI.getList)
// Mock.mock(/\/users\/detail/, 'get', usersAPI.getUsers)
// Mock.mock(/\/users\/create/, 'post', usersAPI.createUsers)
// Mock.mock(/\/users\/update/, 'post', usersAPI.updateUsers)

// // 用户组管理相关
// Mock.mock(/\/group\/index/, 'get', userGroupAPI.getList)

// // 日志管理相关
// // Mock.mock(/\/log\/index/, 'get', logAPI.getList)
// // Mock.mock(/\/log\/read/, 'get', logAPI.getLog)

// // 通知公告管理
// Mock.mock(/\/notify\/index/, 'get', notifyAPI.getList)
// Mock.mock(/\/notify\/read/, 'get', notifyAPI.getNotify)

// //审核数据Demo
// Mock.mock(/\/shenhe\/index/, 'get', shenheAPI.getList)
// Mock.mock(/\/shenhe\/read/, 'get', shenheAPI.getNotify)
//     // 搜索相关
// Mock.mock(/\/search\/user/, 'get', remoteSearchAPI.searchUser)

// // 账单相关
// Mock.mock(/\/transaction\/list/, 'get', transactionAPI.getList)

export default Mock