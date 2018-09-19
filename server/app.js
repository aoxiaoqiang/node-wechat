const express = require('express') // express
const parseString = require('xml2js').parseString //引入xml2js包
const bodyParser = require('body-parser') // 请求解析
const config = require('./config') // 引入配置文件

const Wechat = require('./wechat/Wechat')
const Menu = require('./wechat/Menu.js')
const MsgHandle = require('./wechat/Message.js')
const User = require('./wechat/User')

const app = express();
app.use(express.static('public'))
app.use('/api', express.static('apidoc'))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const wechatApp = new Wechat(config)
const wechatMenu = new Menu(wechatApp)
const wechatUser = new User(wechatApp)

/**
 * @api {get} / Auth
 * @apiDescription 微信服务器验证
 * @apiName Auth
 * @apiGroup Wechat
 */
app.get('/', (req, res) => {
  wechatApp.auth(req, res)
})

/**
 * @api {post} / messageHandle
 * @apiDescription 微信服务器消息处理, 包含事件消息和收到的回复消息。
 * 1. 解析消息 xml
 * 2. 根据设置做相应的回复处理。
 * 
 * @apiName messageHandle
 * @apiGroup Wechat
 */
app.post('/', (req, res) => {
  const buffer = [];
  req.on('data', (chunk) => {
    buffer.push(chunk)
  })
  req.on('end', () => {
    var msgXml = Buffer.concat(buffer).toString('utf-8');
    // xml解析
    parseString(msgXml, {
      explicitArray: false
    }, function (err, result) {
      if (!err) MsgHandle(result.xml, res)
      else res.send({
        code: -1,
        data: {
          error: err.stack
        }
      })
    })
  })
})

/**
 * @api {get} /getAccessToken  getAccessToken
 * @apiDescription 从微信服务器获取AccessToken
 * @apiName getAccessToken
 * @apiGroup  Wechat
 * 
 * @apiSuccess {String} AccessToken AccessToken
 */
app.get('/getAccessToken', (req, res) => {
  wechatApp.getAccessToken().then((data) => {
    res.send(data)
  })
})

/**
 * @api {get} /getWxIP  getWxIP
 * @apiDescription 获取微信服务器地址
 * @apiName getWxIP
 * @apiGroup  Wechat
 * @apiSuccessExample {json} 成功
  {
    "ip_list": [
        "101.226.62.77",
        "101.226.62.78",
        "101.226.62.79",
        "101.226.62.80"
      ]
 */
app.get('/getwxip', (req, res) => {
  wechatApp.getcallbackip().then((data) => {
    res.json(data);
  })
})

/**
 * @api {post}  /menu/create  create
 * @apiDescription 创建公众号菜单
 * @apiName create
 * @apiGroup menu
 * 
 * @apiParam {JSON} [menu] 菜单配置json
 * @apiSuccessExample {json} 成功
    {
      "code": 1,
      "msg": "菜单更新成功",
      "data": {
        "wxRes": { "errcode": 0, "errmsg": "ok" },
        "menu": {
          "button": [{
            "name": "示例菜单配置",
            "type": "view",
            "url": "http://mp.weixin.qq.com"
          }, {
            "name": "菜单一",
            "sub_button": [{
              "name": "搜索",
              "type": "view",
              "url": "http://www.soso.com/"
            }, {
              "key": "V1001_GOOD",
              "name": "赞一下我们",
              "type": "click"
            }]
          }]
        }
      }
    }
 * 
 * 
 */
app.post('/menu/create', (req, res) => {
  const { menu } = req.body
  wechatMenu.create(menu).then((data) => {
    res.json(data)
  })
})

/**
 * @api {get}  /menu/get  get
 * @apiDescription 获取菜单配置
 * @apiName get
 * @apiGroup menu
 * 
 * @apiSuccessExample {json} 成功
 * {
 *  "code": 1,
 *  "msg": "查询成功",
 *  "data": {
 *    "wxRes": {
 *      "menu": {
 *        "button": []
 *      }
 *    }
 *  }
 * }
 * 
 * @apiErrorExample {json} 失败
    {
      "code": -1,
      "msg": "不存在的菜单数据",
      "data":
      {
        "wxRes":
        {
          "errcode": 46003,
          "errmsg": "menu no exist hint: [YlU4TA0080vr30]"
        }
      }
    }
 */
app.get('/menu/get', (req, res) => {
  wechatMenu.get().then((data) => {
    res.json(data)
  })
})

/**
 * @api {post}  /menu/delete  delete
 * @apiDescription 删除菜单
 * @apiName delete
 * @apiGroup menu
 * 
 * @apiErrorExample {json} 成功
    {
        "code": 1,
        "msg": "菜单删除成功",
        "data": {
            "wxRes": {
                "errcode": 0,
                "errmsg": "ok"
            }
        }
    }
 */
app.post('/menu/delete', (req, res) => {
  wechatMenu.delete().then((data) => {
    res.json(data)
  })
})

// create tag
app.post('/tag/create', (req, res) => {
  const { tag } = req.body
  wechatUser.createTag(tag).then((data) => {
    res.json(data);
  })
})

// get tag
app.post('/tag/get', (req, res) => {
  wechatUser.getTags().then((data) => {
    res.json(data);
  })
})
// update tag
app.post('/tag/update', (req, res) => {
  const { tag: reqData } = req.body
  wechatUser.updateTags(reqData).then((data) => {
    res.json(data);
  })
})
// delete tag
app.post('/tag/delete', (req, res) => {
  const { tag: reqData } = req.body
  wechatUser.deleteTag(reqData).then((data) => {
    res.json(data);
  })
})

// get user
app.get('/user/get', (req, res) => {
  wechatUser.getUser().then((data) => {
    res.json(data);
  })
})

// get user info
app.get('/user/getinfo', (req, res) => {
  wechatUser.getUserInfo(req.query).then((data) => {
    res.json(data);
  })
})

// get all user info
app.post('/user/getallinfo', (req, res) => {
  const { userlist } = req.body;
  wechatUser.getUserAllInfo(userlist).then((data) => {
    res.json(data);
  })
})




const server = app.listen(3000, 'localhost', () => {
  const host = server.address().address
  const port = server.address().port
  console.log(`Example app listening at http://${host}:${port}`)
})