// 获取app变量
const app = getApp();
const SERVER_IP = wx.getStorageSync('SERVER_IP');

Page({
  data: {
    tel: '',
    balance: 0.0,
    name: ''
  },

  onLoad: function () {
    const that = this;
    const userInfo = wx.getStorageSync('user_info')
    const { tel, balance, name } = userInfo;
    that.setData({
      tel,
      balance: balance.toFixed(1),
      name
    })
  },
  goToaccount(e) {
    const { currentTarget: { dataset: { balance } } } = e;
    wx.navigateTo({
      url: `../account/account?balance=${balance}`,
    })

  }
});