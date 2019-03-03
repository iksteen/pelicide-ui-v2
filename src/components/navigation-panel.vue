<template>
  <panel>
    <template v-slot:toolbar>
      <panel-toolbar-button icon="mdi-refresh" />
      <panel-toolbar-button icon="mdi-wrench" />
      <panel-toolbar-button icon="mdi-cloud-upload" />
      <panel-toolbar-divider />
      <panel-toolbar-button icon="mdi-file-plus" />
      <v-spacer />
      <panel-toolbar-button icon="mdi-web" />
    </template>
  </panel>
</template>

<script>
import Panel from './panel'
import PanelToolbarButton from './panel-toolbar-button'
import PanelToolbarDivider from './panel-toolbar-divider'

export default {
  components: {
    Panel,
    PanelToolbarButton,
    PanelToolbarDivider
  }
}
</script>
