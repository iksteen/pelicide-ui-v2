<template>
  <panel class="preview">
    <template v-slot:toolbar>
      <panel-toolbar-options
        v-model="mode"
        :options="modes" />
      <panel-toolbar-divider />
      <panel-toolbar-button
        icon="mdi-refresh" />
      <panel-toolbar-button
        icon="mdi-open-in-new" />
    </template>
    PREVIEW
  </panel>
</template>

<script>
import Panel from './panel'
import PanelToolbarButton from './panel-toolbar-button'
import PanelToolbarDivider from './panel-toolbar-divider'
import PanelToolbarOptions from './panel-toolbar-options'

export default {
  components: {
    Panel,
    PanelToolbarButton,
    PanelToolbarDivider,
    PanelToolbarOptions
  },
  data () {
    return {
      mode: 'draft',
      modes: [
        {
          'value': 'draft',
          'label': 'Draft'
        },
        {
          'value': 'render',
          'label': 'Render'
        }
      ]
    }
  }
}
</script>
