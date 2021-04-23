import "babel-polyfill";//es6转es5兼容IE
import "url-search-params-polyfill";//让ie兼容new URLSearchParams()
import "default-passive-events";
import Vue from 'vue'
import App from './App.vue'
import router from './router';
import store from './store';
import config from './assets/js/conf/config';
import util from './assets/js/utils';


Vue.config.productionTip = false;

Vue.prototype.$config=config;
Vue.prototype.$utils = util;

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app');
