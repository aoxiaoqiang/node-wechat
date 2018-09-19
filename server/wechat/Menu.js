const util = require('util')
const menusData = require('./menus.json')
const WxCode = require('./wxCode')

/**
 * 菜单操作
 * Menu.create(data)
 * Menu.get()
 * Menu.delete()
 */
class Menu {
  constructor(wechat) {
    this.wechat = wechat

    // 设置菜单
    this.create = (data = menusData) => {
      const that = this.wechat
      return new Promise((resolve, reject) => {
        that.getAccessToken().then((token) => {
          const url = util.format(that.apiURL.menu.create, that.apiDomain, token)
          that.requestPost(url, JSON.stringify(data)).then((res) => {
            res = JSON.parse(res);
            if (res.errcode && Number(res.errcode) !== 0) {
              resolve({
                code: -1,
                msg: WxCode[res.errcode] || res.errmsg,
                data: {
                  wxRes: res
                }
              })
            } else {
              resolve({
                code: 1,
                msg: '菜单更新成功',
                data: Object.assign({
                  wxRes: res
                }, {
                  menu: data
                })
              })
            }
          })
        })
      })
    }

    // 查询菜单
    this.get = () => {
      const that = this.wechat
      return new Promise((resolve, reject) => {
        that.getAccessToken().then((token) => {
          const url = util.format(that.apiURL.menu.get, that.apiDomain, token)
          that.requestGet(url).then((res) => {
            res = JSON.parse(res)
            if (res.errcode && Number(res.errcode) !== 0) {
              resolve({
                code: -1,
                msg: WxCode[res.errcode],
                data: {
                  wxRes: res
                }
              })
            } else {
              resolve({
                code: 1,
                msg: '查询成功',
                data: {
                  wxRes: res
                }
              })
            }
          })
        })
      })
    }

    // 删除菜单
    this.delete = () => {
      const that = this.wechat
      return new Promise((resolve, reject) => {
        that.getAccessToken().then((token) => {
          const url = util.format(that.apiURL.menu.delete, that.apiDomain, token)
          that.requestGet(url).then((res) => {
            res = JSON.parse(res);
            if (res.errcode && Number(res.errcode) !== 0) {
              resolve({
                code: -1,
                msg: WxCode[res.errcode],
                data: {
                  wxRes: res
                }
              })
            } else {
              resolve({
                code: 1,
                msg: '菜单删除成功',
                data: {
                  wxRes: res
                }
              })
            }
          })
        })
      })
    }
  }
}

module.exports = Menu