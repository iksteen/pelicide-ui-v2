<template>
  <v-btn-toggle
    v-model="val"
    class="transparent mx-1"
    :mandatory="mandatory"
  >
    <template v-for="option in options">
      <v-btn
        :key="option.value"
        flat
        :small="small"
        :value="option.value"
      >
        {{ option.label }}
      </v-btn>
    </template>
  </v-btn-toggle>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    props: {
      options: {
        type: Array,
        default: () => []
      },
      value: {
        type: String,
        default: ''
      },
      mandatory: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      val: {
        get () {
          return this.value
        },
        set (value) {
          this.$emit('input', value)
        }
      },
      small () {
        return this.toolbarStyle === 'tiny'
      },
      ...mapState(['toolbarStyle'])
    }
  }
</script>
