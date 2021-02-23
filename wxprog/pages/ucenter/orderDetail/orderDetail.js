// pages/ucenter/orderDetail/orderDetail.js
const call = require('../../../utils/request.js')
var api = require('../../../config/api.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId: 0,
    orderInfo: {},
    orderGoods: [],
    handleOption: {}
  },

  getOrderDetail() {
    call.GetData(api.OrderDetail, 
      res => {
        console.log(res.data);
        this.setData({
          orderInfo: res.data.orderInfo,
          orderGoods: res.data.orderGoods,
          handleOption: res.data.handleOption
        })
        //that.payTimer()
      }
    )

  },

  payTimer() {
    let orderInfo = this.data.orderInfo;

    setInterval(() => {
        console.log(orderInfo);
        orderInfo.add_time -= 1;
        this.setData({
          orderInfo: orderInfo,
        });
      }, 
      1000
    );
  },

  payOrder() {
    call.GetData(api.PayPrepayId, 
      res => {
        const payParam = res.data
        wx.requestPayment({
          'timeStamp': payParam.timeStamp,
          'nonceStr': payParam.nonceStr,
          'package': payParam.package,
          'signType': payParam.signType,
          'paySign': payParam.paySign,
          'success': function (res) {
            console.log(res)
          },
          'fail': function (res) {
            console.log(res)
          }
        })
      }, 
      {orderId: this.data.orderId || 15}
    )
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      orderId: options.id
    });
    this.getOrderDetail();
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