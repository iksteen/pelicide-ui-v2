<template>
  <v-btn-toggle v-model="val" class="transparent">
    <v-btn icon small :value="true" class="mx-1">
      <v-icon small>{{ icon }}</v-icon>
    </v-btn>
  </v-btn-toggle>
</template>

<script>
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
    }
  }
}
</script>
