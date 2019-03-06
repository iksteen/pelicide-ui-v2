<template>
  <div class="treeview">
    <treeview-node
      v-for="item in items"
      :key="item.id"
      :item="item"
      :open="open"
      :active="active"
      @activate="activate"
    />
  </div>
</template>

<script>
  import TreeviewNode from './treeview-node'

  export default {
    components: { TreeviewNode },
    props: {
      items: {
        type: Array,
        default () { return [] }
      },
      active: {
        type: [String, Number],
        default: null
      }
    },
    data () {
      return {
        open: {}
      }
    },
    methods: {
      activate (item) {
        this.$emit('activate', item)
      }
    }
  }
</script>
