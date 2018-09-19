const crypto = require('crypto') // 加密模块
const https = require('https')
const util = require('util')
const urlUtil = require('url')
const fs = require('fs')

const accessTokenJson = require('./access_token.json'); //引入本地存储的 access_token

/**
 * Wechat
 * Wechat.auth(req, res)
 * Wechat.requestGet(url)
 * Wechat.getAccessToken()
 */
class Wechat {
  constructor(config) {
    this.config = config
    this.token = config.token
    this.appID = config.appID
    this.appScrect = config.appScrect
    this.apiDomain = config.apiDomain
    this.apiURL = config.apiURL

    // 服务器验证
    this.auth = (req, res) => {
      // 1.获取微信服务器Get请求的参数 signature、timestamp、nonce、echostr
      const {
        signature,
        timestamp,
        nonce,
        echostr
      } = req.query

      // 2.将token、timestamp、nonce三个参数进行字典序排序
      let array = [config.token, timestamp, nonce]
      array.sort()

      // 3.将三个参数字符串拼接成一个字符串进行sha1加密
      const tempStr = array.join('')
      const hashCode = crypto.createHash('sha1') //创建加密类型 
      const resultCode = hashCode.update(tempStr, 'utf8').digest('hex')

      // 4.开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
      if (resultCode === signature) {
        res.send(echostr);
      } else {
        // 非微信服务器请求
        res.send('首页');
      }
    }

    // GET请求处理
    this.requestGet = (url) => {
      return new Promise((resolve, reject) => {
        https.get(url, (res) => {
          const buffer = []
          let result = ''
          //监听 data 事件
          res.on('data', (data) => {
            buffer.push(data);
          }).on('end', () => {
            result = Buffer.concat(buffer).toString('utf-8')
            //将最后结果返回
            resolve(result);
          });
        }).on('error', function (err) {
          resolve(err);
        });
      })
    }

    // POST请求处理
    this.requestPost = (url, data = '') => {
      return new Promise((resolve, reject) => {
        const urlData = urlUtil.parse(url)
        const options = {
          hostname: urlData.hostname,
          path: urlData.path,
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(data, 'utf-8')
          }
        }
        const req = https.request(options, (res) => {
          let buffer = []
          let result = ''
          res.on('data', (chunk) => {
            buffer.push(chunk)
          })

          res.on('end', function () {
            result = Buffer.concat(buffer).toString('utf-8');
            resolve(result);
          })
        }).on('error', (err) => {
          console.log(err)
          reject('err');
        })

        req.write(data)
        req.end()
      })
    }

    // access_token获取(若过期则重新获取)
    this.getAccessToken = () => {
      return new Promise((resolve, reject) => {
        // 获取当前时间
        const currentTime = new Date().getTime()
        // 格式请求地址
        const url = util.format(this.apiURL.accessToken, this.apiDomain, this.appID, this.appScrect)
        // 是否过期判断
        if (accessTokenJson.access_token === '' || accessTokenJson.expires_time < currentTime) {
          this.requestGet(url).then((data) => {
            const res = JSON.parse(data)
            if (data.indexOf('errcode' < 0)) {
              accessTokenJson.access_token = res.access_token
              accessTokenJson.expires_time = new Date().getTime() + (parseInt(res.expires_in) - 200) * 1000
              // 存储新的 access_token
              fs.writeFile('./wechat/access_token.json', JSON.stringify(accessTokenJson), (err, res) => {
                if (err) {
                  reject(err);
                  console.log(err.stack)
                  return
                }
                console.log('access_token updated')
              })
              resolve(accessTokenJson.access_token)
            } else {
              resolve(res)
            }
          })
        } else {
          resolve(accessTokenJson.access_token)
        }
      })
    }

    // 获取服务器IP地址
    this.getcallbackip = () => {
      return new Promise((resolve, reject) => {
        this.getAccessToken().then((token) => {
          const url = util.format(this.apiURL.getcallbackip, this.apiDomain, token)
          console.log(url)
          this.requestGet(url).then((res) => {
            resolve(JSON.parse(res))
          })
        })
      })
    }
  }
}

module.exports = Wechat