<template>
  <panel class="editor">
    <template v-slot:toolbar>
      <panel-toolbar-toggle
        :value="navigationVisible"
        icon="mdi-file-tree"
        tooltip="Toggle navigation panel"
        @change="setNavigationVisible"
      />

      <perfect-scrollbar>
        <v-toolbar-items>
          <panel-toolbar-toggle
            v-model="$fs.fullscreen"
            icon="mdi-fullscreen"
            tooltip="Toggle focus mode"
          />

          <panel-toolbar-divider />

          <panel-toolbar-button
            icon="mdi-content-save"
            :disabled="!changed"
            tooltip="Save"
            @click="save"
          />

          <panel-toolbar-button
            icon="mdi-wrench"
            tooltip="Render page"
            :disabled="!editorItem || editorItem.anchor !== 'content' || building"
            @click="build"
          />

          <panel-toolbar-divider
            v-if="editorToolbar"
          />
          <component
            :is="editorToolbar"
          />
        </v-toolbar-items>
      </perfect-scrollbar>

      <v-spacer />

      <panel-toolbar-toggle
        :value="darkMode"
        icon="mdi-theme-light-dark"
        tooltip="Toggle dark mode"
        @change="setDarkMode"
      />
      <panel-toolbar-button
        icon="mdi-settings"
        tooltip="Toggle toolbar size"
        @click="changeToolbarStyle"
      />
      <panel-toolbar-button
        class="hidden-md-and-up"
        icon="mdi-eye-outline"
        tooltip="Show preview"
        @click="setPreviewVisible(true)"
      />
      <panel-toolbar-toggle
        :value="previewVisible"
        class="hidden-sm-and-down"
        icon="mdi-eye-outline"
        tooltip="Toggle preview panel"
        @change="setPreviewVisible"
      />
    </template>

    <div class="alert">
      <v-alert
        v-model="error"
        dismissible
        type="error"
      >
        {{ errorMessage }}
      </v-alert>
    </div>

    <component
      :is="editorComponent"
      ref="editor"
      :value="editorContent"
      @input="setEditorContent"
    />
  </panel>
</template>

<style lang="stylus" scoped>
  @import "../assets/stylus/_variables.styl"

  .editor
    background-color $editor-background-color
    color $editor-color

  .alert
    position absolute
    width 90%
    margin 0 5% 0 5%
    z-index 2147483647
</style>

<script>
  import Panel from './panel'
  import PanelToolbarButton from './panel-toolbar-button'
  import PanelToolbarToggle from './panel-toolbar-toggle'
  import PanelToolbarDivider from './panel-toolbar-divider'
  import { mapActions, mapState } from 'vuex'

  export default {
    components: {
      Panel,
      PanelToolbarButton,
      PanelToolbarToggle,
      PanelToolbarDivider
    },
    data () {
      return {
        originalContent: null,
        errorMessage: null,
        editorComponent: null,
        editorToolbar: null,
        building: false
      }
    },
    computed: {
      changed () {
        return this.editorContent !== this.originalContent
      },
      error: {
        get () {
          return this.errorMessage !== null
        },
        set (val) {
          this.errorMessage = val || null
        }
      },
      ...mapState([
        'navigationVisible',
        'previewVisible',
        'toolbarStyle',
        'darkMode',
        'editorItem',
        'editorContent'
      ])
    },
    watch: {
      editorComponent (newComponent, oldComponent) {
        if (newComponent !== oldComponent) {
          this.editorToolbar = null
        }

        this.setEditorContent(null)
        this.originalContent = null
        this.error = null
      }
    },
    mounted () {
      this.$pelicide.$on('open-in-editor', this.open)
      if (this.editorItem) {
        this.open(this.editorItem)
      }
    },
    destroyed () {
      this.$pelicide.$off('open-in-editor', this.open)
    },
    methods: {
      getEditorComponent () {
        return this.$refs.editor
      },
      setEditorToolbar (toolbar) {
        this.editorToolbar = toolbar
      },
      changeToolbarStyle () {
        this.setToolbarStyle({
          'normal': 'small',
          'small': 'tiny'
        }[this.toolbarStyle] || 'normal')
      },
      open (item) {
        this.setEditorItem(null)
        this.editorComponent = null

        if (item === null) {
          return
        }

        const editor = this.$pelicide.editors[item.mimetype]
        if (editor === undefined) {
          this.error = `Could not find editor for ${item.mimetype}.`
          return
        }

        this.editorComponent = editor.component

        if (this.editorComponent) {
          this.setEditorItem(item).then(() => {
            Promise.all([
              this.$api.getFileContent(
                item.siteId,
                item.anchor,
                item.path,
                item.name
              ),
              this.$nextTick()
            ])
              .then(([{ content }]) => {
                if (this.editorItem === item) {
                  this.originalContent = content
                  this.setEditorContent(content)
                }
              })
              .catch(({ message }) => {
                this.error = `Failed to load ${item.name}: ${message}.`
              })
          })
        }
      },
      save () {
        if (!this.changed || !this.editorItem) {
          return
        }
        const { siteId, anchor, path, name } = this.editorItem
        const content = this.editorContent
        this.$api.putFileContent(
          siteId,
          anchor,
          path,
          name,
          content
        )
          .then(() => {
            this.originalContent = content
          })
          .catch(({ message }) => {
            this.error = `Failed to save ${name}: ${message}`
          })
      },
      build () {
        const { editorItem: item } = this
        this.building = true
        this.$api.build(item.siteId, [[item.path, item.name]])
          .then(() => this.$pelicide.$emit('preview-render-reload'))
          .catch(e => this.setMessage({ color: 'error', text: `Failed to build page: ${e.message}.` }))
          .then(() => { this.building = false })
      },
      ...mapActions([
        'setMessage',
        'setNavigationVisible',
        'setPreviewVisible',
        'setToolbarStyle',
        'setDarkMode',
        'setEditorItem',
        'setEditorContent',
        'setEditorScrollFraction'
      ])
    },
    provide () {
      return {
        getEditorComponent: this.getEditorComponent,
        setEditorToolbar: this.setEditorToolbar,
        setEditorScrollFraction: this.setEditorScrollFraction
      }
    }
  }
</script>
