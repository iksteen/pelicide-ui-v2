<template>
  <div class="render__container">
    <div
      v-if="loading"
      class="render__loading"
    >
      <v-progress-circular
        class="render__loading"
        indeterminate
        :size="70"
        :width="7"
        color="#b36539"
      />
    </div>

    <iframe
      v-show="!frame"
      ref="iframe0"
      class="render__iframe"
    />
    <iframe
      v-show="frame"
      ref="iframe1"
      class="render__iframe"
    />
  </div>
</template>

<style lang="stylus" scoped>
  .render__container
    height 100%
    overflow hidden

  .render__loading
    position absolute
    height 100%
    width 100%
    display flex
    align-items center
    justify-content center

  .render__iframe
    height 100%
    width 100%
    border 0
    margin 0
    padding 0
</style>

<script>
  import { mapState } from 'vuex'

  export default {
    data () {
      return {
        frame: 0,
        loading: false
      }
    },
    computed: {
      nextFrame () {
        return (this.frame + 1) % 2
      },
      frameRef () {
        return this.$refs['iframe' + this.frame]
      },
      nextFrameRef () {
        return this.$refs['iframe' + this.nextFrame]
      },
      ...mapState([
        'editorItem'
      ])
    },
    watch: {
      editorItem () {
        this.loadPreview()
      },
      frameRef () {
        let prevDoc = null
        let doc = null
        try {
          prevDoc = this.nextFrameRef.contentDocument
          doc = this.frameRef.contentDocument
        } catch {
          // Cross-origin error.
        }
        if (!prevDoc || !doc || prevDoc.location.href !== doc.location.href) {
          return
        }

        const scrollTop = ['html', 'body'].map(tag => {
          const els = prevDoc.getElementsByTagName(tag)
          return els.length ? els[0].scrollTop : 0
        })

        this.$nextTick(() => {
          ['html', 'body'].forEach((tag, i) => {
            const els = doc.getElementsByTagName(tag)
            if (els.length) {
              els[0].scrollTop = scrollTop[i]
            }
          })
        })
      }
    },
    mounted () {
      this.$pelicide.$on('preview-render-reload', this.loadPreview)
      this.loadPreview()
    },
    destroyed () {
      this.$pelicide.$off('preview-render-reload', this.loadPreview)
    },
    methods: {
      swap () {
        this.nextFrameRef.removeEventListener('load', this.swap)
        this.loading = false
        this.frame = this.nextFrame
      },
      loadPreview () {
        const { editorItem: item } = this

        if (!this.loading) {
          this.loading = true
          this.nextFrameRef.addEventListener('load', this.swap)
        }

        if (!item || !item.url) {
          this.nextFrameRef.src = ''
        } else {
          this.nextFrameRef.src = item.url
        }
      }
    }
  }
</script>
