<template>
  <div class="fill-height">
    <panel-toolbar v-if="!isFullscreen">
      <slot name="toolbar" />
    </panel-toolbar>
    <slot />
  </div>
</template>

<script>
import PanelToolbar from './panel-toolbar'
import { mapState } from 'vuex'

export default {
  components: {
    PanelToolbar
  },
  computed: {
    ...mapState(['isFullscreen'])
  }
}
</script>
