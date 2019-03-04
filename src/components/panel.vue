<template>
  <v-layout column>
    <panel-toolbar v-if="!$fs.fullscreen">
      <slot name="toolbar" />
    </panel-toolbar>

    <v-layout
      column
      content-layout
    >
      <slot />
    </v-layout>
  </v-layout>
</template>

<style lang="stylus" scoped>
  .content-layout
    position relative
    overflow auto
</style>

<script>
  import PanelToolbar from './panel-toolbar'

  export default {
    components: {
      PanelToolbar
    }
  }
</script>
