# Express开发微信公众号

1. [接入验证](https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421135319)
    1. 获取微信服务器Get请求的参数 signature、timestamp、nonce、echostr
    2. 将token、timestamp、nonce三个参数进行字典序排序
    3. 将三个参数字符串拼接成一个字符串进行sha1加密
    4. 开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
2. [access_token获取](https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140183)
3. [自定义菜单](https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421141013)
    ```json
    {
        "button": [{
            "type":"click",
            "name":"今日歌曲",
            "key":"V1001_TODAY_MUSIC"
        }]
    }
    ```

	1、click: key值与用户进行交互；
	2、view：跳转URL
	3、scancode_push：调起扫一扫工具，完成扫码操作后显示扫描结果（如果是URL，将进入URL），且会将扫码的结果传给开发者
	4、scancode_waitmsg：调起扫一扫工具，完成扫码操作后，将扫码的结果传给开发者，同时收起扫一扫工具，然后弹出“消息接收中”提示框，随后可能会收到开发者下发的消息。
	5、pic_sysphoto：弹出系统拍照
	6、pic_photo_or_album：弹出拍照或者相册发图
	7、pic_weixin：弹出微信相册
	8、location_select：弹出地理位置选择
	9、media_id：下发消息
	10、view_limited：跳转图文消息
	11、miniprogram：跳转小程序
	```json
	{
		"type":"miniprogram",
		"name":"wxa",
		"url":"http://mp.weixin.qq.com",
		"appid":"wx286b93c14bbf93aa",
		"pagepath":"pages/lunar/index"
	}
	```
4. 消息
  接收普通消息: 文本消息、图片消息、语音消息、视频消息、小视频消息、地理位置消息、链接消息
  接收事件推送: 关注/取消关注事件、扫描带参数二维码事件、上报地理位置事件、自定义菜单事件

  被动回复消息
    1 回复文本消息
    2 回复图片消息
    3 回复语音消息
    4 回复视频消息
    5 回复音乐消息
    6 回复图文消息