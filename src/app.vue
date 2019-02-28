<template>
  <v-app>
    <v-navigation-drawer app v-model="navigationVisible">
      <NavigationPanel />
    </v-navigation-drawer>

    <v-content>
      <v-container fluid pa-0 fill-height>
        <v-layout row>
          <v-flex v-bind:class="{ xs6: previewVisible }">
            <editor-panel />
          </v-flex>

          <v-flex v-if="previewVisible" xs6>
            <preview-panel />
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<style lang="stylus" scoped>
  .container
    position absolute
</style>

<script>
import NavigationPanel from './components/navigation-panel'
import EditorPanel from './components/editor-panel'
import PreviewPanel from './components/preview-panel'
import { mapActions, mapState } from 'vuex'

export default {
  components: {
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
    ...mapState(['previewVisible'])
  },
  methods: {
    ...mapActions([
      'setNavigationVisible'
    ])
  }
}
</script>
