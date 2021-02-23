// pages/shopping/addressAdd/addressAdd.js
const api = require('../../../config/api.js')
const call = require('../../../utils/request.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {
      id:0,
      province_id: 0,
      city_id: 0,
      district_id: 0,
      address: '',
      full_region: '',
      name: '',
      mobile: '',
      is_default: 0
    },
    addressId: 0,
    openSelectRegion: false,
    selectRegionList: [
      { id: 0, name: '省份', parent_id: 1, type: 1 },
      { id: 0, name: '城市', parent_id: 1, type: 2 },
      { id: 0, name: '区县', parent_id: 1, type: 3 }
    ],
    regionType: 1,
    regionList: [],
    selectRegionDone: false
  },

  bindinputMobile(event) {
    let address = this.data.address
    address.mobile = event.detail.value
    this.setData({
      address: address
    })
  },

  bindinputName(event) {
    let address = this.data.address
    address.name = event.detail.value
    this.setData({
      address: address
    })
  },

  bindinputAddress (event){
    let address = this.data.address
    address.address = event.detail.value
    this.setData({
      address: address
    });
  },

  bindIsDefault(){
    let address = this.data.address
    address.is_default = !address.is_default
    this.setData({
      address: address
    });
  },

  getAddressDetail() {
    call.GetData(api.AddressDetail, 
      res => {
        this.setData({
          address: res.data
        })
      }, 
      {id: this.data.addressId}
    )

  },

  getRegionList(regionId) {
    let that = this;
    let regionType = that.data.regionType;
    util.request(api.RegionList, { parentId: regionId }).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          regionList: res.data.map(item => {

            //标记已选择的
            if (regionType == item.type && that.data.selectRegionList[regionType - 1].id == item.id) {
              item.selected = true;
            } else {
              item.selected = false;
            }

            return item;
          })
        });
      }
    });
  },

  setRegionDoneStatus() {
    let doneStatus = this.data.selectRegionList.every(item => {
      return item.id != 0;
    })

    this.setData({
      selectRegionDone: doneStatus
    })

  },

  chooseRegion() {
    this.setData({
      openSelectRegion: !this.data.openSelectRegion
    })

    //设置区域选择数据
    let address = this.data.address
    if (address.province_id > 0 && address.city_id > 0 && address.district_id > 0) {
      let selectRegionList = this.data.selectRegionList
      selectRegionList[0].id = address.province_id
      selectRegionList[0].name = address.province_name
      selectRegionList[0].parent_id = 1

      selectRegionList[1].id = address.city_id
      selectRegionList[1].name = address.city_name
      selectRegionList[1].parent_id = address.province_id

      selectRegionList[2].id = address.district_id
      selectRegionList[2].name = address.district_name
      selectRegionList[2].parent_id = address.city_id

      this.setData({
        selectRegionList: selectRegionList,
        regionType: 3
      })

      this.getRegionList(address.city_id)
    } else {
      this.setData({
        selectRegionList: [
          { id: 0, name: '省份', parent_id: 1, type: 1 },
          { id: 0, name: '城市', parent_id: 1, type: 2 },
          { id: 0, name: '区县', parent_id: 1, type: 3 }
        ],
        regionType: 1
      })
      this.getRegionList(1)
    }

    this.setRegionDoneStatus()
  },

  selectRegionType(event) {
    let regionTypeIndex = event.target.dataset.regionTypeIndex;
    let selectRegionList = this.data.selectRegionList;

    //判断是否可点击
    if (regionTypeIndex + 1 == this.data.regionType || (regionTypeIndex - 1 >= 0 && selectRegionList[regionTypeIndex-1].id <= 0)) {
      return false;
    }

    this.setData({
      regionType: regionTypeIndex + 1
    })
    
    let selectRegionItem = selectRegionList[regionTypeIndex];

    this.getRegionList(selectRegionItem.parent_id);

    this.setRegionDoneStatus();
  },

  selectRegion(event) {
    let regionIndex = event.target.dataset.regionIndex;
    let regionItem = this.data.regionList[regionIndex];
    let regionType = regionItem.type;
    let selectRegionList = this.data.selectRegionList;
    selectRegionList[regionType - 1] = regionItem;

    if (regionType != 3) {
      this.setData({
        selectRegionList: selectRegionList,
        regionType: regionType + 1
      })
      this.getRegionList(regionItem.id);
    } else {
      this.setData({
        selectRegionList: selectRegionList
      })
    }

    //重置下级区域为空
    selectRegionList.map((item, index) => {
      if (index > regionType - 1) {
        item.id = 0;
        item.name = index == 1 ? '城市' : '区县';
        item.parent_id = 0;
      }
      return item;
    });

    this.setData({
      selectRegionList: selectRegionList
    })

    this.setData({
      regionList: this.data.regionList.map(item => {

        //标记已选择的
        if (this.data.regionType == item.type && this.data.selectRegionList[this.data.regionType - 1].id == item.id) {
          item.selected = true;
        } else {
          item.selected = false;
        }

        return item;
      })
    });

    this.setRegionDoneStatus();
  },

  doneSelectRegion() {
    if (this.data.selectRegionDone === false) {
      return false;
    }

    let address = this.data.address;
    let selectRegionList = this.data.selectRegionList;
    address.province_id = selectRegionList[0].id;
    address.city_id = selectRegionList[1].id;
    address.district_id = selectRegionList[2].id;
    address.province_name = selectRegionList[0].name;
    address.city_name = selectRegionList[1].name;
    address.district_name = selectRegionList[2].name;
    address.full_region = selectRegionList.map(item => {
      return item.name;
    }).join('');

    this.setData({
      address: address,
      openSelectRegion: false
    });
  },

  cancelSelectRegion() {
    this.setData({
      openSelectRegion: false,
      regionType: this.data.regionDoneStatus ? 3 : 1
    });

  },
  
  cancelAddress(){
    wx.reLaunch({
      url: '/pages/shopping/address/address',
    })
  },

  saveAddress(){
    console.log(this.data.address)
    let address = this.data.address;

    if (address.name == '') {
      util.showErrorToast('请输入姓名');

      return false;
    }

    if (address.mobile == '') {
      util.showErrorToast('请输入手机号码');
      return false;
    }


    if (address.district_id == 0) {
      util.showErrorToast('请输入省市区');
      return false;
    }

    if (address.address == '') {
      util.showErrorToast('请输入详细地址');
      return false;
    }

    datas = {id: address.id, name: address.name, mobile: address.mobile, province_id: address.province_id, city_id: address.city_id, district_id: address.district_id, address: address.address,  is_default: address.is_default}
    call.PostData(api.AddressSave, 
      res => {
        wx.reLaunch({
          url: '/pages/shopping/address/address',
        })
      }, 
      datas
    )

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