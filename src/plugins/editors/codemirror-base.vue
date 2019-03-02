<template>
  <div>
    <resize-observer class="observer" @notify="onResize" />
    <codemirror ref="cm" :options="cmOptions" @ready="cmReady" />
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
  components: {
    ResizeObserver,
    codemirror
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
    },
    onResize () {
      this.cm && this.cm.refresh()
    }
  }
}
</script>
