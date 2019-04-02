import Vue from 'vue'
// 加载树形菜单 import 'vue-tree-halower/dist/halower-tree.min.css'
import VTree from 'vue-tree-halower'
//分页
import Page from './components/Page';
//时间范围检索
import Datepicker from './components/Datepicker';
//数据导出
import Download from './components/Download';
//系所筛选
import Xisuo from "./components/xisuo"
//图片预览
import PicViewer from "./components/PicViewer";
//导入数据
import ImportData from "./components/ImportData";

Vue.nextTick(function () {
	Vue.use(Xisuo);
	Vue.use(PicViewer);
	Vue.use(Page);
	Vue.use(VTree);
	Vue.use(Datepicker)
	Vue.use(Download);
	Vue.use(ImportData);
});