import 'codemirror/mode/markdown/markdown'
import CodeMirror from '../codemirror'
import Toolbar from './toolbar'

export default {
  extends: CodeMirror,
  inject: ['setEditorToolbar'],
  mounted () {
    this.setEditorToolbar(Toolbar)
  },
  destroyed () {
    this.setEditorToolbar(null)
  },
  methods: {
    editorOptions () {
      return {
        mode: 'markdown',
        indentUnit: 4
      }
    },
    keymap () {
      const { meta } = this.$pelicide
      return {
        [`${meta}-B`]: this.bold,
        [`${meta}-I`]: this.italic,
        [`${meta}-T`]: this.strikethrough,
        [`${meta}-H`]: this.heading,
        [`${meta}-L`]: this.link,
        [`${meta}-O`]: this.image,
        [`${meta}-U`]: this.ulist
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
    heading () {
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
