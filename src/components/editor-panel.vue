<template>
  <panel class="editor">
    <template v-slot:toolbar>
      <panel-toolbar-toggle
        :value="navigationVisible"
        icon="mdi-file-tree"
        @input="setNavigationVisible"
      />

      <perfect-scrollbar>
        <v-toolbar-items>
          <panel-toolbar-toggle
            v-model="$fs.fullscreen"
            icon="mdi-fullscreen"
          />

          <panel-toolbar-divider />

          <panel-toolbar-button
            icon="mdi-content-save"
            :disabled="!changed"
            @click="save"
          />
          <panel-toolbar-button
            icon="mdi-wrench"
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
        @input="setDarkMode"
      />
      <panel-toolbar-button
        icon="mdi-settings"
        @click="changeToolbarStyle"
      />
      <panel-toolbar-button
        class="hidden-md-and-up"
        icon="mdi-eye-outline"
        @click="setPreviewVisible(true)"
      />
      <panel-toolbar-toggle
        :value="previewVisible"
        class="hidden-sm-and-down"
        icon="mdi-eye-outline"
        @input="setPreviewVisible"
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
        editorToolbar: null
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
      ...mapActions([
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
