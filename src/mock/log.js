import Mock from 'mockjs'
import { param2Obj } from '@/utils'

const List = []
const count = 100

for (let i = 0; i < count; i++) {
	List.push(Mock.mock({
		id: '@increment',
		account: '@first',
		url: "@url('http', 'a.ez-tech.cn')",
		'ip': "@ip",
		'content': "@paragraph",
		'add_time': "@now('time', 'yyyy-MM-dd HH:mm:ss')"
	}))
}

export default {
	getList: config => {
		const { account, url, ip, content, page = 1, limit = 20, sort } = param2Obj(config.url)

		let mockList = List.filter(item => {
			if (account && item.account.indexOf(account) < 0) return false
			if (url && item.url.indexOf(url) < 0) return false
			if (ip && item.ip.indexOf(ip) < 0) return false
			if (content && item.content.indexOf(content) < 0) return false
			return true
		})

		const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

		return {
			total: mockList.length,
			datalist: pageList
		}
	},
	//模拟日志详情数据
	getLog: () => ({
		id: 120000000001,
		account: "test",
		url: 'http://a.ez-tech.cn/asdfwedf',
		ip: "192.168.1.1",
		content: 'array( "id" => 1, "title" => 上海师范大学夏令营活动, "addr" => 上海市徐汇区上海师大徐汇校区西部-东门, "total" => 100, "aver" => 2, "type" => 2, "content" => <p style="color: rgb(0, 0, 0); font-family: 宋体;"><strong>一、夏令营前准备情况</strong></p><p style="color: rgb(0, 0, 0); font-family: 宋体;">　　此次聚会得到**教会的大力支持，就餐问题由该教会马大们负责。负责打扫、接待、签到、住宿安排工作的是来自不同教会、不同大学、不同校园团契的大学生们，他们在聚会前两天就已来到这里灵修、祷告。诗歌敬拜主要由**大学生团契牧区敬拜团和校园祭坛牧区敬拜团负责。在背后还有一只祷告队伍，就是该教会的属灵长辈们，他们定时在祷告室集中，为这次夏令营恳切流泪祈求。</p><p style="color: rgb(0, 0, 0); font-family: 宋体;"><strong>　　二、内容丰富多彩</strong></p><p style="color: rgb(0, 0, 0); font-family: 宋体;">　　1、婚前教育</p><p style="color: rgb(0, 0, 0); font-family: 宋体;">　　这部分是本次夏令营的重点，由贺老师讲授，大家通过讨论得出许多结果，作为丈夫应该有责任心，有爱心，节制等等，作为妻子不要作谗舌妇，守贞洁，谦卑温柔。大家还学习到将来如何教育自己的孩子，让大学生意识到虽还未进入婚姻，这个也是现在就应该准备的内容。现代社会恋爱观被扭曲，婚恋混乱，基督徒大学生的身心受到严重挑战，贺老师用圣经的话纠正大家的观念，并提出殷切的期望，劝未婚弟兄姐妹将目光专注在神身上，神既将爱子都赐下，岂不将那最合适的另一半赐给你吗?</p><p style="color: rgb(0, 0, 0); font-family: 宋体;">　　2、合一引起共鸣</p><p style="color: rgb(0, 0, 0); font-family: 宋体;">　　在20号，一对双胞胎姐妹生日，晚上全会众给她们庆祝，送上生日蛋糕，虽然大家都来自各地，但主的爱将我们紧紧连在一起，这种氛围将我们引到合一上。来自**各片的大学生弟兄姐妹派代表走到台前，他们流着泪互相道歉，表示不要停留在上一辈的恩怨中，**的复兴需要合一!我们这一代要合一!弟兄姐妹拥抱在一起，全场哭声一片，圣灵的工作势不可挡。</p><p style="color: rgb(0, 0, 0); font-family: 宋体;">　　3、继承属灵资产</p><p style="color: rgb(0, 0, 0); font-family: 宋体;">　　对于我们这一代从小就在主日学长大的大学生来说，属灵伟人的丰功伟绩我们是不陌生的，但似乎只当作知识领受，无法与个人衔接起来，而贺老师这一堂“继承属灵资产”却震撼大家，前辈的属灵资产是我们的财富，我们必须继承，让恩膏延续……</p><p style="color: rgb(0, 0, 0); font-family: 宋体;">　　4、人生价值</p><p style="color: rgb(0, 0, 0); font-family: 宋体;">　　叶**大哥详细透彻地讲到基督徒正确的人生观、价值观，思想决定行动，形成正确的人生观、价值观对大学生在团契服侍、以后在教会服侍都产生至关重要的影响。</p><p style="color: rgb(0, 0, 0); font-family: 宋体;">　　5、阐释、传递异象</p><p style="color: rgb(0, 0, 0); font-family: 宋体;">　　勇哥向我们传递校园团契异象，近几年校园团契如雨后春笋般涌现，扩张迅速，但有些团契<a class="channel_keylink" href="https://www.unjs.com/fanwenwang/gzzd/" style="color: rgb(0, 0, 0);">管理</a>结构的健全稳定后反而开始原地踏步，原因就在于缺乏看见，没有明确的目标何来突破?</p><p style="color: rgb(0, 0, 0); font-family: 宋体;">　　6、你是神的杰作</p><p style="color: rgb(0, 0, 0); font-family: 宋体;">　　通过拍卖会上一把小提琴被主人弹奏后价值频频上升的短片，告诉我们，我们就如被抚摸过的小提琴。由于基督钉痕手的抚摸，原本毫无价值的我们就成了神的儿子，所以不要自卑，不要沮丧，你我是上帝的杰作!</p><p style="color: rgb(0, 0, 0); font-family: 宋体;"><strong>　　三、形式富有特色</strong></p><p style="color: rgb(0, 0, 0); font-family: 宋体;">　　除了神的仆人证道的形式，本次夏令营并不单调：有party、小组讨论分享、看短片等形式，各种活动符合年轻基督徒的口味，比如在夏令营中搞派对，很多人还是第一次接触。另外，本次的接待工作很有特色，在去教堂的道路转角、教堂阶梯上、门口都有接待人员站着，他们极其热情，每来一位朋友都会伸手欢迎，亲切问候，等签到接待人员会带领他到指定座位。</p><p style="color: rgb(0, 0, 0); font-family: 宋体;"><strong>　　四、学生收益颇丰</strong></p><p style="color: rgb(0, 0, 0); font-family: 宋体;">　　从大家喜乐的脸上很明显可以看出这次夏令营他们是有得到的，在回馈调查表中，好多人反映这次老师带来的信息很宝贵，很切<a class="channel_keylink" href="https://www.unjs.com/zuowendaquan/shenghuozuowen/" style="color: rgb(0, 0, 0);">生活</a>实际。</p><p style="color: rgb(0, 0, 0); font-family: 宋体;">　　1、异象传递</p><p style="color: rgb(0, 0, 0); font-family: 宋体;">　　透过这次夏令营一位弟兄说也要在自己本教会建立青年团契，在校团契负责同工们领受异象开始对下学期事工制定<a class="channel_keylink" href="https://www.unjs.com/fanwenwang/gzjh/" style="color: rgb(0, 0, 0);">计划</a></p><p style="color: rgb(0, 0, 0); font-family: 宋体;">　　2、培养感情</p><p style="color: rgb(0, 0, 0); font-family: 宋体;">　　经过几天在一起的生活，弟兄姐妹开始熟识，小组里纷纷留下号码方便以后联系。</p><p style="color: rgb(0, 0, 0); font-family: 宋体;">　　3、合而为一</p><p style="color: rgb(0, 0, 0); font-family: 宋体;">　　在青年一代，合一已在心中扎根发芽，不管是在哪里聚会，我们是同属一个教会的，基督是我们的元首，我们不愿看到神的家四分五裂，神的家就只有一个!</p><p style="color: rgb(0, 0, 0); font-family: 宋体;">　　4、心灵苏醒</p><p style="color: rgb(0, 0, 0); font-family: 宋体;">　　很多弟兄姐妹都有这样的感受，要重新得力。一位姐妹说：”我感到肩上责任重大，时代已转到我们身上，属灵资产是长辈留给我们的财富，我却没有继承，当时听到这个信息时有种大难临头的感觉，我觉得对不起神，对不起历代教会的长辈们……”</p><p style="color: rgb(0, 0, 0); font-family: 宋体;">　　5、观念转变</p><p style="color: rgb(0, 0, 0); font-family: 宋体;">　　吴**姐妹说：“感谢神!老师讲的让我明白了好多，比如婚前教育。这让我懂得了让我保守自己做圣洁的人，不被世界上的罪恶冲走，还有很希望奉献给神用，传扬主的名!”李**姐妹说：“透过这次学习，让我重新与神建立关系，重新拿起神给我的异象、重新让我找到了人生的价值!”高*弟兄说：“对自己的服侍有更深的认识需要有异象，而且在自己个人言语、行为上都更加有节制。活出基督的样式!”</p>, "is_top" => 1, "is_show" => 2, "beizhu" => , "img" => /public/upload/image//20180424/ee9a123f3273ab803b2817f3035093cf.jpg, "str_time" => 1525344900, "strtime" => 1525028400, "endtime" => 1525115640, "account" => admin, "name" => 超级管理员 )',
		add_time: '2018-05-06 10:15:20'
	}),
}
