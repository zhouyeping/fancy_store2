Page({
  onLoad:function(openid){
     this.setData({
       isDisabled: 'false',
       openid: openid.openid
     })
     if(openid=''){
       this.setData({
         isDisabled: ''
       })
     }
  },
  /**
   * 提交表单事件
   */
  onTapDayWeather: function (e) {
    //const db = wx.cloud.database()
    var user_name = e.detail.value.user_name
    var user_openid=this.data.openid

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
  
}

})