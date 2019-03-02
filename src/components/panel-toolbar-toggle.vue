<template>
  <v-btn-toggle v-model="val" class="transparent">
    <v-btn icon :small="small" :value="true" class="mx-1">
      <v-icon :small="small">{{ icon }}</v-icon>
    </v-btn>
  </v-btn-toggle>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: ['value', 'icon'],
  computed: {
    val: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value || false)
      }
    },
    small () {
      return this.toolbarStyle === 'tiny'
    },
    ...mapState(['toolbarStyle'])
  }
}
</script>
