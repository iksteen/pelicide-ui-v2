import Vue from 'vue'
import Vuetify from 'vuetify/lib'

import Fullscreen from './fullscreen'
import App from './app.vue'
import router from './router'
import store from './store'

import './assets/stylus/main.styl'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'

Vue.use(Vuetify, {
  iconfont: 'mdi'
})
Vue.use(Fullscreen)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
