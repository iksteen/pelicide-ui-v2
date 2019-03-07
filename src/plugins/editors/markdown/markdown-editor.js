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
    },
    bold () {
      this.surroundSelection('**').focus()
    },
    italic () {
      this.surroundSelection('_').focus()
    },
    strikethrough () {
      this.surroundSelection('<s>', '</s>').focus()
    },
    header () {
      this.replaceInLines(
        /^(#+)\s?/,
        match => match
          ? [
            match[1].length < 6 ? '#'.repeat(match[1].length + 1) + ' ' : '',
            match.index,
            match[0].length
          ]
          : ['# ']
      ).focus()
    },
    link () {
      const selection = this.getSelection()
      if (!selection) {
        this.surroundSelection('[](https://)', '', 11)
      } else if (/^\w+:\/\/|^mailto:/.test(selection)) {
        this.surroundSelection('[](', ')', selection.length + 3)
      } else {
        this.surroundSelection('[', '](https://)', 1)
      }
      this.focus()
    },
    image () {
      const selection = this.getSelection()
      if (!selection) {
        this.surroundSelection('![]()', '', 3)
      } else if (/^\w+:\/\//.test(selection)) {
        this.surroundSelection('![](', ')', selection.length + 3)
      } else {
        this.surroundSelection('![', ']()', 1)
      }
      this.focus()
    },
    ulist () {
      this.replaceInLines(
        /^\s*[*+-]\s/,
        match => match ? ['', 0, match[0].length] : ['* '],
        !!this.getSelection()
      ).focus()
    }
  }
}
