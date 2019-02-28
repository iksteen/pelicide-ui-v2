<template>
  <panel class="editor">
    <template v-slot:toolbar>
      <panel-toolbar-toggle
        v-model="navigationVisible"
        icon="mdi-file-tree" />
      <panel-toolbar-toggle
        v-model="fullscreen"
        icon="mdi-fullscreen" />
      <panel-toolbar-divider />
      <panel-toolbar-button
        icon="mdi-content-save" />
      <panel-toolbar-button
        icon="mdi-wrench" />
      <v-spacer />
      <panel-toolbar-button
        icon="mdi-settings" />
      <panel-toolbar-toggle
        v-model="previewVisible"
        icon="mdi-television" />
    </template>

    <div class="fill-height" style="padding-bottom: 32px">
      <component v-bind:is="editorComponent"></component>
    </div>
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
      editorComponent: this.$pelicide.editors[0]
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
    },
    fullscreen: {
      get () {
        return this.$store.state.isFullscreen
      },
      set (value) {
        if (value) {
          this.$fullscreen.enterFullscreen()
        } else {
          this.$fullscreen.exitFullscreen()
        }
      }
    }
  },
  methods: {
    ...mapActions([
      'setNavigationVisible',
      'setPreviewVisible'
    ])
  }
}
</script>
