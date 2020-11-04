import Vue from 'vue'
import App from './App'
import router from './router'
import Vuelazyload from 'vue-lazyload'

Vue.config.productionTip = false

import 'common/stylus/index.styl'

Vue.use(Vuelazyload, {
  loading: require('@/common/image/default.png')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App),
  router
})
