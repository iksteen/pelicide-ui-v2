import Component from './markdown-editor'

export default {
  install (vue) {
    vue.prototype.$pelicide.registerEditor(Component)
  }
}
