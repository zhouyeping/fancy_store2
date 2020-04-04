var app = getApp();
Page({
  wait: function () {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('ajax请求等待')
      }, 2000)
    })
  },

async onLoad() {
    //异步回调获取到openid
    await app.getOpenid(); 
    this.getIp();
    this.getPhoneInfo();
    var openid = app.globalData.openid;
    console.log(openid)
    //连接json数据库
    const db = wx.cloud.database();
    //验证用户是否存在
    db.collection('user').where({
      openid: openid
    }).get({
      success(res) {
        // res.data 包含该记录的数据
        //name = res.data[0].name
        var query_code = Object.keys(res.data).length;
        console.log(query_code)
        //如果此用户注册过信息，则直接跳转到倒计时页面
        if (query_code != 0) {
          app.globalData.user_name = res.data[0].name
          //wx.redirectTo({
           // url: '/pages/countDown/countDown?name=' + res.data[0].name,
          //})
        } else {//没有此登陆用户信息，跳转注册页面
          console.log('No user related information found' + openid)
         //wx.redirectTo({
         // url: '/pages/sign/sign?openid=',
         // })
        }
      },
      fail: err => {
        console.log('No user related information found')
      }
    })
  },
  //获取手机基本信息
getPhoneInfo: function () {
    var _this = this;
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          mobileModel: res.model,
          mobileePixelRatio: res.pixelRatio,
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight,
          language: res.language,
          version: res.version
        })
        console.log('设备信息:' + res.model + res.version)
        app.globalData.phone_info = res.model
      }
    })
  },
  getIp:function() {
    // 获取IP地址
    var _this = this;
      wx.request({
      url: 'https://tianqiapi.com/ip/?appid=72186733&appsecret=GbB4B6tC',
      data: {
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
       app.globalData.ip = res.data.ip       
      }
    })
  },
  goToWeather:function(){
    wx.navigateTo({
      url: '/pages/weather/weather',
    })
  },
  goToCountDown: function () {
    wx.navigateTo({
      url: '/pages/countDown/countDown',
    })
  }


})