// pages/ucenter/uindex/uindex.js
const call = require('../../../utils/request.js')
const util = require('../../../utils/util.js')
const api = require('../../../config/api.js')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    showLoginDialog: false
  },

  onUserInfoClick() {
    if (wx.getStorageSync('token')) {

    } else {
      this.showLoginDialog();
    }
  },

  showLoginDialog() {
    this.setData({
      showLoginDialog: true
    })
  },

  onCloseLoginDialog () {
    this.setData({
      showLoginDialog: false
    })
  },

  onDialogBody () {
    // 阻止冒泡
  },

  onWechatLogin(e) {
    if (e.detail.errMsg !== 'getUserInfo:ok') {
      if (e.detail.errMsg === 'getUserInfo:fail auth deny') {
        return false
      }
      wx.showToast({
        title: '微信登录失败',
      })
      return false
    }
    util.login().then((lres) => {
      return call.PostData(api.AuthLoginByWeixin, 
        res => {
          console.log(res)
          if (res.errno !== 0) {
            wx.showToast({
              title: '微信登录失败',
            })
            return false;
          }
          // 设置用户信息
          this.setData({
            userInfo: res.data.userInfo,
            showLoginDialog: false
          });
          app.globalData.userInfo = res.data.userInfo;
          app.globalData.token = res.data.token;
          wx.setStorageSync('userInfo', JSON.stringify(res.data.userInfo));
          wx.setStorageSync('token', res.data.token);
        }, 
        {code: lres, userInfo: e.detail}
      )

    })
  },

  onOrderInfoClick(event) {
    wx.navigateTo({
      url: '/pages/ucenter/order/order',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      userInfo: app.globalData.userInfo,
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})