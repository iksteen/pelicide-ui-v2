<template>
  <panel class="editor">
    <template v-slot:toolbar>
      <panel-toolbar-toggle
        v-model="navigationVisible"
        icon="mdi-file-tree"
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

      <panel-toolbar-button
        icon="mdi-settings"
        @click="onChangeToolbarStyle"
      />
      <panel-toolbar-button
        class="hidden-md-and-up"
        icon="mdi-eye-outline"
        @click="setPreviewVisible(true)"
      />
      <panel-toolbar-toggle
        v-model="previewVisible"
        class="hidden-sm-and-down"
        icon="mdi-eye-outline"
      />
    </template>

    <div>
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
      v-model="content"
    />
  </panel>
</template>

<style lang="stylus" scoped>
  @import "../assets/stylus/_variables.styl"

  .editor
    background-color $editor-background-color
    color $editor-color
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
        content: null,
        originalContent: null,
        errorMessage: null,
        editorComponent: null,
        editorToolbar: null
      }
    },
    computed: {
      changed () {
        return this.content !== this.originalContent
      },
      error: {
        get () {
          return this.errorMessage !== null
        },
        set (val) {
          this.errorMessage = val || null
        }
      },
      navigationVisible: {
        get () {
          return this.$store.state.navigationVisible
        },
        set (value) {
          this.setNavigationVisible(value)
        }
      },
      previewVisible: {
        get () {
          return this.$store.state.previewVisible
        },
        set (value) {
          this.setPreviewVisible(value)
        }
      },
      ...mapState([
        'toolbarStyle',
        'editorItem'
      ])
    },
    watch: {
      editorComponent (newComponent, oldComponent) {
        if (newComponent !== oldComponent) {
          this.editorToolbar = null
        }

        this.content = this.originalContent = null
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
        return this.editorComponent
      },
      setEditorToolbar (toolbar) {
        this.editorToolbar = toolbar
      },
      onChangeToolbarStyle () {
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
                  this.content = this.originalContent = content
                }
              })
              .catch(({ message }) => {
                this.error = `Failed to load ${item.name}: ${message}.`
              })
          })
        }
      },
      ...mapActions([
        'setNavigationVisible',
        'setPreviewVisible',
        'setToolbarStyle',
        'setEditorItem'
      ])
    },
    provide () {
      return {
        getEditorComponent: this.getEditorComponent,
        setEditorToolbar: this.setEditorToolbar
      }
    }
  }
</script>
