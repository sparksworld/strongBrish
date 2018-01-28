//app.js
App({
	globalData: {
		userInfo: null
	},
	getUserInfo(cb) {
		var that = this
		if (that.globalData.userInfo) {
			typeof cb == "function" && cb(that.globalData.userInfo)
		} else {
			// wx.login({
			// 	success: function(res){
			// 		console.log(res)
			// 	}
			// })
			//调用登录接口
			wx.login({
				success(res) {
					var code = res.code;
					wx.getUserInfo({
						success: function (get_res) {
							that.globalData.userInfo = get_res.userInfo
							typeof cb == "function" && cb(that.globalData.userInfo)
							wx.request({
								url: 'https://tiaozhan.e63m.cn/dev/public/?s=weixin/wxlogin/loginto',
								data: {
									code: code,
									encryptedData: get_res.encryptedData,
									iv: get_res.iv,
									rawData: get_res.rawData,
									signature: get_res.signature
								},
								method:"GET",
								// header: {
								// 	'content-type': 'application/json' // 默认值
								// },
								success: function (re_res) {
									// that.globalData.userInfo = get_res.userInfo
									// typeof cb == "function" && cb(that.globalData.userInfo)
								}
							})
						},
						fail: function () {
							wx.showModal({
								title: '提示',
								content: '亲，您还未授权，将不能获得更好的体验，请允许授权',
								showCancel: false,
								success: function (res) {
									wx.openSetting({
										success: function () {
											console.log('重新授权')
										}
									})
								}
							})
						}
					})
				}
			})

		}
	}
})