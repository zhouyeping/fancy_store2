var app = getApp();
Page({
  data: {
    weather: [],//实况天气
    weatherweek: [],//七日天气
  },
  onLoad:function(){
    var ip = app.globalData.ip;
    this.weathertoday(ip);
    this.weatherweekday(ip);
  },
  // 当前IP下实况天气
  weathertoday: function (ip) {
    var _this = this;
    wx.request({
      url: 'https://tianqiapi.com/api?version=v6&appid=72186733&appsecret=GbB4B6tC',
      data: {
        'ip': ip
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        _this.setData({
          weather: res.data
        });
        console.log(_this.data.weather)
      }
    });
  },
  // 当前ip下七日天气
  weatherweekday: function (ip) {
    var _this = this;
    wx.request({
      url: 'https://tianqiapi.com/api?version=v1&appid=72186733&appsecret=GbB4B6tC',
      data: {
        'ip': ip
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        _this.setData({
          weatherweek: res.data
        });
        console.log(_this.data.weatherweek)
      }
    });
  }
})