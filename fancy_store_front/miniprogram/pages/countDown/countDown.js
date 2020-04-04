var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    timer: 'timeShow',//定时器名字
  },

  onShow: function () {
    //什么时候触发倒计时，就在什么地方调用这个函数
    this.countDown();
  },
  onLoad:function(){
    var user_name = app.globalData.user_name;
    this.setData({
      userName: user_name,
    })
  },
  /**
  * 提交表单事件
  */
  onTapDayWeather: function (e) {
    var _this=this;
    //const db = wx.cloud.database()
    var user_name = e.detail.value.user_name
    console.log(user_name);
    if (user_name!=''){
      this.setData({
        user_name: user_name,
        n_value: '',
        disabled: 'false'
      });
    }
  
    
    /*wx.cloud.callFunction({
        name: 'callback',
        data: {
          openid:'ocK--4vZSAyTqhIE0z_JSP_UlTa0',
          name: user_name,
          phone: '15668100129',
          ip: '192.168.55.54',
          imei: '357257090139267'
        },
         complete: res => {
          console.log('callFunction  result: ', res)
        }
    }) */

  },
  countDown: function () {
    let that = this;
    let countDownNum = that.data.countDownNum;//获取倒计时初始值
    //如果将定时器设置在外面，那么用户就看不到countDownNum的数值动态变化，所以要把定时器存进data里面
    that.setData({
      timer: setInterval(function () {//这里把setInterval赋值给变量名为timer的变量
        var nowTime = new Date();
        var rescTime = new Date('2021/01/01 00:00:00').getTime() - nowTime.getTime();
        var day = parseInt(rescTime / (60 * 60 * 24 * 1000));
        var hour = parseInt(rescTime / (60 * 60 * 1000) % 24);
        var minu = parseInt(rescTime / (60 * 1000) % 60);
        var sec = parseInt(rescTime / 1000 % 60);
        var timeStr ='2020年还剩:'+day + '天' + hour + '时' + minu + '分' + sec + '秒';
        //然后把countDownNum存进data，好让用户知道时间在倒计着

        that.setData({
          countDownNum: timeStr
        })
        //在倒计时还未到0时，这中间可以做其他的事情，按项目需求来
        if (countDownNum == 0) {
          //这里特别要注意，计时器是始终一直在走的，如果你的时间为0，那么就要关掉定时器！不然相当耗性能
          //因为timer是存在data里面的，所以在关掉时，也要在data里取出后再关闭
          clearInterval(that.data.timer);
          //关闭定时器之后，可作其他处理codes go here
        }
      }, 100)
    })
  }
})