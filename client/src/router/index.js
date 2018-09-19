import Vue from 'vue';
import Router from 'vue-router';
// import Links from '@/components/Links';

import home from '../view/home';
import start from '../view/start';
import menu from '../view/menu';
import about from '../view/about';
import message from '../view/message';
import tool from '../view/tool';

Vue.use(Router);

export default new Router({
  routes: [{
    path: '/',
    redirect: '/home/start'
  },{
    path: '/home',
    name: 'home',
    component: home,
    children: [{
      path: '/home/start',
      component: start,
    }, {
      path: '/home/menu',
      component: menu,
    }, {
      path: '/home/about',
      component: about,
    }, {
      path: '/home/message',
      component: message,
      },{
        path: '/home/tool',
        component: tool,
      }]
  }, {
    path: '/start',
    component: start,
  }, {
    path: '/menu',
    component: menu,
  }, {
    path: '/about',
    component: about,
  }, {
    path: '/message',
    component: message,
  }],
});
