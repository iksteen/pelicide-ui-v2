<template>
  <v-toolbar flat :dense="dense" :height="height">
    <slot />
  </v-toolbar>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    dense () {
      return this.toolbarStyle === 'small'
    },
    height () {
      return this.toolbarStyle === 'tiny' ? '32px' : null
    },
    ...mapState(['toolbarStyle'])
  }
}
</script>
