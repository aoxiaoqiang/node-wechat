// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueResource from 'vue-resource';
import Element from 'element-ui'
import App from './App';
import router from './router';

import 'element-ui/lib/theme-chalk/index.css';
import '@/style/style.less';

Vue.config.productionTip = false;

Vue.use(VueResource);
Vue.http.options.emulateHTTP = true;
Vue.http.options.emulateJSON = true;

Vue.use(Element, { size: 'small' })

Vue.filter('time', function (value) {
  return new Date(parseInt(value) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
});
