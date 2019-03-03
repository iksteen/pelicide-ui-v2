<template>
  <v-dialog
    :value="loading"
    persistent
    fullscreen
    :transition="false"
  >
    <v-container fill-height>
      <v-layout
        row
        justify-center
        align-center
      >
        <v-progress-circular
          indeterminate
          :size="70"
          :width="7"
          color="#b36539" />
      </v-layout>
    </v-container>
  </v-dialog>
</template>

<script>
export default {
  props: ['loading']
}
</script>
