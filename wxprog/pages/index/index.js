// index.js
const api = require('../../config/api.js');
const call = require('../../utils/request.js');
// 获取应用实例
const app = getApp()

Page({
  data: {
    goodsCount: 0,
    newGoods: [],
    hotGoods: [],
    topics: [],
    brands: [],
    floorGoods: [],
    banner: [],
    channel: []
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  getIndexData() {
    call.GetData(api.IndexUrl, 
      res => {
        this.setData({
          newGoods: res.data.newGoodsList,
          hotGoods: res.data.hotGoodsList,
          topics: res.data.topicList,
          brand: res.data.brandList,
          floorGoods: res.data.categoryList,
          banner: res.data.banner,
          channel: res.data.channel
        })
      }
    )
  },

  getGoodsCount() {
    call.GetData(api.GoodsCount, 
      res => {
        this.setData({
          goodsCount: res.data.goodsCount
        })
      }
    )
  },

  onLoad() {
    this.getIndexData()
    this.getGoodsCount()
  },
  
})
