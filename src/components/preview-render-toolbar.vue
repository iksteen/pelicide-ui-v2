<template>
  <v-toolbar-items>
    <panel-toolbar-button
      icon="mdi-refresh"
      tooltip="Refresh page"
    />

    <panel-toolbar-button
      icon="mdi-open-in-new"
      tooltip="Open in new window"
    />
  </v-toolbar-items>
</template>

<script>
  import PanelToolbarButton from './panel-toolbar-button'

  export default {
    components: {
      PanelToolbarButton
    }
  }
</script>
