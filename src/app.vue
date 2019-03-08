<template>
  <v-app :dark="darkMode">
    <v-navigation-drawer
      :value="navigationVisible"
      app
      @input="setNavigationVisible"
    >
      <navigation-panel />
    </v-navigation-drawer>

    <v-content class="fill-height">
      <v-container
        fluid
        pa-0
        fill-height
      >
        <v-layout>
          <transition name="flexhide">
            <editor-panel
              v-show="editorVisible"
            />
          </transition>

          <transition name="flexhide">
            <preview-panel
              v-show="previewVisible"
              class="flex xs12 md6"
            />
          </transition>
        </v-layout>
      </v-container>
      <connecting-dialog :loading="!$api.ready" />
      <v-snackbar
        :value="message"
        :timeout="(message && message.timeout !== undefined) ? message.timeout : 3000"
        :color="message && message.color"
      >
        {{ message && message.text }}
        <v-btn
          flat
          @click="setMessage(null)"
        >
          Close
        </v-btn>
      </v-snackbar>
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
    computed: {
      editorVisible () {
        return this.$vuetify.breakpoint.mdAndUp || !this.previewVisible
      },
      ...mapState([
        'message',
        'navigationVisible',
        'previewVisible',
        'darkMode'
      ])
    },
    watch: {
      '$fs.fullscreen' (value) {
        if (value) {
          this.navigationVisibleBeforeFullscreen = this.navigationVisible
          this.setNavigationVisible(false)
        } else {
          this.setNavigationVisible(this.navigationVisibleBeforeFullscreen)
        }
      }
    },
    methods: {
      ...mapActions([
        'setMessage',
        'setNavigationVisible'
      ])
    }
  }
</script>
