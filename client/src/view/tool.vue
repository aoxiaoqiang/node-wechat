<template>
  <el-container>
    <el-main>
      <h4 class="text-center">{{ pageTitle }}</h4>
      <div class="op-box">
        <el-button type="primary" @click="getToken()">token获取</el-button>
      </div>
      <div class="op-box">
        <el-button type="primary" @click="getTags()">获取标签列表</el-button>
        <el-button type="success" @click="createTag()">创建标签</el-button>

         <template>
          <el-table :data="tags" style="width: 100%" v-show="tags.length > 0">
            <el-table-column prop="id" label="编号" width="50"></el-table-column>
            <el-table-column prop="name" label="标签名称"></el-table-column>
            <el-table-column prop="count" label="人数统计" width="100"></el-table-column>
            <el-table-column label="操作" width="200">
              <template slot-scope="scope">
                <el-button @click="updateTag(scope.row)" type="primary" size="mini">编辑</el-button>
                <el-button @click="deleteTag(scope.row)" type="danger" size="mini">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      
      </div>

      <div class="op-box">
        <el-button type="primary" @click="getUser()">获取用户</el-button>
        <template>
          <el-select v-model="selOpenId" placeholder="请选择用户 openid" @change="getUserInfo(selOpenId)" v-show="openids.length > 0">
            <el-option v-for="item in openids" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </template>

        <el-row class="cards-box">
          <el-col :span="6">
            <el-card class="card" :body-style="{ padding: '0px', position: 'absolute', height: '100%', width: '100%' }" v-if="currentUser">
              <div class="card-cont">
                <div class="head-img">
                  <img :src="currentUser.headimgurl" class="image">
                </div>
                <div class="info-box">
                  <span>{{ currentUser.nickname }}</span>
                  <div class="bottom clearfix">
                    <time class="time">{{ currentUser.subscribe_time | time }}</time>
                    <div class="time">{{ currentUser.country + ' ' + currentUser.province + '/' + currentUser.city }}</div>
                    <div class="time">{{ currentUser.country + ' ' + currentUser.province + '/' + currentUser.city }}</div>
                    <div class="time">{{ currentUser.country + ' ' + currentUser.province + '/' + currentUser.city }}</div>
                    <div class="time">{{ currentUser.country + ' ' + currentUser.province + '/' + currentUser.city }}</div>
                    <div class="time">{{ currentUser.country + ' ' + currentUser.province + '/' + currentUser.city }}</div>
                    <div class="time">{{ currentUser.country + ' ' + currentUser.province + '/' + currentUser.city }}</div>
                    <div class="time">{{ currentUser.country + ' ' + currentUser.province + '/' + currentUser.city }}</div>
                    <div class="time">{{ currentUser.country + ' ' + currentUser.province + '/' + currentUser.city }}</div>
                    <div class="time">{{ currentUser.country + ' ' + currentUser.province + '/' + currentUser.city }}</div>
                    <div class="time">{{ currentUser.country + ' ' + currentUser.province + '/' + currentUser.city }}</div>
                    <div class="time">{{ currentUser.country + ' ' + currentUser.province + '/' + currentUser.city }}</div>
                    <div class="time">{{ currentUser.sex === 0 ? '未知':(currentUser.sex === 1 ? '男':'女') }}</div>
                    <el-button type="text" class="button">操作按钮</el-button>
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <div class="result-box">
        <codemirror v-model="code" :options="cmOptions" @ready="onCmReady"></codemirror>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import { codemirror } from 'vue-codemirror';
import stringify from 'json-stable-stringify';
import Apis from '../config/api';

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';

// language
import 'codemirror/mode/javascript/javascript.js';
export default {
  name: 'start',
  data() {
    return {
      pageTitle: '接口调试',
      code: '{code}',
      cmOptions: {
        tabSize: 6,
        mode: {
          name: 'javascript',
          json: true
        },
        theme: 'material',
        lineNumbers: true,
        line: true,
        // maxHighlightLength: 200,
        readOnly: true,
        autofocus: false
      },

      tags: [],
      openids: [],
      selOpenId: '',
      currentUser: null
    };
  },
  components: {
    codemirror
  },
  methods: {
    onCmReady() {
      // 初始化
      // this.getMenu();
    },
    getToken() {
      this.$http.get(Apis.getToken).then(res => {
        this.code = stringify(res.body, { space: '  ' });
      });
    },
    getTags() {
      this.$http.post(Apis.getTag).then(res => {
        this.tags = res.body.data.wxRes.tags;
        this.code = stringify(res.body, { space: '  ' });
      });
    },
    createTag() {
      this.$prompt('(Please input tag name)', 'Create user tag', {
        confirmButtonText: 'Comfirm',
        cancelButtonText: 'Cancel'
      })
        .then(({ value }) => {
          const data = {
            tag: value
          };
          this.$http.post(Apis.createTag, data).then(res => {
            this.code = stringify(res.body, { space: '  ' });
            if (res.body.code === 1) {
              this.getTags();
              this.$message({
                message: 'Create success',
                type: 'success'
              });
            } else {
              this.$message.error('error');
            }
          });
        })
        .catch(() => {
          console.log('Cancel input');
        });
    },
    updateTag(row) {
      const { id, name } = row;
      this.$prompt('(Please input tag name)', 'Update user tag', {
        confirmButtonText: 'Comfirm',
        cancelButtonText: 'Cancel',
        inputValue: name
      })
        .then(({ value }) => {
          const data = {
            tag: {
              name: value,
              id
            }
          };
          this.$http.post(Apis.updateTag, JSON.stringify(data)).then(res => {
            this.code = stringify(res.body, { space: '  ' });
            if (res.body.code === 1) {
              this.getTags();
              this.$message({
                message: 'Update success',
                type: 'success'
              });
            }
          });
        })
        .catch(() => {
          console.log('Cancel input');
        });
    },
    deleteTag(row) {
      const { id } = row;
      const data = JSON.stringify({ tag: { id } });
      this.$confirm('确认删除？')
        .then(_ => {
          this.$http.post(Apis.deleteTag, data).then(res => {
            this.code = stringify(res.body, { space: '  ' });
            if (res.body.code === 1) {
              this.getTags();
              this.$message({
                message: 'delete success',
                type: 'success'
              });
            } else {
              this.$message.error('error');
            }
          });
        })
        .catch(_ => {});
    },
    getUser() {
      this.$http.get(Apis.getUser).then(res => {
        if (res.body.code === 1) {
          this.$message({
            message: 'get success',
            type: 'success'
          });
          this.openids = res.body.data.wxRes.data.openid
          this.code = stringify(res.body, { space: '  ' });
        } else {
          this.$message.error('error');
        }
      });
    },
    getUserInfo(id) {
      console.log(id)
      const url = `${Apis.getUserInfo}?openid=${id}&lang=${'zh_CN'}`
      this.$http.get(url).then(res => {
        if (res.body.code === 1) {
          this.$message({
            message: 'get success',
            type: 'success'
          });
          this.currentUser = res.body.data.wxRes;
          this.code = stringify(res.body, { space: '  ' });
        } else {
          this.$message.error('error');
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
@border-gray-color: #d9dadc;
.result-box {
  margin-top: 20px;
}
.op-box {
  padding: 20px 0;
  border-bottom: 1px solid #f7f7f7;
}

.CodeMirror {
  min-height: 300px;
  height: auto !important;
  transition: all 0.4s;
}

.cards-box{
  margin-top: 20px;
}
.card{
  width: 100%;
  padding-bottom: 100%;
  position: relative;
  perspective: 500px;
  overflow: visible;
  &:hover{
    .card-cont{
      transform: translateX(-100%) rotateY(-180deg);
    }
  }
  .card-cont{
    width: 100%;
    height: 100%;
    position: relative;
    transform-style: preserve-3d;
    transition: transform .8s;
    transform-origin: right center;
    cursor: pointer;
    .head-img,
    .info-box{
      display: block;
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;
      backface-visibility: hidden;
    }
  }

  .head-img{
    transform: rotateY( 180deg );
    .image {
      display: block;
      width: 100%;
    }
  }
  .info-box{
    box-sizing: border-box;
    padding: 14px;
    background: rgba(255, 255, 255, 1);
    border-radius: 0;
    overflow: scroll;
    .time {
      font-size: 13px;
      color: #999;
    }
    .bottom {
      line-height: 26px;
    }

    .button {
      padding-top: 13px;
      padding: 0;
      float: right;
    }

    

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }
    
    .clearfix:after {
        clear: both
    }
  }

}
</style>
