<template>
  <el-container>
    <el-main>
      <h4 class="text-center">{{ pageTitle }}</h4>
      <div class="steps">
        <el-steps :active="active" align-center>
          <el-step title="后台服务启动" description="启动并运行本地服务, 保证服务在本地能正常运行" ></el-step>
          <el-step title="代理设置" description="使用工具(ngrok)将本地服务代理到外网，是外网能正确访问，获取外网访问地址。"></el-step>
          <el-step title="公众号配置" description="配置好的外网访问地址配置到微信公众号的配置信息中。"></el-step>
          <el-step title="测试" description="从后台配置管理公众号"></el-step>
        </el-steps>
        <el-button style="margin-top: 12px;" @click="next">下一步</el-button>
      </div>

    </el-main>
  </el-container>
</template>


<script>
export default {
  data() {
    return {
      pageTitle: '关于',
      active: 0
    };
  },
  methods: {
    next() {
      if (this.active++ > 3) this.active = 0;
    }
  }
};
</script>

<style lang="less" scoped>

</style>
