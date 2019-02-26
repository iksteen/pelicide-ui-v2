<template>
  <v-app>
    <v-navigation-drawer app v-model="navigationVisible">
      <NavigationPanel />
    </v-navigation-drawer>

    <v-content>
      <v-container fluid pa-0 fill-height>
        <v-layout row>
          <v-flex>
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
    ...mapActions(['setNavigationVisible'])
  }
}
</script>
