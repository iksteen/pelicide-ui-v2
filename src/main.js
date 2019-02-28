import Vue from 'vue'
import Vuetify from 'vuetify/lib'

import Fullscreen from './plugins/fullscreen'

import EditorRegistry from './plugins/editors'
import MarkdownEditor from './plugins/editors/markdown'

import App from './app.vue'
import router from './router'
import store from './store'

import 'vuetify/src/stylus/app.styl'
import './assets/stylus/main.styl'

import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'typeface-roboto-mono'
import '@mdi/font/css/materialdesignicons.css'

Vue.use(Vuetify, {
  iconfont: 'mdi'
})
Vue.use(Fullscreen)

// Register editor factory and editors
Vue.use(EditorRegistry)
Vue.use(MarkdownEditor)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
