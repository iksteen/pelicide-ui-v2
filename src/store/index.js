import Vue from 'vue'
import Vuex from 'vuex'
import {
  SET_NAVIGATION_VISIBLE,
  SET_PREVIEW_VISIBLE,
  SET_IS_FULLSCREEN
} from './mutation-types'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    navigationVisible: true,
    previewVisible: true,
    isFullscreen: false
  },
  mutations: {
    [SET_NAVIGATION_VISIBLE] (state, value) {
      state.navigationVisible = value
    },
    [SET_PREVIEW_VISIBLE] (state, value) {
      state.previewVisible = value
    },
    [SET_IS_FULLSCREEN] (state, value) {
      state.isFullscreen = value
    }
  },
  actions: {
    setNavigationVisible ({ commit }, value) {
      commit(SET_NAVIGATION_VISIBLE, value)
    },
    setPreviewVisible ({ commit }, value) {
      commit(SET_PREVIEW_VISIBLE, value)
    },
    setIsFullscreen ({ commit }, value) {
      commit(SET_IS_FULLSCREEN, value)
    }
  }
})
