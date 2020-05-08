var app = getApp()

module.exports = {

  /* 获取购物车商品列表 */
  getCartGoodsList: function (params) {
    /* 注意这个地方this指代的是什么 */
    // let self = this
    return new Promise(function(resolve, reject){
      wx.request({
        url: app.globalData.BASE_API_HOST + '/cart/query',
        data: params,
        success: function (res) {
          console.log(res)
          if (res.statusCode === 200 && res.data.status) {
            res.data.data.forEach(item => {
              item.isChose = false
            })
            resolve(res.data.data)
          }else{
            reject()
          }
        },
        fail: function(res){
          reject(res)
        }
      })
    })
  },

  /* 修改购物车商品数量 */
  modifyGoodsNum: function (params) {
    return new Promise(function(resolve, reject){
      wx.request({
        url: app.globalData.BASE_API_HOST + "/cart/modify",
        method: "POST",
        data: params,
        success: function (res) {
          console.log("修改商品购物车数量结果:", res)
          if (res.data.status){
            resolve(0)
          }else{
            reject(res)
          }
        },
        fail: function(res){
          reject(res)
        }
      })
    })
  }
}