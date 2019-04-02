const getters = {
    sidebar: state => state.app.sidebar,
    visitedViews: state => state.tagsView.visitedViews,
    cachedViews: state => state.tagsView.cachedViews,
    token: state => state.user.userinfo.token || '',
    head: state => state.user.userinfo.head || '',
    name: state => state.user.userinfo.name || '',
    group: state => state.user.userinfo.group, //用户角色
    roles: state => state.roles, //路由对应的角色组
    setting: state => state.setting, //主题设置
    permission_routers: state => state.routers, //导航路由
    addRouters: state => state.addRouters, //动态//动态路由
    errorLogs: state => state.errorLog.logs,
    shenhe_status: state => state.shenhe_status, //审核状态
    roleData:state=>state.roleData,//登陆的角色
}
export default getters