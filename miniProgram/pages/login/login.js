const { $Toast } = require('../../components/base/index');
const { checkMobile, checkPhoneCode, fetchData, urlFormatter } = require('../../utils/util.js');
// 获取app变量
const app = getApp();
const { SERVER_IP } = app.globalData;

Page({
  data: {
    // 微信一键授权登录，暂时不做
    // isQuickLogin: false,
    // quickLoginText: '微信用户快速登录',
    // smsLoginText: '输入手机号码登录/注册',
    btnText: '登录',
    count: 60,
    timer: null,
    // 显示代驾协议提示
    isProtocol: true,
    isActive: -1,
    isLogin: false,
    /**
     * 手机号相关
     */
    userPhone: '',
    // 验证码编号
    randomCodeId: '',
    // 短信验证码 
    randomCode: ''
  },
  onLoad(option) {
  },
  onShow() {
  },

  /**
   * 点击手机号注册（暂时不做）
   */
  goToMbkLogin: function(e) {
    this.setData({
      isQuickLogin: false
    });
  },

  /**
   * 实时验证手机号格式
   */
  isPhone: function(e){
    const that = this;

    const {value} = e.detail || '';
    that.setData({
      isActive: checkMobile(value) ? 1 : -1,
      userPhone: value
    }) 
  },

  /**
   * 获取验证码
   */
  getCode: function(){
    const that = this;
    
    if (that.timer){
      clearInterval(that.timer);
    }
    that.setData({
      isActive: 2
    })
    that.codeCountDown();

    const url = urlFormatter(SERVER_IP, '/shared/randomCode');
    const { userPhone: tel} = that.data;
    fetchData(url, { tel })
      .then( res => {
        const { data: {data: randomCodeId} } = res;
        that.setData({
          randomCodeId
        })
      })
      .catch(err => console.log)
  },

  /**
   * 验证码倒计时
   */
  codeCountDown: function(){
    const that = this;
    
    const timer = setInterval(function(){
      let currentCount = that.data.count - 1;
      if (currentCount <= 0) {
        clearInterval(that.timer);
        that.setData({
          isActive: 1,
          count: 60
        });     
      }else{
        that.setData({
          count: that.data.count - 1
        })
      }  
    }, 1000)

    that.setData({
      timer
    })
  },

  /**
   * 实时验证校验码格式
   */
  isCode: function(e){
    const that = this;

    const { value } = e.detail || '';
    that.setData({
      isLogin: checkPhoneCode(value),
      randomCode: value
    }) 
  },

  /**
   * 登录
   */
  login: function() {
    const that = this;
    const { openId } = app.globalData;
    
    that.setData({
      isLogin: false,
      btnText: '登录中...'
    });

    const url = urlFormatter(SERVER_IP, '/customer/wxRegisterLogin');
    const { userPhone: tel, randomCodeId, randomCode  } = that.data;

    fetchData(url, { 
      tel,
      randomCode,
      randomCodeId,
      openId,
     })
      .then( res => {
        const { data: { map: { USER, token, openId }, success, message } } = res;
        if(success){
          app.globalData.user_info = { ...USER };
          app.globalData.token = data;
          wx.navigateBack({
            delta: 1,
            isLogin: true,
            btnText: '登录',
          })
        }else{
          $Toast({
            content: message,
            type: 'error'
          });

          that.setData({
            isLogin: true,
            btnText: '登录'
          })
        }
        
      })
      .catch(console.log)
  },

  /**
   *  点击《使用规则与代驾协议》进行页面跳转
  */
  goToProtocal: function(){
    wx.navigateTo({
      url: "/pages/protocol/protocol"
    });
  }
});
