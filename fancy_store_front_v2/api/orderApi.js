var app = getApp()
module.exports = {

  /* 提交订单 */
  submitOrder: function (params) {
    return new Promise(function(resolve, reject){
      wx.request({
        url: app.globalData.BASE_API_HOST + "/order/add",
        method: "POST",
        data: params,
        success: function (res) {
          console.log("提交订单结果:", res)
          if (res.data.status){
            resolve(0)
          }else{
            reject(res)
          }
        },
        fail: function (res) {
          reject(res)
        }
      })
    })

  }
}
