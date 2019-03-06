import Component from './markdown-editor'

export default {
  install (vue) {
    vue.prototype.$pelicide.registerEditor(
      [
        'text/markdown',
        'text/x-markdown',
        'text/x-rmarkdown'
      ],
      'mdi-markdown',
      Component
    )
  }
}
