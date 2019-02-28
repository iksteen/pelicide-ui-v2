<script>
import CodeMirrorBase from '../codemirror-base'
import 'codemirror/mode/markdown/markdown'

export default {
  extends: CodeMirrorBase,
  methods: {
    editorOptions () {
      return {
        mode: 'markdown'
      }
    }
  }
}
</script>
