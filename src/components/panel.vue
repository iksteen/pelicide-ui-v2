<template>
  <div class="fill-height">
    <panel-toolbar>
      <slot name="toolbar" />
    </panel-toolbar>
    <slot />
  </div>
</template>

<script>
import PanelToolbar from './panel-toolbar'

export default {
  components: {
    PanelToolbar
  }
}
</script>
