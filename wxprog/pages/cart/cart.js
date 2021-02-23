// pages/cart/cart.js
const api = require('../../config/api.js');
const call = require('../../utils/request.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cartGoods: [],
    cartTotal: {
      "goodsCount": 0,
      "goodsAmount": 0.00,
      "checkedGoodsCount": 0,
      "checkedGoodsAmount": 0.00
    },
    isEditCart: false,
    checkedAllStatus: true,
    editCartList: []
  },

  isCheckedAll() {
    //判断购物车商品已全选
    return this.data.cartGoods.every(function (element, index, array) {
      if (element.checked == true) {
        return true;
      } else {
        return false;
      }
    })
  },

  getCartList() {
    call.GetData(api.CartList, 
      res => {
        console.log(res.data);
        this.setData({
          cartGoods: res.data.cartList,
          cartTotal: res.data.cartTotal,
          checkedAllStatus: this.isCheckedAll(),
        });
      }
    )
  },

  editCart() {
    if (this.data.isEditCart) {
      this.getCartList()
      this.setData({
        isEditCart: !this.data.isEditCart
      })

    }else{
      //编辑状态
      let tmpCartList = this.data.cartGoods.map(v => {
        v.checked = false;
        return v;
      })
      this.setData({
        editCartList: this.data.cartGoods,
        cartGoods: tmpCartList,
        isEditCart: !this.data.isEditCart,
        checkedAllStatus: this.isCheckedAll(),
        'cartTotal.checkedGoodsCount': this.getCheckedGoodsCount()
      })
    }
  },

  deleteCart() {
    //获取已选择的商品
    let productIds = this.data.cartGoods.filter(function (element, index, array) {
      if (element.checked == true) {
        return true;
      } else {
        return false;
      }
    })

    if (productIds.length <= 0) {
      return false;
    }

    productIds = productIds.map(function (element, index, array) {
      if (element.checked == true) {
        return element.product_id;
      }
    })

    call.PostData(api.CartDelete, 
      res => {
        console.log("deleteCart: PostData res.data: " + res.data);
        let cartList = res.data.cartList.map(v => {
          console.log(v);
          v.checked = false;
          return v;
        })

        this.setData({
          cartGoods: cartList,
          cartTotal: res.data.cartTotal
        })
  
        this.setData({
          checkedAllStatus: this.isCheckedAll()
        })
      },
      {productIds: productIds.join(',')}
    )
  },

  checkoutOrder() {
    var checkedGoods = this.data.cartGoods.filter(function (element, index, array) {
        if (element.checked == true) {
          return true
        } else {
          return false
        }
      }
    )
    
    if (checkedGoods.length <= 0) {
      return false
    }

    wx.navigateTo({
      url: '../shopping/checkout/checkout'
    })

  },

  updateCart(productId, goodsId, number, id) {
    call.PostData(api.CartUpdate,
      res => {
        console.log(res.data);
        this.setData({
          //cartGoods: res.data.cartList,
          //cartTotal: res.data.cartTotal
        })
        this.setData({
          checkedAllStatus: that.isCheckedAll()
        })
      },
      {
        productId: productId,
        goodsId: goodsId,
        number: number,
        id: id
      }
    )
  },

  cutNumber(event) {
    let itemIndex = event.target.dataset.itemIndex
    let cartItem = this.data.cartGoods[itemIndex]
    let number = (cartItem.number - 1 > 1) ? cartItem.number - 1 : 1
    cartItem.number = number
    this.setData({
      cartGoods: this.data.cartGoods
    })
    this.updateCart(cartItem.product_id, cartItem.goods_id, number, cartItem.id)
  },

  addNumber(event) {
    let itemIndex = event.target.dataset.itemIndex
    let cartItem = this.data.cartGoods[itemIndex]
    let number = cartItem.number + 1
    cartItem.number = number
    this.setData({
      cartGoods: this.data.cartGoods
    })
    this.updateCart(cartItem.product_id, cartItem.goods_id, number, cartItem.id)
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
    this.getCartList();
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