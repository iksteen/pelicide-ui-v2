import Vue from 'vue'
import Vuex from 'vuex'
import {
  SET_NAVIGATION_VISIBLE,
  SET_PREVIEW_VISIBLE,
  SET_TOOLBAR_STYLE,
  SET_SITES,
  SET_CURRENT_SITE_ID,
  SET_SITE_FILES,
  SET_EDITOR_ITEM,
  SET_EDITOR_CONTENT
} from './mutation-types'

Vue.use(Vuex)

const EMPTY_FILES = { content: [], theme: [] }

export default new Vuex.Store({
  state: {
    navigationVisible: true,
    previewVisible: true,
    toolbarStyle: localStorage.getItem('toolbar-style') || 'dense',
    sites: [],
    currentSiteId: null,
    siteFiles: EMPTY_FILES,
    editorItem: null,
    editorContent: null
  },
  getters: {
    sitesById (state) {
      return state.sites.reduce((acc, site) => {
        acc[site.id] = site
        return acc
      }, {})
    },
    currentSite (state, getters) {
      return state.currentSiteId && getters.sitesById[state.currentSiteId]
    }
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
    },
    [SET_SITES] (state, value) {
      state.sites = value
    },
    [SET_CURRENT_SITE_ID] (state, value) {
      state.currentSiteId = value
      state.siteFiles = EMPTY_FILES
    },
    [SET_SITE_FILES] (state, value) {
      state.siteFiles = value
    },
    [SET_EDITOR_ITEM] (state, value) {
      state.editorItem = value
    },
    [SET_EDITOR_CONTENT] (state, value) {
      state.editorContent = value
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
    },
    setSites ({ commit, getters, state }, value) {
      commit(SET_SITES, value)
      if (getters.sitesById[state.currentSiteId] === undefined) {
        commit(SET_CURRENT_SITE_ID, null)
      }
    },
    setCurrentSiteId ({ commit }, value) {
      commit(SET_CURRENT_SITE_ID, value)
    },
    setSiteFiles ({ commit }, value) {
      commit(SET_SITE_FILES, value)
    },
    setEditorItem ({ commit }, value) {
      commit(SET_EDITOR_ITEM, value)
    },
    setEditorContent ({ commit }, value) {
      commit(SET_EDITOR_CONTENT, value)
    }
  }
})
