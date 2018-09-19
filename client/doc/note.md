# 开发笔记

1. 开发环境配置
  + 开发环境接口请求跨域, webpack配置
  ```js
    // proxy
    proxyTable: {
      '/api/': {
        target: 'http://127.0.0.1:3000/', // 接口转发地址
        changeOrigin: true, //是否跨域
        pathRewrite: { //需要rewrite重写
          '^/api': ''
        },
        secure: false
      }
    }
  ```

  + less或sass支持
  ```
  //sass-loader依赖于node-sass
  npm install --save-dev sass-loader node-sass --save-dev

  npm install less less-loader --save
  ```
  ```
  <style lang="sass"></style>

  <style lang="less"></style>
  ```

2. node package
  + VUE相关
    [官网](https://cn.vuejs.org/v2/guide/)
    [vue-router](https://router.vuejs.org/)
    [vue-resource](https://www.npmjs.com/package/vue-resource)
    [Element UI](http://element-cn.eleme.io/#/zh-CN/component/installation)

  + [vue-codemirror](https://www.npmjs.com/package/vue-codemirror)
    基于 Codemirror，适用于 Vue 的 Web 代码编辑器。

  + [json-stable-stringify-pretty](https://www.npmjs.com/package/json-stable-stringify-pretty)