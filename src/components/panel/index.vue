<template>
  <v-layout
    column
    fill-height
  >
    <panel-toolbar v-if="!$fs.fullscreen">
      <slot name="toolbar" />
    </panel-toolbar>

    <v-layout
      column
      panel__content
    >
      <slot />
    </v-layout>
  </v-layout>
</template>

<style lang="stylus" scoped>
  .panel__content
    position relative
    overflow auto
</style>

<script>
  import PanelToolbar from './toolbar'

  export default {
    components: {
      PanelToolbar
    }
  }
</script>
