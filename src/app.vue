<template>
  <v-app>
    <v-navigation-drawer app v-model="navigationVisible">
      <NavigationPanel />
    </v-navigation-drawer>

    <v-content>
      <v-container fluid pa-0 fill-height>
        <v-layout>
          <transition name="flexhide">
            <editor-panel
              v-show="editorVisible" />
          </transition>

          <transition name="flexhide">
            <preview-panel
              v-show="previewVisible"
              class="flex xs12 md6" />
          </transition>
        </v-layout>
      </v-container>
      <connecting-dialog :loading="!$api.ready" />
    </v-content>
  </v-app>
</template>

<script>
import NavigationPanel from './components/navigation-panel'
import EditorPanel from './components/editor-panel'
import PreviewPanel from './components/preview-panel'
import { mapActions, mapState } from 'vuex'
import ConnectingDialog from './components/loading-dialog'

export default {
  components: {
    ConnectingDialog,
    NavigationPanel,
    EditorPanel,
    PreviewPanel
  },
  data () {
    return {
      navigationVisibleBeforeFullscreen: this.navigationVisible
    }
  },
  watch: {
    '$fs.fullscreen' (value) {
      if (value) {
        this.navigationVisibleBeforeFullscreen = this.navigationVisible
        this.setNavigationVisible(false)
      } else {
        this.navigationVisible = this.navigationVisibleBeforeFullscreen
      }
    }
  },
  computed: {
    navigationVisible: {
      get () {
        return this.$store.state.navigationVisible
      },
      set (value) {
        this.setNavigationVisible(value || false)
      }
    },
    editorVisible () {
      return this.$vuetify.breakpoint.mdAndUp || !this.previewVisible
    },
    ...mapState(['previewVisible'])
  },
  methods: {
    ...mapActions([
      'setNavigationVisible'
    ])
  }
}
</script>
