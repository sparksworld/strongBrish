var config = require('../config.js')
var common = require('./common.js')
var msgResponse = {}
var connectSocket = () => {
    var noerror = true
    return new Promise((reslove, reject) => {
        wx.connectSocket({
            url: config.socketUrl,
            success() {
                common.Loading(true, '正在连接')
            }
        })
        wx.onSocketOpen((res) => {
            common.Loading(false)
            reslove('----------------------------------------------------->socket通道已打开')
            wx.onSocketMessage((response) => {
                var {action,...data} = JSON.parse(response.data)
                typeof msgResponse[action] == 'function' &&  msgResponse[action](data)
            })
        })
        wx.onSocketError(() => {
            noerror = false
            common.Loading(false)
            common.Modal('网络错误', '连接失败,请重试！', false, () => {
                wx.redirectTo({
                    url: '/pages/index/index'
                })
            })
        })
        wx.onSocketClose((res) => {
            if(res.code == 1000) {
                wx.redirectTo({
                    url: '/pages/index/index'
                })
            }
            console.log('----------------------------------------------------->socket通道已关闭')
        })
    })
}
var wxSend = (event, datas = {}) => {
    datas['action'] = event
    wx.sendSocketMessage({
        data: JSON.stringify(datas)
    })
}
var wxOn = (event, cb) => {
    msgResponse[event] = cb
}
var socketClose = () => {
    wx.closeSocket()
}
module.exports = {
    connectSocket,
    wxSend,
    wxOn,
    socketClose
}