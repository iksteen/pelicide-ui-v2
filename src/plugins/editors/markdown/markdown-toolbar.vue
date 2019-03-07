<template>
  <v-toolbar-items>
    <panel-toolbar-button
      icon="mdi-format-bold"
      @click="bold"
    />
    <panel-toolbar-button
      icon="mdi-format-italic"
      @click="italic"
    />
    <panel-toolbar-button
      icon="mdi-format-strikethrough"
      @click="strikethrough"
    />
    <panel-toolbar-button
      icon="mdi-format-header-pound"
      @click="header"
    />
    <panel-toolbar-divider />
    <panel-toolbar-button
      icon="mdi-link-plus"
      @click="link"
    />
    <panel-toolbar-button
      icon="mdi-image"
      @click="image"
    />
    <panel-toolbar-button
      icon="mdi-format-list-bulleted"
      @click="ulist"
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
    methods: {
      bold () {
        this.editor.surroundSelection('**').focus()
      },
      italic () {
        this.editor.surroundSelection('*').focus()
      },
      strikethrough () {
        this.editor.surroundSelection('<s>', '</s>').focus()
      },
      header () {
        this.editor.replaceInLines(
          /^(#+)\s?/,
          match => match
            ? [
              match[1].length < 6 ? '#'.repeat(match[1].length + 1) + ' ' : '',
              match.index,
              match[0].length
            ]
            : ['# ']
        ).focus()
      },
      link () {
        const { editor } = this
        const selection = editor.getSelection()
        if (!selection) {
          editor.surroundSelection('[](https://)', '', 11)
        } else if (/^\w+:\/\/|^mailto:/.test(selection)) {
          editor.surroundSelection('[](', ')', selection.length + 3)
        } else {
          editor.surroundSelection('[', '](https://)', 1)
        }
        editor.focus()
      },
      image () {
        const { editor } = this
        const selection = editor.getSelection()
        if (!selection) {
          editor.surroundSelection('![]()', '', 3)
        } else if (/^\w+:\/\//.test(selection)) {
          editor.surroundSelection('![](', ')', selection.length + 3)
        } else {
          editor.surroundSelection('![', ']()', 1)
        }
        editor.focus()
      },
      ulist () {
        this.editor.replaceInLines(
          /^\s*[*+-]\s/,
          match => match ? ['', 0, match[0].length] : ['* '],
          !!this.editor.getSelection()
        ).focus()
      }
    }
  }
</script>
