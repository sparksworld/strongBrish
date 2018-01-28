var app = getApp()
var utils = require('../../utils/util.js')
var datas = require('./mock.js')
var common = require('../../utils/common.js')
const socketIo = require('../../utils/socketIo.js')
var socketOpen = false
Page({
    data: {
        warInfo: {
            selfInfo: {},
            opponent: {}
        },
        animates: {
            bigContenttp: '0',
        },
        items: '',
        timer: '3',
        select: {},
        itemIndex: 0
    },

    onLoad() {
        var _this = this
        this.setData({
            'items': datas.data,
            'warInfo.selfInfo': app.globalData.userInfo,
            'warInfo.selfInfo.gold': 10000,
            'warInfo.selfInfo.success': 33.33,
            'warInfo.questionsLength': Object.keys(datas.data).length
        })
        //数据
        wx.getSystemInfo({
            success(res) {
                _this.setData({
                    'winHeight': res.windowHeight
                })
            }
        })
        socketIo.connectSocket().then((connect) => {
            console.log(connect)
            socketOpen = true
            socketIo.wxSend('ready')
            // socketIo.wxSend('match', {
            //     key: 'match'
            // })
            socketIo.wxOn('ready', (res) => {
                socketIo.wxSend('match', {
                    type: "created",
                    user: "6"
                })
            })
            socketIo.wxOn('find', (_res) => {
                _this.setData({
                    'warInfo.opponent': _res,
                    'room': _res.room
                })
            })
            socketIo.wxOn('match', (_res) => {
                _this.setData({
                    'animates.bigContenttp': '100%'
                })
                _this.timeComput() //计算时间
                // socketIo.socketClose()
            })
        }).catch((error) => {
            socketOpen = false
            console.log(error)
        })
        // wx.connectSocket({
        //     url: 'wss://dev.fanxu.xin'
        // })
        // wx.onSocketOpen((res) => {
        //     socketOpen = true
        //     sendSocketMessage(JSON.stringify({
        //         do: "ready"
        //     }))
        //     wx.onSocketMessage((res) => {
        //         var _res = JSON.parse(res.data)
        //         if (_res.do == "ready") {
        //             sendSocketMessage(JSON.stringify({
        //                 do: "match",
        //                 type: "created",
        //                 user: "6"
        //             }))
        //         }
        //         if (_res.do == "match") {
        //             setTimeout(() => {
        //                 _this.setData({
        //                     'finded': false,
        //                     'warInfo.opponent': _res,
        //                     'room': _res.room
        //                 })
        //                 setTimeout(() => {
        //                     _this.setData({
        //                         'animates.bigContenttp': _this.data.winHeight
        //                     })
        //                     _this.timeComput() //计算时间
        //                 }, 1200)
        //             },2500)

        //             console.log(_res)

        //         }
        //         if (_res.do == "score") {
        //             console.log(_res)
        //             if(_res.change) {
        //                 _this.setData({
        //                     'warInfo.opponent.oppGrade':_res.score.score || ""
        //                 })
        //                 // console.log(_res.score.score)
        //                 _this.go()
        //             }
        //         }
        //     })
        //     wx.onSocketError(() => {
        //         wx.closeSocket()
        //     })
        //     wx.onSocketClose((res) => {
        //         console.log('WebSocket 已关闭！')
        //     })
        // })
    },
    anwser(e) {
        var _this = this
        if (e) {
            let option = e.target.dataset.option //选择的题目
            let key = e.target.dataset.inx //选择的答案
            let right = e.currentTarget.dataset.anwser //正确的答案
            if (this.data.select[option]) {
                return
            }
            this.data.select[option] = new Object();
            this.data.select[option].select = key;
            this.data.select[option].anwser = right;
        } else {
            var currentTarget = Object.keys(this.data.items)[this.data.itemIndex]
            this.data.select[currentTarget] = new Object();
            this.data.select[currentTarget].select = ''
            this.data.select[currentTarget].anwser = this.data.items[currentTarget].anwser
        }
        this.setData({
            'select': this.data.select
        })
        this.computGrade(this.data.select)
        if (socketOpen) {
            socketIo.wxSend('score', {
                score: _this.data.warInfo.selfInfo.selfGrade,
                subject_id: '2',
                user: '6',
                // room: _this.data.room,
                // challenger: _this.data.warInfo.opponent.uid
            })
        }

    },
    // 翻页
    go() {
        var _this = this
        if (_this.data.itemIndex < Object.keys(_this.data.items).length - 1) {
            setTimeout(() => {
                _this.setData({
                    itemIndex: _this.data.itemIndex += 1
                })
                _this.timeComput(3, false)
            }, 500)
            //重置定时器
        } else {
            console.log('--------------------------------------------------->final')
            //暂停定时器
            _this.timeComput(3, true)
            socketIo.wxSend('final')
            setTimeout(() => {
                wx.redirectTo({
                    url: '/pages/settle/settle?warInfo=' + JSON.stringify(_this.data.warInfo)
                })
            }, 500)
        }
    },
    //计算成绩
    computGrade(params) {
        console.log(params)
        var arr = []
        for (var key in params) {
            if (params[key].anwser == params[key].select) {
                arr.push(true)
            }
        }
        this.setData({
            'warInfo.selfInfo.selfGrade': arr.length * 15,
            'warInfo.selfInfo.selfRightLength': arr.length
        })
    },
    //倒计时
    timeComput(init, stop) {
        if (stop) {
            clearTimeout(this.t)
            return
        } else {
            if (init) {
                clearTimeout(this.t)
                this.setData({
                    timer: init
                })
            }
        }
        if (this.data.timer <= 0) {
            this.go()
            return
        }

        this.setData({
            timer: this.data.timer -= 1
        })
        this.t = setTimeout(() => {
            this.timeComput()
        }, 1000)
    },
    cancel() {
        console.log(socketOpen)
        if (socketOpen) {
            socketIo.socketClose()
        } else {
            console.log('返回')
            wx.redirectTo({
                url: '/pages/index/index',
            })
        }
    },
    onUnload() {
        socketIo.wxSend('final')
        this.timeComput('重置定时器', true)
    }
})