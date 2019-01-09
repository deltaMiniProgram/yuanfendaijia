// 获取app变量
const app = getApp();
// const { SERVER_IP } = app.globalData;
const SERVER_IP = wx.getStorageSync('SERVER_IP');
Page({
  data: {
    src: `${SERVER_IP}/shared/listence`
  },
})
