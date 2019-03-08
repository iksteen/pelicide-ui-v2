<template>
  <panel class="preview">
    <template v-slot:toolbar>
      <panel-toolbar-button
        class="hidden-md-and-up"
        icon="mdi-pencil"
        @click="setPreviewVisible(false)"
      />

      <panel-toolbar-options
        v-model="mode"
        :options="modes"
      />

      <v-toolbar-items v-show="mode === 'render'">
        <panel-toolbar-divider />

        <panel-toolbar-button
          icon="mdi-refresh"
          tooltip="Refresh page"
        />

        <panel-toolbar-button
          icon="mdi-open-in-new"
          tooltip="Open in new window"
        />
      </v-toolbar-items>
    </template>
    <div
      ref="draftContainer"
      class="draft__container"
    >
      <div
        class="draft__content"
        v-html="draft"
      />
    </div>
  </panel>
</template>

<style lang="stylus" scoped>
  .draft__container
    overflow-y auto

  .draft__content
    margin 1em 1.5em
    font-size 16px

    // Reset margins that vuetify strips. Let me know if I missed anything.
    >>>p, >>>pre, >>>ul, >>>ol, >>>blockquote
      margin 1em 0

    >>>h1, >>>h2, >>>h3, >>>h4, >>>h5, >>>h6
      margin 0.83em 0

    >>>code, >>>kbd
      color inherit
      background inherit
      box-shadow none;
      border-radius 0
      font-weight normal
      &:before
        content ""
      &:after
        content ""

    >>>pre, >>>code, >>>kbd
      font-family "Roboto Mono", monospace

    >>>pre
      overflow-x auto
</style>

<script>
  import Panel from './panel'
  import PanelToolbarButton from './panel-toolbar-button'
  import PanelToolbarDivider from './panel-toolbar-divider'
  import PanelToolbarOptions from './panel-toolbar-options'
  import { mapActions, mapGetters, mapState } from 'vuex'
  import throttle from 'lodash/throttle'

  export default {
    components: {
      Panel,
      PanelToolbarButton,
      PanelToolbarDivider,
      PanelToolbarOptions
    },
    data () {
      return {
        mode: 'draft',
        modes: [
          {
            value: 'draft',
            label: 'Draft',
            tooltip: 'Switch to draft preview'
          },
          {
            value: 'render',
            label: 'Render',
            tooltip: 'Switch to render preview'
          }
        ],
        draft: null
      }
    },
    computed: {
      ...mapState([
        'editorItem',
        'editorContent',
        'editorScrollFraction'
      ]),
      ...mapGetters([
        'sitesById'
      ])
    },
    watch: {
      sites () {
        this.renderDraft()
      },
      editorItem () {
        this.renderDraft()
      },
      editorContent () {
        this.renderDraft().then(() => this.syncScrollPosition())
      },
      editorScrollFraction (f) {
        this.syncScrollPosition()
      }
    },
    mounted () {
      this.renderDraft().then(() => this.syncScrollPosition())
    },
    methods: {
      renderDraft: throttle(function () {
        const { editorItem: item, editorContent: content } = this

        if (!item || !content) {
          this.draft = null
          return Promise.resolve(null)
        }

        const { name, siteId } = item
        const extension = name.split('.').pop()
        const site = this.sitesById[siteId]

        if (!site.formats.includes(extension)) {
          this.draft = '<i>No renderer is available for this format.</i>'
          return Promise.resolve(null)
        }

        return this.$api.render(siteId, extension, content)
          .then(
            ({ content }) => {
              this.draft = content
            }
          )
          .catch((e) => {
            this.draft = `<i style="color: red">An error occurred while rendering the preview.</i>`
          })
      }, 250),
      syncScrollPosition () {
        const { draftContainer: el } = this.$refs
        const { editorScrollFraction: f } = this
        if (!el) {
          return
        }

        el.scrollTop = f * (el.scrollHeight - el.clientHeight)
      },
      ...mapActions([
        'setPreviewVisible'
      ])
    }
  }
</script>
