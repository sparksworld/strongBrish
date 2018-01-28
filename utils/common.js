module.exports = {
    showToast(title, icon, duration, mask) {
        wx.showToast({
            mask: mask || false,
            title: title || "请稍后", //
            icon: icon || 'loading',
            duration: duration || 2000
        })
    },
    Loading(status, tip) {
        if (status) {
            wx.showLoading({
                title: tip || '提示'
            })
            return
        }
        if (!status) {
            wx.hideLoading()
        }
    },
    Modal(title, content, showCancel, ...cb) {
        wx.showModal({
            title: title,
            content: content,
            showCancel: showCancel,
            success(res) {
                if (res.confirm) {
                    typeof cb[0] == "function" && cb[0](res)
                } else if (res.cancel) {
                    typeof cb[1] == "function" && cb[1](res)
                }
            }
        })
    }
}