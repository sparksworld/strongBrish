Page({
    data:{
        calculate: ''
    },
    onLoad(option) {
        this.setData({
            calculate: JSON.parse(option.warInfo)
        })
        console.log(this.data.calculate)
    }
})