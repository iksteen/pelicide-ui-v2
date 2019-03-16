import Vue from 'vue'
import Vuex from 'vuex'
import {
  SET_MESSAGE,
  SET_NAVIGATION_VISIBLE,
  SET_PREVIEW_VISIBLE,
  SET_TOOLBAR_STYLE,
  SET_DARK_MODE,
  SET_SITES,
  SET_EDITOR_ITEM,
  SET_EDITOR_CONTENT,
  SET_EDITOR_SCROLL_FRACTION,
  SET_AUTHOR_NAME
} from './mutation-types'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    message: null,
    navigationVisible: true,
    previewVisible: true,
    toolbarStyle: localStorage.getItem('toolbar-style') || 'dense',
    darkMode: JSON.parse(localStorage.getItem('dark-mode') || 'false'),
    sites: [],
    editorItem: null,
    editorContent: null,
    editorScrollFraction: 0.0,
    author: localStorage.getItem('author-name') || ''
  },
  getters: {
    sitesById (state) {
      return state.sites.reduce((acc, site) => {
        acc[site.siteId] = site
        return acc
      }, {})
    }
  },
  mutations: {
    [SET_MESSAGE] (state, value) {
      state.message = value
    },
    [SET_NAVIGATION_VISIBLE] (state, value) {
      state.navigationVisible = value
    },
    [SET_PREVIEW_VISIBLE] (state, value) {
      state.previewVisible = value
    },
    [SET_TOOLBAR_STYLE] (state, value) {
      state.toolbarStyle = value
    },
    [SET_DARK_MODE] (state, value) {
      state.darkMode = value
    },
    [SET_SITES] (state, value) {
      state.sites = value
    },
    [SET_EDITOR_ITEM] (state, value) {
      state.editorItem = value
    },
    [SET_EDITOR_CONTENT] (state, value) {
      state.editorContent = value
    },
    [SET_EDITOR_SCROLL_FRACTION] (state, value) {
      state.editorScrollFraction = value
    },
    [SET_AUTHOR_NAME] (state, value) {
      state.authorName = value
    }
  },
  actions: {
    setMessage ({ commit }, value) {
      commit(SET_MESSAGE, value)
    },
    setError ({ commit }, error) {
      commit(SET_MESSAGE, { color: 'error', ...error })
    },
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
    setDarkMode ({ commit }, value) {
      localStorage.setItem('dark-mode', JSON.stringify(value))
      commit(SET_DARK_MODE, value)
    },
    setSites ({ commit, getters, state }, value) {
      commit(SET_SITES, value)
    },
    setEditorItem ({ commit }, value) {
      commit(SET_EDITOR_ITEM, value)
    },
    setEditorContent ({ commit }, value) {
      commit(SET_EDITOR_CONTENT, value)
    },
    setEditorScrollFraction ({ commit }, value) {
      commit(SET_EDITOR_SCROLL_FRACTION, value)
    },
    setAuthorName ({ commit }, value) {
      localStorage.setItem('author-name', value)
      commit(SET_AUTHOR_NAME, value)
    }
  }
})
