var cartApi = require("../../api/cartApi.js")
var orderApi = require("../../api/orderApi.js")
var app = getApp()
// pages/cart/cart.js
Page({
  /**
   * Page initial data
   */
  data: {
    pageIndex: 1,
    pageSize: 10,
    product_list: [],
    totalPrice: 0,
    currentProduct: null, /* 当前用户正在操作的商品 */
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    cartApi.getCartGoodsList({
      page: this.data.pageIndex,
      limit: this.data.pageSize
    }).then(result => {
      this.setData({
        product_list: result
      })
    })
  },

  /* 选中商品回调事件, 暂存提交订单中的商品 */
  addGoodsToOrder(event){
    console.log("选种商品状态发生改变:", event)
    let totalPrice = 0
    this.data.product_list.forEach(function(item){
      if (item.product_id == event.target.dataset.product){
        if (item.isChose) {
          item.isChose = false
        }else{
          item.isChose = true
        }
      }
      if (item.isChose) {
        totalPrice += item.price_count * item.sale_num
      }
    })
    this.setData({
      totalPrice: totalPrice.toFixed(2)
    })
  },

  /* 全选商品 */
  choseAllGoods(event){
    console.log("全选按钮状态发生改变")
    let totalPrice = 0
    if (this.data.product_list.every(item => item.isChose)){
      this.data.product_list.forEach(item => {
        item.isChose = false
      })
    }else{
      this.data.product_list.forEach(item => {
        item.isChose = true
        totalPrice += item.price_count * item.sale_num
      })
    }
    this.setData({
      product_list: this.data.product_list,
      totalPrice: totalPrice.toFixed(2)
    })
  },

  /* 提交商品订单 */
  submitOrder(event){
    let productList = []
    this.data.product_list.map(item => {
      if (item.isChose) {
        productList.push({
          product_id: item.product_id,
          num: item.sale_num
        })
      }
    })
    if (productList.length == 0){
      return wx.showToast({
        title: '请选择商品',
      })
    }
    orderApi.submitOrder({
      product_list: productList
    }).then(result => {
      wx.showToast({
        title: '提交订单成功',
      })
      /* 更新购物车商品列表 */
      cartApi.getCartGoodsList({
        page: this.data.pageIndex,
        limit: this.data.pageSize
      }).then(result => {
        this.setData({
          product_list: result
        })
      })
    }).catch(res => {

    })
  },

  /* 修改购物车商品数量 */
  modifyGoodsNum: function(event){

    cartApi.modifyGoodsNum({
        product_id: event.target.dataset.product,
        sale_num: event.target.dataset.type == "add" ? 1 : -1
    }).then(result => {
      /* 更新商品列表 */
      cartApi.getCartGoodsList({
        page: this.data.pageIndex,
        limit: this.data.pageSize
      }).then(result => {
        this.setData({
          product_list: result
        })
      })
    }).catch(res => {

    })
  },


  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})