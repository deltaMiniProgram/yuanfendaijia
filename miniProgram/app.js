//app.js
const { urlFormatter, fetchData } = require('./utils/util.js');

App({

  // 全局变量
  // globalData: {
  //   SERVER_IP: "http://47.94.0.63",
  //   SERVICE_TEL: '400 828 3718',
  //   user_info: '',
  //   openId: '',
  //   token: ''
  // },
  // 由本地存储替代

  // 启动小程序
  onLaunch: function () {
    const that = this;
    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    // 登录
    that.login();
    // 获取用户信息
    // that.getUserInfo()
    
    //启动小程序时存储数据
    wx.setStorageSync('SERVER_IP', 'http://47.94.0.63');
    wx.setStorageSync('SERVICE_TEL', '400 828 3718');
  },

  // 登录
  login: function(){
    const that = this;

    wx.login({
      success: function(res) {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        const SERVER_IP = wx.getStorageSync('SERVER_IP');
        const url = urlFormatter(SERVER_IP, '/customer/wxlogin')
        fetchData(url, { code: res.code })
          .then(resData => {
            console.log('resData', resData)
            const { data: { map: { USER, token, openId } } } = resData;
            // that.globalData.openId = openId;
            wx.setStorageSync('openId', openId);
            // that.globalData.token = token;
            wx.setStorageSync('token', token);
            // that.globalData.user_info = {...USER};
            wx.setStorageSync('user_info', { ...USER });

          })
          .catch(err => console.log)
      }
    })
  },

  // 获取用户信息
  getUserInfo: function(){
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              // this.globalData.userInfo = res.userInfo
              const { userInfo} = res;
              wx.setStorageSync('user_info', userInfo);

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            },
            fail: err => {
              console.log('fail: ', err)
            }
          })
        }
      }
    })
  }
})