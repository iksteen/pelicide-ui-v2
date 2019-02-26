<template>
  <v-btn small icon class="mx-1" @click="click">
    <v-icon small>{{ icon }}</v-icon>
  </v-btn>
</template>

<script>
export default {
  props: ['icon'],
  methods: {
    click () {
      this.$emit('click')
    }
  }
}
</script>
