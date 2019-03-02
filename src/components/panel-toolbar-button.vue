<template>
  <v-btn :small="small" icon class="mx-1" @click="click">
    <v-icon :small="small">{{ icon }}</v-icon>
  </v-btn>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: ['icon'],
  computed: {
    small () {
      return this.toolbarStyle === 'tiny'
    },
    ...mapState(['toolbarStyle'])
  },
  methods: {
    click () {
      this.$emit('click')
    }
  }
}
</script>
