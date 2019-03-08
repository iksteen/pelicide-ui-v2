<template>
  <v-toolbar-items>
    <panel-toolbar-button
      icon="mdi-format-bold"
      :tooltip="`Bold (${meta}-B)`"
      @click="editor.bold"
    />
    <panel-toolbar-button
      icon="mdi-format-italic"
      :tooltip="`Italic (${meta}-I)`"
      @click="editor.italic"
    />
    <panel-toolbar-button
      icon="mdi-format-strikethrough"
      :tooltip="`Strike through (${meta}-T)`"
      @click="editor.strikethrough"
    />
    <panel-toolbar-button
      icon="mdi-format-header-pound"
      :tooltip="`Heading (${meta}-H)`"
      @click="editor.heading"
    />
    <panel-toolbar-divider />
    <panel-toolbar-button
      icon="mdi-link-plus"
      :tooltip="`Add link (${meta}-L)`"
      @click="editor.link"
    />
    <panel-toolbar-button
      icon="mdi-image"
      :tooltip="`Insert image (${meta}-O)`"
      @click="editor.image"
    />
    <panel-toolbar-button
      icon="mdi-format-list-bulleted"
      :tooltip="`Add list (${meta}-U)`"
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
    },
    computed: {
      meta () {
        return this.$pelicide.meta
      }
    }
  }
</script>
