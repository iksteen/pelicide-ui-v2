import Editor from './editor'

export default {
  install (vue) {
    vue.prototype.$pelicide.registerEditor(
      [
        'text/markdown',
        'text/x-markdown',
        'text/x-rmarkdown'
      ],
      'mdi-markdown',
      Editor
    )
  }
}
