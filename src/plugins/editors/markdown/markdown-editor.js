import CodeMirrorBase from '../codemirror-base'
import 'codemirror/mode/markdown/markdown'
import MarkdownToolbar from './markdown-toolbar'

export default {
  extends: CodeMirrorBase,
  inject: ['setEditorToolbar'],
  mounted () {
    this.setEditorToolbar(MarkdownToolbar)
  },
  methods: {
    editorOptions () {
      return {
        mode: 'markdown',
        indentUnit: 4
      }
    }
  }
}
