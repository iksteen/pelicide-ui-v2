<template>
  <div>
    <resize-observer
      class="observer"
      @notify="onResize"
    />
    <codemirror
      ref="cm"
      :value="value"
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
      },
      cmInput (value) {
        this.$emit('input', value)
      },
      onResize () {
        this.cm && this.cm.refresh()
      }
    }
  }
</script>
