<template>
  <v-toolbar-items>
    <panel-toolbar-button
      icon="mdi-format-bold"
      @click="editor.bold"
    />
    <panel-toolbar-button
      icon="mdi-format-italic"
      @click="editor.italic"
    />
    <panel-toolbar-button
      icon="mdi-format-strikethrough"
      @click="editor.strikethrough"
    />
    <panel-toolbar-button
      icon="mdi-format-header-pound"
      @click="editor.heading"
    />
    <panel-toolbar-divider />
    <panel-toolbar-button
      icon="mdi-link-plus"
      @click="editor.link"
    />
    <panel-toolbar-button
      icon="mdi-image"
      @click="editor.image"
    />
    <panel-toolbar-button
      icon="mdi-format-list-bulleted"
      @click="editor.ulist"
    />
  </v-toolbar-items>
</template>

<script>
  import PanelToolbarButton from '../../../components/panel-toolbar-button'
  import PanelToolbarDivider from '../../../components/panel-toolbar-divider'

  export default {
    inject: ['getEditorComponent'],
    components: {
      PanelToolbarButton,
      PanelToolbarDivider
    },
    data () {
      return {
        editor: this.getEditorComponent()
      }
    }
  }
</script>
