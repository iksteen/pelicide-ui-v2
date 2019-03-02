<template>
  <panel class="editor">
    <template v-slot:toolbar>
      <panel-toolbar-toggle
        v-model="navigationVisible"
        icon="mdi-file-tree" />
      <panel-toolbar-toggle
        v-model="$fs.fullscreen"
        icon="mdi-fullscreen" />

      <panel-toolbar-divider />

      <panel-toolbar-button
        icon="mdi-content-save" />
      <panel-toolbar-button
        icon="mdi-wrench" />

      <panel-toolbar-divider v-if="editorToolbar" />
      <component v-bind:is="editorToolbar" />

      <v-spacer />

      <panel-toolbar-button
        icon="mdi-settings" />
      <panel-toolbar-toggle
        v-model="previewVisible"
        icon="mdi-television" />
    </template>

    <component v-bind:is="editorComponent" />
  </panel>
</template>

<script>
import Panel from './panel'
import PanelToolbarButton from './panel-toolbar-button'
import PanelToolbarToggle from './panel-toolbar-toggle'
import PanelToolbarDivider from './panel-toolbar-divider'
import { mapActions } from 'vuex'

export default {
  components: {
    Panel,
    PanelToolbarButton,
    PanelToolbarToggle,
    PanelToolbarDivider
  },
  data () {
    return {
      editorComponent: this.$pelicide.editors[0],
      editorToolbar: null
    }
  },
  computed: {
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
    }
  },
  methods: {
    getEditorComponent () {
      return this.editorComponent
    },
    setEditorToolbar (toolbar) {
      this.editorToolbar = toolbar
    },
    ...mapActions([
      'setNavigationVisible',
      'setPreviewVisible'
    ])
  },
  watch: {
    editorComponent () {
      this.editorToolbar = null
    }
  },
  provide () {
    return {
      getEditorComponent: this.getEditorComponent,
      setEditorToolbar: this.setEditorToolbar
    }
  }
}
</script>
