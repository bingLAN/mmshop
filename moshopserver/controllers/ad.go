package controllers

import (
	"encoding/json"
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/orm"
	"moshopserver/models"
	"moshopserver/utils"
)

type AdController struct {
	beego.Controller
}

type AdAddBody struct {
	Name         string `json:"name"`
	Content      string `json:"content"`
}

func (this *AdController) Ad_Delete() {
	adId := this.GetString("id")
	if adId == "" {
		this.Abort("删除出错")
	}

	intuserId := getLoginUserId()

	//TODO: 根据intuserId，验证是否是管理用户


	o := orm.NewOrm()

	ad := new(models.NideshopAd)

	o.QueryTable(ad).Filter("id", adId).Delete()
	utils.ReturnHTTPSuccess(&this.Controller, "")
	this.ServeJSON()

}

func (this *AdController) Ad_Add() {
	var adContent AdAddBody

	body := this.Ctx.Input.RequestBody
	err := json.Unmarshal(body, &adContent)
	if err != nil {
		this.Abort("删除出错")
	}

	intuserId := getLoginUserId()

	//TODO: 根据intuserId，验证是否是管理用户



	// 读取文件信息
	f, h, err := this.GetFile("file")
	path := "/static/images/ad/" + h.Filename
	f.Close()
	this.SaveToFile("file", path)

	o := orm.NewOrm()
	//存入数据库
	newad :=models.NideshopAd{AdPositionId: 1, MediaType: 1, Name: adContent.Name, Link: "", ImageUrl: path, Content: adContent.Content,
		EndTime: 0, Enabled: 1}

	o.Insert(&newad)

	utils.ReturnHTTPSuccess(&this.Controller, "")
	this.ServeJSON()
}