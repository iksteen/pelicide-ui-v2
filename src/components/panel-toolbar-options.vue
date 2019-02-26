<template>
  <v-btn-toggle v-model="val" class="transparent mx-1" :mandatory="mandatory">
    <template v-for="option in options">
      <v-btn :key="option.value" flat small :value="option.value">
        {{ option.label }}
      </v-btn>
    </template>
  </v-btn-toggle>
</template>

<script>
export default {
  props: ['options', 'value', 'mandatory'],
  computed: {
    val: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    }
  }
}
</script>
