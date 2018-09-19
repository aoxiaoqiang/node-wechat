<template>
  <el-container>
    <el-main>
      <h4 class="text-center">{{ pageTitle }}</h4>
      <div>
        <ul>
          <li v-for="(info, index) in account" :key="index">
            <div v-if="info.type === 'link'">
              <h5 class="title-5"><a :href="info.data" target="_blank">{{info.name}}</a></h5>
            </div>
            <div v-if="info.type === 'image'">
              <h5 class="title-5">{{info.name}}</h5>
              <img class="qrcode-image" :src="info.data" alt="info.name">
            </div>
          </li>
        </ul>

        <ul>
          <li v-for="(url, text) in packages" :key="text">
            <h5 class="title-5"><a :href="url" target="_blank">{{text}}</a></h5>
          </li>
        </ul>
      </div>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: 'start',
  data() {
    return {
      pageTitle: '快速导航',
      account: [
        {
          name: '公众号(测试号)管理',
          type: 'link',
          data:
            'https://mp.weixin.qq.com/debug/cgi-bin/sandboxinfo?action=showinfo&t=sandbox/index'
        },
        {
          name: '微信公众平台开发文档',
          type: 'link',
          data:
            'https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1445241432'
        },
        {
          name: '公众号二维码',
          type: 'image',
          data:
            'http://mmbiz.qpic.cn/mmbiz_jpg/N67wicamxZ7gTeTkoCxQC46SQdMHLgz8sXAj6eJdz5FubG8QfAo2FOWkJ7To6R5ZHiab5tNmlAAib1AJjUNPG2IUw/0'
        },
      ],
      packages: {
        'Vue官网': 'https://cn.vuejs.org/v2/guide/',
        'Element UI官网': 'http://element-cn.eleme.io/#/zh-CN/component/installation',
        'vue-router': 'https://router.vuejs.org/',
        'vue-resource': 'https://www.npmjs.com/package/vue-resource',
        'vue-codemirror': 'https://www.npmjs.com/package/vue-codemirror',
        'json-stable-stringify-pretty': 'https://www.npmjs.com/package/json-stable-stringify-pretty',
        'vue-router': 'https://router.vuejs.org/',
      }
    };
  },
};
</script>

<style scoped>
.title-5 {
  margin: 10px 0;
  font-size: 14px;
}
.qrcode-image {
  display: block;
  width: 160px;
  border: 1px solid #eee;
}
</style>