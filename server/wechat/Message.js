const handleMessage = (xml, res) => {
  console.log(xml)
  const {
    ToUserName,
    FromUserName
  } = xml
  switch (xml.MsgType) {
    case 'event':
      handleEvent(xml, res)
      break;
    case 'location':
      const {
        Location_X,
        Location_Y,
        Scale,
        Label
      } = xml
      res.send(textMsg(FromUserName, ToUserName, `地址:${Label}\n纬度:${Location_X}\n经度:${Location_Y}\n位置精度:${Scale}`))
      break;
    case 'text':
      const {
        Content
      } = xml
      const contentArr = [{
        Title: "Node.js 微信自定义菜单",
        Description: "使用Node.js实现自定义微信菜单",
        PicUrl: "http://img.blog.csdn.net/20170605162832842?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvaHZrQ29kZXI=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast",
        Url: "http://blog.csdn.net/hvkcoder/article/details/72868520"
      }, {
        Title: "Node.js access_token的获取、存储及更新",
        Description: "Node.js access_token的获取、存储及更新",
        PicUrl: "http://img.blog.csdn.net/20170528151333883?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvaHZrQ29kZXI=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast",
        Url: "http://blog.csdn.net/hvkcoder/article/details/72783631"
      }, {
        Title: "Node.js 接入微信公众平台开发",
        Description: "Node.js 接入微信公众平台开发",
        PicUrl: "http://img.blog.csdn.net/20170605162832842?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvaHZrQ29kZXI=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast",
        Url: "http://blog.csdn.net/hvkcoder/article/details/72765279"
      }];
      if (Content === '1') {
        res.send(newsMsg(FromUserName, ToUserName, contentArr))
      } else {
        res.send(textMsg(FromUserName, ToUserName, Content))
      }
      break;
    case 'image':
      res.send(imageMsg(FromUserName, ToUserName, xml.MediaId))
      // res.send(textMsg(FromUserName, ToUserName, '图片消息'))
      break;
    case 'voice':
      res.send(textMsg(FromUserName, ToUserName, '语音消息'))
      res.send(imageMsg(FromUserName, ToUserName, xml.MediaId))
      break;
    case 'video':
      res.send(textMsg(FromUserName, ToUserName, '视频消息'))
      res.send(imageMsg(FromUserName, ToUserName, xml.MediaId))
      break;
    case 'music':
      res.send(textMsg(FromUserName, ToUserName, '音乐消息'))
      res.send(imageMsg(FromUserName, ToUserName, xml.MediaId))
      break;
    default:
      res.send(textMsg(FromUserName, ToUserName, '其他消息'))
      break;
  }
}

/** 事件消息类型处理
1 关注/取消关注事件
2 扫描带参数二维码事件
3 上报地理位置事件
4 自定义菜单事件
5 点击菜单拉取消息时的事件推送
6 点击菜单跳转链接时的事件推送} xml
*/
function handleEvent(xml, res) {
  const {
    ToUserName,
    FromUserName
  } = xml
  const eventType = xml.Event.toLowerCase()
  switch (eventType) {
    case 'subscribe': // 关注
      if (xml.EventKey.indexOf('qrscene_') < 0) {
        // 普通关注
        res.send(textMsg(FromUserName, ToUserName, '欢迎关注本公众号!'))
      } else {
        // 扫码带参数二维码关注
        res.send(textMsg(FromUserName, ToUserName, '欢迎扫码关注本公众号!'))
      }
      break;
    case 'scan': // 扫描带参数二维码事件(前提: 已关注)
      res.send(textMsg(FromUserName, ToUserName, '欢迎扫码关注本公众号!'))
      break;
    case 'unsubscribe': // 取消关注
      break;
    case 'location': // 上报地理位置事件
      const {
        Latitude,
        Longitude,
        Precision
      } = xml
      res.send(textMsg(FromUserName, ToUserName, `纬度:${Latitude}\n经度:${Longitude}\n位置精度:${Precision}`))
      break;
    case 'click': // 自定义菜单事件
      const {
        EventKey
      } = xml
      res.send(textMsg(FromUserName, ToUserName, `你点击了: ${EventKey}`))
      break;
    default:
      res.send(textMsg(FromUserName, ToUserName, `${eventType}事件未处理!`))
      break;
  }
}


/*====== 被动回复消息模板 ======*/
// 文本消息
function textMsg(toUser, fromUser, text) {
  return `<xml>
    <ToUserName><![CDATA[${toUser}]]></ToUserName>
    <FromUserName><![CDATA[${fromUser}]]> </FromUserName>
    <CreateTime>${new Date().getTime()}</CreateTime>
    <MsgType><![CDATA[text]]></MsgType>
    <Content><![CDATA[${text}]]></Content>
  </xml>`
}

// 图片消息
function imageMsg(toUser, fromUser, mediaId) {
  return `<xml>
    <ToUserName><![CDATA[${toUser}]]></ToUserName>
    <FromUserName><![CDATA[${fromUser}]]></FromUserName>
    <CreateTime>${new Date().getTime()}</CreateTime>
    <MsgType><![CDATA[image]]></MsgType>
    <Image>
      <MediaId><![CDATA[${mediaId}]]></MediaId>
    </Image>
  </xml>`
}

// 语音消息
function voiceMsg(toUser, fromUser, mediaId) {
  return `<xml>
    <ToUserName><![CDATA[${toUser}]]></ToUserName>
    <FromUserName><![CDATA[${fromUser}]]> </FromUserName>
    <CreateTime>${new Date().getTime()}</CreateTime>
    <MsgType><![CDATA[voice]]></MsgType>
    <Voice>
      <MediaId><![CDATA[${mediaId}]]></MediaId>
    </Voice>
  </xml>`
}

// 视频消息
function videoMsg(toUser, fromUser, mediaId, title, description) {
  return `<xml>
    <ToUserName><![CDATA[${toUser}]]></ToUserName>
    <FromUserName><![CDATA[${fromUser}]]> </FromUserName>
    <CreateTime>${new Date().getTime()}</CreateTime>
    <MsgType><![CDATA[video]]></MsgType>
    <Video>
      <MediaId><![CDATA[${mediaId}]]></MediaId>
      <Title><![CDATA[${title}]]></Title>
      <Description><![CDATA[${description}]]></Description>
    </Video>
  </xml>`
}

// 音乐消息
function musicMsg(toUser, fromUser, title, description, MUSIC_Url, HQ_MUSIC_Url, mediaId) {
  return `<xml>
    <ToUserName><![CDATA[${toUser}]]></ToUserName>
    <FromUserName><![CDATA[${fromUser}]]> </FromUserName>
    <CreateTime>${new Date().getTime()}</CreateTime>
    <MsgType><![CDATA[music]]></MsgType>
    <Music>
      <Title><![CDATA[${title}]]></Title>
      <Description><![CDATA[${description}]]></Description>
      <MusicUrl><![CDATA[${MUSIC_Url}]]></MusicUrl>
      <HQMusicUrl><![CDATA[${HQ_MUSIC_Url}]]></HQMusicUrl>
      <ThumbMediaId><![CDATA[${mediaId}]]></ThumbMediaId>
    </Music>
  </xml>`
}

// 图文消息
/**
 * items = [{
 *  Title: '图文消息标题',
 *  Description: '图文消息描述',
 *  picUrl: '图片链接',
 *  Url: '图文消息跳转链接'
 * }]
 */
function newsMsg(toUser, fromUser, items) {
  let itemsStr = ''
  items.map((item) => {
    itemsStr = `${itemsStr}<item>
        <Title><![CDATA[${item.Title}]]></Title>
        <Description><![CDATA[${item.Description}]]></Description>
        <PicUrl><![CDATA[${item.PicUrl}]]></PicUrl>
        <Url><![CDATA[${item.Url}]]></Url>
      </item>`
  })
  return `<xml>
    <ToUserName><![CDATA[${toUser}]]></ToUserName>
    <FromUserName><![CDATA[${fromUser}]]> </FromUserName>
    <CreateTime>${new Date().getTime()}</CreateTime>
    <MsgType><![CDATA[news]]></MsgType>
    <ArticleCount>${items.length}</ArticleCount>
    <Articles>${itemsStr}</Articles>
  </xml>`
}

module.exports = handleMessage