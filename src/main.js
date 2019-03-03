import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import PerfectScrollbar from 'vue2-perfect-scrollbar'

import Fullscreen from './plugins/fullscreen'

import EditorRegistry from './plugins/editors'
import MarkdownEditor from './plugins/editors/markdown'

import App from './app.vue'
import router from './router'
import store from './store'
import Api from './api'

import 'vuetify/src/stylus/app.styl'
import './assets/stylus/main.styl'

import 'vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'typeface-roboto-mono'
import '@mdi/font/css/materialdesignicons.css'

Vue.use(Vuetify, {
  iconfont: 'mdi'
})
Vue.use(PerfectScrollbar)
Vue.use(Fullscreen)

// Register editor factory and editors
Vue.use(EditorRegistry)
Vue.use(MarkdownEditor)

// Connect websocket
Vue.use(Api, { store })

Vue.config.productionTip = false

const app = new Vue({
  router,
  store,
  render: h => h(App)
})
app.$store.dispatch(
  'setPreviewVisible',
  app.$vuetify.breakpoint.mdAndUp
)
app.$mount('#app')
