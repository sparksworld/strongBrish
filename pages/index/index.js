//index.js
//获取应用实例
const app = getApp()
const common = require('../../utils/common.js')
Page({
	data: {
		userInfo: {}
	},
	//事件处理函数
	bindViewTap() {
	},
	onLoad() {
		app.getUserInfo((userInfo) => {
			// console.log(userInfo)
			this.setData({
				userInfo: userInfo
			})
		})
	},
	startGame() {
		wx.navigateTo({
			url: '/pages/fight/fight'
		})
	},
	palyRule() {
		common.Modal('玩法介绍', '1、参与挑战需要10金币；2、每局共5题，答题正确，用时越短，得分越高；3、得分高的一方为胜方，胜方获取失败的一方的金币；4、邀请好友奖励5金币。', false)
	},
	onShareAppMessage: function (res) {
		if (res.from === 'button') {
			// 来自页面内转发按钮
			console.log(res.target)
		}
		return {
			title: '最有头脑！邀请您一起玩',
			path: '/pages/index/index',
			success: function (res) {
				// 转发成功
			},
			fail: function (res) {
				// 转发失败
			}
		}
	}
})
