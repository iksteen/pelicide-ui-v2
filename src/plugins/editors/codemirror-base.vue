<template>
  <div>
    <resize-observer
      class="observer"
      @notify="resize"
    />
    <codemirror
      ref="cm"
      :value="value || ''"
      :options="cmOptions"
      @ready="cmReady"
      @input="cmInput"
    />
  </div>
</template>

<style lang="stylus">
  @import './codemirror-theme.styl'

  .vue-codemirror
    @extend .cm-s-pelicide-background

  .CodeMirror
    position absolute
    height 100%
    width 100%
</style>

<style lang="stylus" scoped>
  observer
    position relative
</style>

<script>
  import 'vue-resize/dist/vue-resize.css'
  import { ResizeObserver } from 'vue-resize'
  import { codemirror } from 'vue-codemirror'
  import 'codemirror/lib/codemirror.css'

  export default {
    inject: ['setEditorScrollFraction'],
    components: {
      ResizeObserver,
      codemirror
    },
    props: {
      value: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        cmOptions: {
          theme: 'pelicide',
          lineWrapping: true,
          extraKeys: {
            ...this.keymap()
          },
          ...this.editorOptions()
        },
        cm: null
      }
    },
    methods: {
      editorOptions () {
        return {}
      },
      keymap () {
        return {}
      },
      cmReady (cm) {
        this.cm = cm
        const el = cm.getScrollerElement()
        el.addEventListener('scroll', this.cmScroll)
        this.cmScroll({ target: el })
      },
      cmInput (value) {
        this.$emit('input', value)
      },
      cmScroll (event) {
        const { target: { scrollTop, scrollHeight, clientHeight } } = event
        const f = scrollTop / (scrollHeight - clientHeight)
        this.setEditorScrollFraction(f)
      },
      resize () {
        this.cm && this.cm.refresh()
      },
      focus () {
        this.cm && this.cm.focus()
      },
      getSelection () {
        return this.cm.getDoc().getSelection()
      },
      replaceInLines (search, replace, skipEmpty = true) {
        const doc = this.cm.getDoc()

        function replaceInLine (lineNo) {
          const line = doc.getLine(lineNo)
          if (!line && skipEmpty) {
            return
          }

          const [ value, start, end ] = replace(search.exec(line), line)
          if (value !== null) {
            doc.replaceRange(
              value,
              { line: lineNo, ch: start || 0 },
              { line: lineNo, ch: end || 0 }
            )
          }
        }

        const from = doc.getCursor('from').line
        const to = doc.getCursor('to').line

        for (let i = from; i <= to; ++i) {
          replaceInLine(i)
        }

        return this
      },
      surroundSelection (prefix, suffix = null, offset = null) {
        if (suffix === null) {
          suffix = prefix
        }

        if (offset === null) {
          offset = suffix.length
        }

        const doc = this.cm.getDoc()
        doc.replaceSelection(prefix + doc.getSelection() + suffix)

        const cursor = doc.getCursor()
        cursor.ch -= offset
        doc.setCursor(cursor)

        return this
      }
    }
  }
</script>
