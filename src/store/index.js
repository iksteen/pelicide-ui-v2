import Vue from 'vue'
import Vuex from 'vuex'
import {
  SET_NAVIGATION_VISIBLE,
  SET_PREVIEW_VISIBLE
} from './mutation-types'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    navigationVisible: true,
    previewVisible: true
  },
  mutations: {
    [SET_NAVIGATION_VISIBLE] (state, value) {
      state.navigationVisible = value
    },
    [SET_PREVIEW_VISIBLE] (state, value) {
      state.previewVisible = value
    }
  },
  actions: {
    setNavigationVisible ({ commit }, value) {
      commit(SET_NAVIGATION_VISIBLE, value)
    },
    setPreviewVisible ({ commit }, value) {
      commit(SET_PREVIEW_VISIBLE, value)
    }
  }
})
