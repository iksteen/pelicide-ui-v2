import Vue from 'vue'
import Vuex from 'vuex'
import {
  SET_NAVIGATION_VISIBLE,
  SET_PREVIEW_VISIBLE,
  SET_TOOLBAR_STYLE
} from './mutation-types'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    navigationVisible: true,
    previewVisible: true,
    toolbarStyle: localStorage.getItem('toolbar-style') || 'normal'
  },
  mutations: {
    [SET_NAVIGATION_VISIBLE] (state, value) {
      state.navigationVisible = value
    },
    [SET_PREVIEW_VISIBLE] (state, value) {
      state.previewVisible = value
    },
    [SET_TOOLBAR_STYLE] (state, value) {
      state.toolbarStyle = value
    }
  },
  actions: {
    setNavigationVisible ({ commit }, value) {
      commit(SET_NAVIGATION_VISIBLE, value)
    },
    setPreviewVisible ({ commit }, value) {
      commit(SET_PREVIEW_VISIBLE, value)
    },
    setToolbarStyle ({ commit }, value) {
      localStorage.setItem('toolbar-style', value)
      commit(SET_TOOLBAR_STYLE, value)
    }
  }
})
