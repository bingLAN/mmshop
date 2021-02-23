// pages/category/category.js
const call = require('../../utils/request.js')
var api = require('../../config/api.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // text:"这是一个页面"
    navList: [],
    goodsList: [],
    id: 0,
    currentCategory: {},
    scrollLeft: 0,
    scrollTop: 0,
    scrollHeight: 0,
    page: 1,
    size: 10000
  },

  getGoodsList() {
    call.GetData(api.GoodsList,
      res => {
        this.setData({
          goodsList: res.data.goodsList,
        })
      },
      {categoryId: this.data.id, page: this.data.page, size: this.data.size}
    )
  },

  getCategoryInfo() {
    call.GetData(api.GoodsCategory, res => {
        this.setData({
          navList: res.data.brotherCategory,
          currentCategory: res.data.currentCategory
        })
        //nav位置
        let currentIndex = 0
        let navListCount = this.data.navList.length
        for (let i = 0; i < navListCount; i++) {
          currentIndex += 1;
          if (this.data.navList[i].id == this.data.id) {
            break;
          }
        }
        if (currentIndex > navListCount / 2 && navListCount > 5) {
          this.setData({
            scrollLeft: currentIndex * 60
          });
        }
        this.getGoodsList();

      },
      {id: this.data.id}
    )

  },

  switchCate(event) {
    if (this.data.id == event.currentTarget.dataset.id) {
      return false
    }

    var clientX = event.detail.x
    var currentTarget = event.currentTarget
    if (clientX < 60) {
      this.setData({
        scrollLeft: currentTarget.offsetLeft - 60
      })
    } else if (clientX > 330) {
      this.setData({
        scrollLeft: currentTarget.offsetLeft
      })
    }
    this.setData({
      id: event.currentTarget.dataset.id
    })

    this.getCategoryInfo()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id) {
      this.setData({
        id: parseInt(options.id)
      });
    }

    wx.getSystemInfo({
      success: function (res) {
        this.setData({
          scrollHeight: res.windowHeight
        });
      }
    })

    this.getCategoryInfo();
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