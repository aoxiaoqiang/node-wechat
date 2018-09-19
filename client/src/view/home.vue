<template>
  <el-container>
    <el-header class="header">
      <h3>公众号基础管理</h3>
    </el-header>

    <el-main class="main">
      <el-row class="tac">
        <el-col :span="5">
          <el-menu class="left-menu" default-active="welcome" @open="handleOpen" @close="handleClose">
            <template v-for="menu in elMenus">
              <el-menu-item v-if="!menu.subMenus || menu.subMenus.length === 0" 
                :index="menu.index" 
                :key="menu.index"
                @click="navigate(menu.path ? menu.path : '/')">
                <i :class="menu.icon"></i>
                <span slot="title">{{menu.name}}</span>
              </el-menu-item>
              <el-submenu v-else  :index="menu.index" :key="menu.index">
                <template slot="title">
                  <i :class="menu.icon"></i>
                  <span>{{menu.name}}</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item v-for="subMenu in menu.subMenus" :index="subMenu.index" :key="subMenu.index"
                    @click="navigate(subMenu.path ? subMenu.path : '/')">
                    <!-- <a href="#/menu">{{subMenu.name}}</a> -->
                    <span>{{subMenu.name}}</span>
                  </el-menu-item>
                </el-menu-item-group>
              </el-submenu>
            </template>
          </el-menu>
        </el-col>
        <el-col :span="19">
          <router-view></router-view>
        </el-col>
      </el-row>
    </el-main>

    <el-footer>Footer</el-footer>
  </el-container>
</template>

<script>
export default {
  name: 'home',
  data() {
    return {
      // 侧边导航
      elMenus: [
        {
          index: 'welcome',
          icon: 'el-icon-share',
          name: '快速开始',
          path: '/start'
        },
        {
          index: 'menu',
          icon: 'el-icon-menu',
          name: '菜单设置',
          subMenus: [
            {
              index: 'menu',
              name: '公众号菜单配置',
              path: '/menu'
            }
          ]
        },
        {
          index: 'message',
          icon: 'el-icon-message',
          name: '消息配置',
          subMenus: [
            {
              index: 'textMsg',
              name: '文本消息',
              path: '/message'
            },
            {
              index: 'imageMsg',
              name: '图片消息',
              path: '/message'
            },
            {
              index: 'voiceMsg',
              name: '语音消息',
              path: '/message'
            }
          ]
        },
        {
          index: 'others',
          icon: 'el-icon-setting',
          name: '其他',
          subMenus: [
            {
              index: 'eventHandle',
              name: '接口测试',
              path: '/tool'
            }
          ]
        },
        {
          index: 'about',
          icon: 'el-icon-info',
          name: '关于',
          subMenus: [
            {
              index: 'aboutProject',
              name: '关于项目',
              path: '/about'
            }
          ]
        }
      ]
    };
  },
  methods: {
    // 菜单展开
    handleOpen(key, keyPath) {
      // console.log(key, keyPath);
    },
    // 菜单收起
    handleClose(key, keyPath) {
      // console.log(key, keyPath);
    },
    // 菜单导航
    navigate(path) {
      // console.log(path);
      window.location.href = `/#/home${path}`;
    }
  }
};
</script>

<style lang="less">
body {
  background: #e3e5e8;
}
.header {
  background: #fff;
  text-align: left;
  border-top: 4px solid #44b549;
  border-bottom: 1px solid #d9dadc;
  margin-bottom: 10px;
}
.header h3 {
  margin: 0;
  height: 60px;
  line-height: 56px;
}
.main {
  .tac {
    margin: 0 auto;
    max-width: 1100px;
    background: #fff;
    border-top: 1px solid #d9dadc;
  }
}

.left-menu{
  min-height: 600px;
}

.el-submenu{
  .el-menu {
    overflow: hidden;
  }
  
}

.el-menu-item-group{
  background: #e3e5e8;
  .el-menu-item-group__title {
    padding: 0;
  }
  .el-submenu__title {
    border-left: 2px solid #44b549;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .el-menu-item {
    box-sizing: border-box;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #a2a2a2;
    text-shadow: 1px 1px 0 #fff;
    &:not(:last-child) {
      // border-bottom: 1px solid #f5f5f5;
      border-bottom: 1px solid #dcdcdc;
      box-shadow: 0 1px 0 #ececec;
    }
    &.is-active{
      background: #ECF5FF;
    }
  }
}

</style>

