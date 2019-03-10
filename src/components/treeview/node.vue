<template>
  <div
    class="treeview-node"
    :class="classes"
  >
    <div
      class="treeview-node__label"
      @[handleClick]="click"
      @[handleDblclick]="dblclick"
    >
      <v-icon
        v-text="item.children && item.children.length ? 'mdi-menu-down': ''"
      />
      <div class="treeview-node__content">
        <v-icon v-text="item.icon" />
        <div class="treeview-node__title">
          {{ item.name }}
        </div>
      </div>
    </div>
    <v-expand-transition>
      <div
        v-show="isOpen"
        class="treeview-node__children"
      >
        <treeview-node
          v-for="child in sortedChildren"
          :key="child.id"
          :item="child"
          :open="open"
          :active="active"
          @activate="activate"
        />
      </div>
    </v-expand-transition>
  </div>
</template>

<style lang="stylus">
  .treeview-node
    user-select none

    &__label
      height 34px
      display flex
      white-space nowrap

      > .v-icon
        flex 0 0 24px
        transform rotate(-90deg)

    &__content
      display flex
      align-items center

    &__title
      margin-left 6px

    &__children
      margin-left: 24px

    &--open
      > .treeview-node__label > .v-icon
        transform rotate(0deg)

    &--active
      > .treeview-node__label .treeview-node__title
        font-weight bold
</style>

<script>
  export default {
    name: 'TreeviewNode',
    props: {
      open: {
        type: Object,
        default: null
      },
      item: {
        type: Object,
        default () { return {} }
      },
      active: {
        type: [Number, String],
        default: null
      }
    },
    computed: {
      sortedChildren () {
        return this.item.children
          ? this.item.children.slice().sort((a, b) => a.name.localeCompare(b.name))
          : []
      },
      isActive () {
        return this.active === this.item.id
      },
      isOpen: {
        get () {
          return this.open['' + this.item.id] === true
        },
        set (val) {
          if (val) {
            this.$set(this.open, '' + this.item.id, true)
          } else {
            this.$delete(this.open, '' + this.item.id)
          }
        }
      },
      classes () {
        return {
          'treeview-node--open': this.isOpen,
          'treeview-node--active': this.isActive
        }
      },
      handleClick () {
        return this.item.children ? 'click' : null
      },
      handleDblclick () {
        return this.item.children === undefined ? 'dblclick' : null
      }
    },
    methods: {
      activate (item) {
        this.$emit('activate', item)
      },
      click () {
        this.isOpen = !this.isOpen
      },
      dblclick () {
        if (this.isActive) {
          this.activate(null)
        } else {
          this.activate(this.item)
        }
      }
    }
  }
</script>
