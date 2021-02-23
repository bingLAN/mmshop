# mmshop
moshopserver为商场服务端
wxprog为微信小程序前段

wxprog：
部署时需要修改config目录api.js文件里的ApiRootUrl为后端服务器地址

TO DO：
1，某些wxss里使用了background网络地址，更换图片地址的时候不好维护，改成统一可配置路径
2，目前还确实banner，hotgoods，newgoods以及goods栏目的维护管理界面

moshopserver：
部署时需要修改conf目录下wexin.conf文件里的appid与secret，若需要微信支付功能，还需要修改mch_id与apikey

TO DO:
1，目前只实现了banner的维护接口，还需要实现2，目前还需要实现hotgoods，newgoods以及goods栏目的后端接口
2，接口认证方式还需要调整，目前太过死板。