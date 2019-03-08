<template>
  <v-toolbar-items>
    <panel-toolbar-button
      icon="mdi-refresh"
      tooltip="Refresh page"
      :disabled="!(editorItem && editorItem.url)"
      @click="reload"
    />

    <panel-toolbar-button
      icon="mdi-open-in-new"
      tooltip="Open in new window"
      :disabled="!(editorItem && editorItem.url)"
      @click="open"
    />
  </v-toolbar-items>
</template>

<script>
  import PanelToolbarButton from './panel-toolbar-button'
  import { mapState } from 'vuex'

  export default {
    components: {
      PanelToolbarButton
    },
    computed: {
      ...mapState(['editorItem'])
    },
    methods: {
      reload () {
        this.$pelicide.$emit('preview-render-reload')
      },
      open () {
        const win = window.open()
        win.opener = null
        win.location = this.editorItem.url
      }
    }
  }
</script>
