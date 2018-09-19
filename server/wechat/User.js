const util = require('util')
const WxCode = require('./wxCode')

class User {
  constructor(wechat) {
    this.wechat = wechat
  }

  // create tag
  createTag(data) {
    const WX = this.wechat;
    return new Promise((resolve, reject) => {
      WX.getAccessToken().then((token) => {
        const url = util.format(WX.apiURL.user.createTag, WX.apiDomain, token);
        const postData = JSON.stringify({
          tag: { name: data }
        })
        WX.requestPost(url, postData).then((res) => {
          resolve(resHandle(res, 'create success'))
        })
      })
    })
  }

  // create tag
  getTags() {
    const WX = this.wechat;
    return new Promise((resolve, reject) => {
      WX.getAccessToken().then((token) => {
        const url = util.format(WX.apiURL.user.getTags, WX.apiDomain, token);
        WX.requestPost(url).then((res) => {
          resolve(resHandle(res, 'create success'))
        })
      })
    })
  }

  // create tag
  updateTags(data) {
    const WX = this.wechat;
    return new Promise((resolve, reject) => {
      WX.getAccessToken().then((token) => {
        const url = util.format(WX.apiURL.user.updateTag, WX.apiDomain, token);
        const postData = JSON.stringify({ tag: data })
        WX.requestPost(url, postData).then((res) => {
          resolve(resHandle(res, 'update success'))
        })
      })
    })
  }

  // create tag
  deleteTag(data) {
    const WX = this.wechat;
    return new Promise((resolve, reject) => {
      WX.getAccessToken().then((token) => {
        const url = util.format(WX.apiURL.user.deleteTag, WX.apiDomain, token);
        const postData = JSON.stringify({ tag: data })
        WX.requestPost(url, postData).then((res) => {
          resolve(resHandle(res, 'update success'))
        })
      })
    })
  }

  // get user by tag
  getUserByTag(data) {
    const WX = this.wechat;
    return new Promise((resolve, reject) => {
      WX.getAccessToken().then((token) => {
        const url = util.format(WX.apiURL.user.getUserByTag, WX.apiDomain, token);
        const postData = JSON.stringify({ tagid: 134, next_openid: "" })
        WX.requestPost(url, postData).then((res) => {
          resolve(resHandle(res, 'get success'))
        })
      })
    })
  }
  // get user
  getUser() {
    const WX = this.wechat;
    return new Promise((resolve, reject) => {
      WX.getAccessToken().then((token) => {
        const url = util.format(WX.apiURL.user.getUser, WX.apiDomain, token, '');
        WX.requestGet(url).then((res) => {
          resolve(resHandle(res, 'get success'))
        })
      })
    })
  }
  // get user info
  getUserInfo(data) {
    const WX = this.wechat;
    const { openid, lang } = data
    return new Promise((resolve, reject) => {
      WX.getAccessToken().then((token) => {
        const url = util.format(WX.apiURL.user.getUserInfo, WX.apiDomain, token, openid, lang);
        WX.requestGet(url).then((res) => {
          resolve(resHandle(res, 'get success'))
        })
      })
    })
  }
  // get all user info
  getUserAllInfo(data) {
    const WX = this.wechat;
    const { userlist } = data
    return new Promise((resolve, reject) => {
      WX.getAccessToken().then((token) => {
        const url = util.format(WX.apiURL.user.getAllUserInfo, WX.apiDomain, token);
        WX.requestPost(url, JSON.stringify(userlist)).then((res) => {
          resolve(resHandle(res, 'get success'))
        })
      })
    })
  }

}


function resHandle(res, text) {
  res = JSON.parse(res)
  let resData = {}
  if (res.errcode && parseInt(res.errcode) !== 0) {
    resData = {
      code: -1,
      msg: WxCode[res.errcode],
      data: {
        wxRes: res
      }
    }
  } else {
    resData = {
      code: 1,
      msg: text,
      data: {
        wxRes: res
      }
    }
  }

  return resData;
}


module.exports = User