var app = getApp()
module.exports = {

  /* 提交订单 */
  submitOrder: function (event) {
    wx.request({
      url: app.globalData.BASE_API_HOST + "/order/add",
      method: "POST",
      data: choseProductList,
      success: function (res) {
        console.log("提交订单结果:", res)
      },
      fail: function(res){
        
      }
    })
  }
}
