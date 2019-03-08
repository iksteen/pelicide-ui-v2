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

      <v-toolbar-items v-show="mode !== 'draft'">
        <panel-toolbar-divider />
        <preview-render-toolbar />
      </v-toolbar-items>
    </template>

    <preview-draft v-show="mode === 'draft'" />
    <preview-render v-show="mode !== 'draft'" />
  </panel>
</template>

<script>
  import Panel from './panel'
  import PanelToolbarButton from './panel-toolbar-button'
  import PanelToolbarDivider from './panel-toolbar-divider'
  import PanelToolbarOptions from './panel-toolbar-options'
  import PreviewDraft from './preview-draft'
  import PreviewRender from './preview-render'
  import PreviewRenderToolbar from './preview-render-toolbar'
  import { mapActions } from 'vuex'

  export default {
    components: {
      Panel,
      PanelToolbarButton,
      PanelToolbarDivider,
      PanelToolbarOptions,
      PreviewDraft,
      PreviewRender,
      PreviewRenderToolbar
    },
    data () {
      return {
        mode: 'draft',
        modes: [
          {
            value: 'draft',
            label: 'Draft',
            tooltip: 'Switch to draft preview'
          },
          {
            value: 'render',
            label: 'Render',
            tooltip: 'Switch to render preview'
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
