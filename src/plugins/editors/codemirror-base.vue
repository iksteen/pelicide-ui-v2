<template>
  <codemirror ref="cm" :options="cmOptions" @ready="cmReady" v-resize="onResize" />
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

<script>
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import { mapState } from 'vuex'

export default {
  components: {
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
  computed: {
    ...mapState([
      'previewVisible'
    ])
  },
  watch: {
    previewVisible () {
      this.onResize()
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
