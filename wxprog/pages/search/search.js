// pages/search/search.js
const api = require('../../config/api.js');
const call = require('../../utils/request.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    keywrod: '',
    searchStatus: false,
    goodsList: [],
    helpKeyword: [],
    historyKeyword: [],
    categoryFilter: false,
    currentSortType: 'default',
    currentSortOrder: '',
    filterCategory: [],
    defaultKeyword: {},
    hotKeyword: [],
    page: 1,
    size: 20,
    currentSortType: 'id',
    currentSortOrder: 'desc',
    categoryId: 0
  },

  getSearchKeyword() {
    call.GetData(api.SearchIndex, 
      res => {
        this.setData({
          historyKeyword: res.data.historyKeywordList,
          defaultKeyword: res.data.defaultKeyword,
          hotKeyword: res.data.hotKeywordList
        })
      }
    )
  },

  getGoodsList() {
    datas = {keyword: this.data.keyword, page: this.data.page, size: this.data.size, sort: this.data.currentSortType, order: this.data.currentSortOrder, categoryId: this.data.categoryId}
    call.GetData(api.GoodsList, 
      res => {
          that.setData({
            searchStatus: true,
            categoryFilter: false,
            goodsList: res.data.data,
            filterCategory: res.data.filterCategory,
            page: res.data.currentPage,
            size: res.data.numsPerPage
          })

          //重新获取关键词
        this.getSearchKeyword();
      }, 
      datas
    )

  },

  getSearchResult(keyword) {
    this.setData({
      keyword: keyword,
      page: 1,
      categoryId: 0,
      goodsList: []
    })

    this.getGoodsList();
  },

  onKeywordTap(event) {
    this.getSearchResult(event.target.dataset.keyword);
  },

  openSortFilter(event) {
    let currentId = event.currentTarget.id;
    switch (currentId) {
      case 'categoryFilter':
        this.setData({
          'categoryFilter': !this.data.categoryFilter,
          'currentSortOrder': 'asc'
        });
        break;
      case 'priceSort':
        let tmpSortOrder = 'asc';
        if (this.data.currentSortOrder == 'asc') {
          tmpSortOrder = 'desc';
        }
        this.setData({
          'currentSortType': 'price',
          'currentSortOrder': tmpSortOrder,
          'categoryFilter': false
        });

        this.getGoodsList();
        break;
      default:
        //综合排序
        this.setData({
          'currentSortType': 'default',
          'currentSortOrder': 'desc',
          'categoryFilter': false
        });
        this.getGoodsList();
    }
  },

  selectCategory(event) {
    let currentIndex = event.target.dataset.categoryIndex;
    let filterCategory = this.data.filterCategory;
    let currentCategory = null;
    for (let key in filterCategory) {
      if (key == currentIndex) {
        filterCategory[key].selected = true;
        currentCategory = filterCategory[key];
      } else {
        filterCategory[key].selected = false;
      }
    }
    this.setData({
      'filterCategory': filterCategory,
      'categoryFilter': false,
      categoryId: currentCategory.id,
      page: 1,
      goodsList: []
    });
    this.getGoodsList();
  },

  onKeywordConfirm(event) {
    this.getSearchResult(event.detail.value);
  },

  clearHistory() {
    this.setData({
      historyKeyword: []
    })

    call.PostData(api.SearchClearHistory, 
      res => {
        console.log('清除成功');
      }, 
      {}
    )
  },

  inputFocus() {
    this.setData({
      searchStatus: false,
      goodsList: []
    });

    if (this.data.keyword) {
      this.getHelpKeyword()
    }
  },

  getHelpKeyword() {
    call.GetData(api.SearchHelper, 
      res => {
        this.setData({
          helpKeyword: res.data
        })
      }, 
      {keyword: this.data.keyword}
    )

  },

  inputChange(e) {

    this.setData({
      keyword: e.detail.value,
      searchStatus: false
    });
    this.getHelpKeyword();
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