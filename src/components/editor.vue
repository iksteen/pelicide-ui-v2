<template>
  <panel class="editor">
    <template v-slot:toolbar>
      <panel-toolbar-toggle
        :value="navigationVisible"
        icon="mdi-file-tree"
        :tooltip="`Toggle navigation panel (${meta}-Shift-O)`"
        @change="setNavigationVisible"
      />

      <perfect-scrollbar>
        <v-toolbar-items>
          <panel-toolbar-toggle
            v-model="$fs.fullscreen"
            icon="mdi-fullscreen"
            :tooltip="`Toggle focus mode (${meta}-Enter)`"
          />

          <panel-toolbar-divider />

          <panel-toolbar-button
            icon="mdi-content-save"
            :disabled="!changed"
            :tooltip="`Save (${meta}-S)`"
            @click="save"
          />

          <panel-toolbar-button
            icon="mdi-wrench"
            :tooltip="`Save and build page (${meta}-E)`"
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
        :tooltip="`Show preview (${meta}-Shift-P)`"
        @click="setPreviewVisible(true)"
      />
      <panel-toolbar-toggle
        :value="previewVisible"
        class="hidden-sm-and-down"
        icon="mdi-eye-outline"
        :tooltip="`Toggle preview panel (${meta}-Shift-P)`"
        @change="setPreviewVisible"
      />
    </template>

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
</style>

<script>
  import Panel from './panel'
  import PanelToolbarButton from './panel/toolbar/button'
  import PanelToolbarToggle from './panel/toolbar/toggle'
  import PanelToolbarDivider from './panel/toolbar/divider'
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
        editorComponent: null,
        editorToolbar: null,
        building: false
      }
    },
    computed: {
      changed () {
        return this.editorContent !== this.originalContent
      },
      meta () {
        return this.$pelicide.meta
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
      }
    },
    mounted () {
      const meta = { Cmd: 'meta', Ctrl: 'ctrl' }[this.meta]
      this.$shortcut.add('save', [meta, 's'])
      this.$shortcut.add('build', [meta, 'e'])
      this.$shortcut.add('navigation', ['shift', meta, 'o'])
      this.$shortcut.add('preview', ['shift', meta, 'p'])
      this.$shortcut.add('focus', [meta, 'enter'])

      this.$pelicide.$on('editor-open', this.open)
      this.$pelicide.$on('editor-save', this._save)
      if (this.editorItem) {
        this.open(this.editorItem)
      }
    },
    destroyed () {
      const meta = { Cmd: 'meta', Ctrl: 'ctrl' }[this.meta]
      this.$shortcut.remove('save', [meta, 's'])
      this.$shortcut.remove('build', [meta, 'e'])
      this.$shortcut.remove('navigation', ['shift', meta, 'o'])
      this.$shortcut.remove('preview', ['shift', meta, 'p'])
      this.$shortcut.remove('focus', [meta, 'enter'])

      this.$pelicide.$off('editor-open', this.open)
      this.$pelicide.$off('editor-save', this._save)
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
          this.setError({ text: `Could not find editor for ${item.mimetype}.` })
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
                this.setError({ text: `Failed to load ${item.name}: ${message}.` })
              })
          })
        }
      },
      _save ({ resolve, reject }) {
        if (!this.changed || !this.editorItem) {
          resolve(null)
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
            resolve(null)
          })
          .catch(e => reject(e))
      },
      save () {
        new Promise((resolve, reject) => {
          this._save({ resolve, reject })
        })
          .catch(({ message }) => this.setError({ text: `Failed to save ${name}: ${message}` }))
      },
      build () {
        const { editorItem: item } = this
        this.building = true
        new Promise((resolve, reject) => {
          this._save({ resolve, reject })
        })
          .then(
            () => {
              this.$api.build(item.siteId, [[item.path, item.name]])
                .then(() => this.$pelicide.previewRenderReload())
                .catch(e => this.setError({ text: `Failed to build page: ${e.message}.` }))
                .then(() => { this.building = false })
            },
            ({ message }) => this.setError({ text: `Failed to save ${item.name}: ${message}` })
          )
      },
      ...mapActions([
        'setError',
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
    },
    shortcuts: {
      save (e) {
        e.preventDefault()
        this.save()
      },
      build (e) {
        e.preventDefault()
        this.build()
      },
      navigation (e) {
        e.preventDefault()
        this.setNavigationVisible(!this.navigationVisible)
      },
      preview (e) {
        e.preventDefault()
        this.setPreviewVisible(!this.previewVisible)
      },
      focus (e) {
        e.preventDefault()
        this.$fs.fullscreen = !this.$fs.fullscreen
      }
    }
  }
</script>
