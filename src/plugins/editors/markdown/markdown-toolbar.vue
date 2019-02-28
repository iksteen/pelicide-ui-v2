<template>
  <v-toolbar-items>
    <panel-toolbar-button
      icon="mdi-format-bold" />
    <panel-toolbar-button
      icon="mdi-format-italic" />
    <panel-toolbar-button
      icon="mdi-format-header-pound" />
    <panel-toolbar-divider />
    <panel-toolbar-button
      icon="mdi-link-plus" />
    <panel-toolbar-button
      icon="mdi-image" />
    <panel-toolbar-button
      icon="mdi-format-list-bulleted" />
  </v-toolbar-items>
</template>

<script>
import PanelToolbarButton from '../../../components/panel-toolbar-button'
import PanelToolbarDivider from '../../../components/panel-toolbar-divider'

export default {
  components: {
    PanelToolbarButton,
    PanelToolbarDivider
  }
}
</script>
