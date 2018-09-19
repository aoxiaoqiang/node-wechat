<template>
  <el-container>
    <el-main>
      <h4 class="text-center">{{ pageTitle }}</h4>
      <div class="doc-box">
        <p class="lines">1、自定义菜单最多包括3个一级菜单，每个一级菜单最多包含5个二级菜单。</p>
        <p class="lines">2、一级菜单最多4个汉字，二级菜单最多7个汉字，多出来的部分将会以“...”代替。</p>
        <p class="lines">3、创建自定义菜单后，菜单的刷新策略是，在用户进入公众号会话页或公众号profile页时，如果发现上一次拉取菜单的请求在5分钟以前，就会拉取一下菜单，如果菜单有更新，就会刷新客户端的菜单。测试时可以尝试取消关注公众账号后再次关注，则可以看到创建后的效果。</p>
        <p class="lines">4、配置格式详情: 请查看“<a class="text-small" href="https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421141013" target="_blank">菜单配置官方说明文档</a>”。</p>
      </div>
      <div>
        <el-button type="primary" icon="el-icon-search" @click="getMenu()">获取菜单</el-button>
        <el-button type="success" :icon="editBtnStatus ? 'el-icon-edit':'el-icon-upload2'" @click="createMenu()">
          {{ editBtnStatus? '修改': '更新'}}菜单
        </el-button>
        <el-button type="danger" icon="el-icon-delete" @click="deleteMenu()">删除菜单</el-button>
      </div>
      
      <div class="code-box" v-show="isShowEditor">
        <el-row type="flex" class="mode-line" justify="space-between">
          <el-col :span="6">
            <span :class="{ 'text-active': !cmOptions.readOnly }">[{{cmOptions.readOnly ? '只读模式':'编辑模式'}}]</span>
          </el-col>
          <el-col :span="6" class="text-right">
            <el-tooltip effect="dark" content="取消编辑" placement="top-end">
              <el-button type="primary" size="mini" @click="cancelEdit" icon="el-icon-edit-outline"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="格式化配置文件" placement="top-end">
              <el-button type="success" size="mini" @click="formateCode" icon="el-icon-refresh"></el-button>
            </el-tooltip>
          </el-col>
        </el-row>

        <codemirror ref="myCm" v-model="code" :options="cmOptions" @input="onCmCodeChange" @ready="onCmReady"></codemirror>
      </div>
    </el-main>
  </el-container>
</template>

<script>
// https://github.com/surmon-china/vue-codemirror
import { codemirror } from 'vue-codemirror';
import stringify from 'json-stable-stringify';
import Apis from '../config/api';

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';

// language
import 'codemirror/mode/javascript/javascript.js';
// require active-line.js
import 'codemirror/addon/selection/active-line.js';
// styleSelectedText
import 'codemirror/addon/selection/mark-selection.js';
import 'codemirror/addon/search/searchcursor.js';
// hint
import 'codemirror/addon/hint/show-hint.js';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/hint/javascript-hint.js';
import 'codemirror/addon/selection/active-line.js';
// highlightSelectionMatches
import 'codemirror/addon/scroll/annotatescrollbar.js';
import 'codemirror/addon/search/matchesonscrollbar.js';
import 'codemirror/addon/search/searchcursor.js';
import 'codemirror/addon/search/match-highlighter.js';
// keyMap
import 'codemirror/mode/clike/clike.js';
import 'codemirror/addon/edit/matchbrackets.js';
import 'codemirror/addon/comment/comment.js';
import 'codemirror/addon/dialog/dialog.js';
import 'codemirror/addon/dialog/dialog.css';
import 'codemirror/addon/search/searchcursor.js';
import 'codemirror/addon/search/search.js';
import 'codemirror/keymap/sublime.js';
// foldGutter
import 'codemirror/addon/fold/foldgutter.css';
import 'codemirror/addon/fold/brace-fold.js';
import 'codemirror/addon/fold/comment-fold.js';
import 'codemirror/addon/fold/foldcode.js';
import 'codemirror/addon/fold/foldgutter.js';
import 'codemirror/addon/fold/indent-fold.js';
import 'codemirror/addon/fold/markdown-fold.js';
import 'codemirror/addon/fold/xml-fold.js';

export default {
  name: 'home',
  data() {
    return {
      pageTitle: '公众号菜单设置', // 页面标题
      code: '', // 编辑器代码
      editBtnStatus: true, // 修改/更新按钮状态标识
      isShowEditor: false, // 是否显示编辑器
      cmOptions: {
        tabSize: 6,
        mode: {
          name: 'javascript',
          json: true
        },
        theme: 'material',
        lineNumbers: true,
        line: true,
        maxHighlightLength: 200,
        readOnly: true,
        autofocus: false,
        // more codemirror options, 更多 codemirror 的高级配置... Monokai
        styleActiveLine: false,
        styleSelectedText: false,
        foldGutter: true,
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
        highlightSelectionMatches: { showToken: /\w/, annotateScrollbar: true },
        // hint.js options
        hintOptions: {
          // 当匹配只有一项的时候是否自动补全
          completeSingle: true
        },
        //快捷键 可提供三种模式 sublime、emacs、vim
        keyMap: 'sublime',
        matchBrackets: true,
        showCursorWhenSelecting: true,
        extraKeys: { Tab: 'autocomplete' }
      }
    };
  },
  components: {
    codemirror
  },
  methods: {
    onCmCodeChange(newCode) { // 代码更新
      this.code = newCode;
    },
    onCmReady() { // 初始化
      // this.getMenu();
    },
    getMenu() { // 获取菜单
      this.editBtnStatus = true;
      // 获取菜单配置信息
      this.setEditorMode('read');
      this.getMenuData().then(res => {
        const { code, data, msg } = res.body;
        if (code === 1) {
          this.$message({
            message: msg,
            type: 'success',
            duration: 1200
          });
          this.code = stringify(data.wxRes.menu, { space: '  ' });
        } else {
          this.$message({
            showClose: true,
            message: msg,
            type: 'error'
          });
          this.code = stringify(msg, { space: '  ' });
        }
        this.isShowEditor = true;
      });
    },
    createMenu() {  // 修改/更新菜单
      if (this.editBtnStatus) { // 获取最新配置,进入编辑模式
        this.getMenuData().then(res => {
          console.log('run hear')
          const { code, data } = res.body;
          if (code === 1) {
            // 已获取到最新菜单配置,格式化配置
            this.code = stringify(data.wxRes.menu, { space: '  ' });
          } else {
            // 没有配置菜单或菜单配置不正确
            const ExampleConfig = '{"button":[{"type":"view","name":"示例菜单配置","url":"http://mp.weixin.qq.com"},{"name":"菜单一","sub_button":[{"type":"view","name":"搜索","url":"http://www.soso.com/"},{"type":"click","name":"赞一下我们","key":"V1001_GOOD"}]}]}';
            this.code = stringify(JSON.parse(ExampleConfig), { space: '  ' });
          }
          this.setEditorMode('write', true);
          this.editBtnStatus = false;
          this.isShowEditor = true;
        });
      } else { // 提交更新
        this.updateMenu(this.code).then(res => {
          const { code, data, msg } = res.body;
          if (code === 1) {
            this.$message({
              message: msg,
              type: 'success',
              duration: 1200
            });
            this.code = stringify(data.menu, { space: '  '})
            this.editBtnStatus = true; // 提交成功后按钮恢复编辑状态!
            this.setEditorMode('read'); // 提交成功后变为只读模式
          } else {
            this.$message({
              showClose: true,
              message: msg,
              type: 'error'
            });
          }
          this.isShowEditor = true;
        });
      }
    },
    deleteMenu() {  // 删除菜单
      this.$confirm('此操作将删除公众号菜单, 是否继续?', '提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '再想一下',
        type: 'warning'
      }).then(() => {
        this.editBtnStatus = true;
        this.isShowEditor = false;
        this.code = '';
        this.$http.post(Apis.deleteMenu).then(res => {
          const { code, data, msg } = res.body;
          if (code === 1) {
            this.$message({
              message: msg,
              type: 'success',
              duration: 1200
            });
          } else {
            this.$message({
              showClose: true,
              message: msg,
              type: 'error'
            });
          }
        });
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '已取消删除'
        // });          
      });
    },
    formateCode() {
      let formatedCode = ''
      try{
        formatedCode = JSON.parse(this.code);
      } catch(e) {
        this.$message.error('配置格式化失败!')
        return;
      }
      this.code = stringify(formatedCode, { space: '  '});
    },
    cancelEdit() {
      this.editBtnStatus = true;
      this.setEditorMode('read');
    },



    // ==========
    getMenuData() { // 获取菜单数据
      return new Promise((resolve, reject) => {
        this.$http.get(Apis.getMenu).then(res => {
          resolve(res);
        });
      });
    },
    updateMenu(data) {  // 更新菜单
      return new Promise((resolve, reject) => {
        try {
          data = JSON.stringify({ menu: JSON.parse(data) })
        } catch (e) {
          if (e instanceof SyntaxError) {
            this.$message.error('JSON格式有误!');
          } else {
            this.$message.error('配置错误!');
          }
          return;
        }
        this.$http.post(Apis.createMenu, data).then(res => {
          resolve(res);
        });
      });
    },
    setEditorMode(mode, isShowMsg) {
      // 设置编辑器模式
      let modeText = '';
      if (mode === 'read') {
        modeText = '只读';
        this.cmOptions.readOnly = true;
      } else if (mode === 'write') {
        modeText = '可编辑';
        this.cmOptions.readOnly = false;
      }

      if (isShowMsg) {
        // this.$notify({
        //   title: `编辑器已进入${modeText}模式`,
        //   message: '',
        //   type: 'success',
        //   duration: 2000
        // });
      }
    }
  }
};
</script>

<style lang="less">
@border-gray-color: #d9dadc;

.doc-box{
  margin-bottom: 20px;
  font-size: 14px;
  background: #EEE;
  padding: 10px;
  border: 1px solid @border-gray-color;
  .lines{
    text-indent: -20px;
    padding-left: 20px;
    box-sizing: border-box;
    margin: 0;
  }
}

.CodeMirror {
  min-height: 260px;
  height: auto;
  transition: all 0.4s;
}
.code-box {
  margin-top: 20px;
  .mode-line{
    padding: 5px 0;
    font-size: 13px;
    color: #a9a9a9;
    font-weight: 700;
    .text-active{
      color: #309200;
    }
  }
}
</style>

