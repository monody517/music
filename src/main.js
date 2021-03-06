import Vue from 'vue'
import App from './App'
import router from './router'
import Vuelazyload from 'vue-lazyload'
import store from './store'

Vue.config.productionTip = false

import 'common/stylus/index.styl'

Vue.use(Vuelazyload, {
  loading: require('@/common/image/default.png')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  router,
})