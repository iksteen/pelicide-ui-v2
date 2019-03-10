<template>
  <div class="treeview">
    <treeview-node
      v-for="item in sortedItems"
      :key="item.id"
      :item="item"
      :open="open"
      :active="active"
      @activate="activate"
    />
  </div>
</template>

<script>
  import TreeviewNode from './node'

  export default {
    components: { TreeviewNode },
    props: {
      rootSortable: {
        type: Boolean,
        default: true
      },
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
    computed: {
      sortedItems () {
        return this.rootSortable
          ? this.items.slice().sort((a, b) => a.name.localeCompare(b.name))
          : this.items
      }
    },
    methods: {
      activate (item) {
        this.$emit('activate', item)
      }
    }
  }
</script>
