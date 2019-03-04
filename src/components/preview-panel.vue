<template>
  <panel class="preview">
    <template v-slot:toolbar>
      <panel-toolbar-button
        class="hidden-md-and-up"
        icon="mdi-pencil"
        @click="setPreviewVisible(false)"
      />
      <panel-toolbar-options
        v-model="mode"
        :options="modes"
      />
      <panel-toolbar-divider />
      <panel-toolbar-button
        icon="mdi-refresh"
      />
      <panel-toolbar-button
        icon="mdi-open-in-new"
      />
    </template>
    PREVIEW
  </panel>
</template>

<script>
  import Panel from './panel'
  import PanelToolbarButton from './panel-toolbar-button'
  import PanelToolbarDivider from './panel-toolbar-divider'
  import PanelToolbarOptions from './panel-toolbar-options'
  import { mapActions } from 'vuex'

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
    },
    methods: {
      ...mapActions([
        'setPreviewVisible'
      ])
    }
  }
</script>
