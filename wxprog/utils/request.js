var api = require('../config/api.js')

const request = (url, method, data = {}) => {
  return new Promise((resolve, reject) => {
      wx.request({
          url: url,
          data: data,
          method: method,
          header: {
              'Content-Type': 'application/json; charset=UTF-8',
              'X-WxShop-Token': wx.getStorageSync('token')
          },
          success(res) {
            console.log("wx.request success: " + JSON.stringify(res))
            if (200 == res.statusCode){
              //errno为服务端返回的data内部字段
              if (0 == res.data.errno){
                resolve(res.data)
              }else{
                //发生错误
                reject(res.data)
              }
            }else{
              reject(res.data)
            }
          },
          fail(error) {
            console.log("wx.request fail: " + JSON.stringify(error))
            reject(error.data)
          }
      })
  })
}

const  GetData = (url, setFuc, data = {}) => {
   request(url, 'GET', data).then(res => {
    setFuc(res)
    }).catch(err => {
      wx.showToast({
        title: err.errmsg,
        icon: 'none'
      })
    })

  }

const PostData = (url, setFuc, data) => {
  request(url, 'POST', data).then(res => {
    setFuc(res)
  }).catch(err => {
    wx.showToast({
      title: err.errmsg,
      icon: 'none'
    })
  })

}
 
const PutData = (url, data) => {
  return request(url, 'PUT', data)
}

const DeleteData = (url, data) => {
  return request(url, 'DELETE', FormData)
}

module.exports = {
  GetData,
  PostData,
  PutData,
  DeleteData,
}