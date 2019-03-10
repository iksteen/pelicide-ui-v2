<template>
  <div
    class="treeview-node"
    :class="classes"
  >
    <div
      ref="label"
      class="treeview-node__label"
    >
      <v-icon
        @click="isOpen = !isOpen"
        v-text="data.children && data.children.length ? 'mdi-menu-down': ''"
      />
      <div
        class="treeview-node__content"
        @click="click"
        @dblclick="dblclick"
      >
        <v-icon v-text="data.icon" />
        <div class="treeview-node__title">
          {{ data.name }}
        </div>
      </div>
    </div>
    <v-expand-transition>
      <div
        v-show="isOpen"
        class="treeview-node__children"
      >
        <treeview-node
          v-for="nodeData in sortedChildData"
          ref="childNodes"
          :key="nodeData.id"
          :data="nodeData"
          :open="open"
          :focus="focus"
          :active="active"
          @focus="setFocus"
          @activate="activate"
        />
      </div>
    </v-expand-transition>
  </div>
</template>

<style lang="stylus">
  @import '~vuetify/src/stylus/bootstrap'
  @import '~vuetify/src/stylus/theme'

  treeview-node($material)
    > .treeview-node__label > .treeview-node__content
      background-color: $material.dividers

  theme(treeview-node, "treeview-node--focus")

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
      margin-right 2px

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
  import Themeable from 'vuetify/lib/mixins/themeable'

  export default {
    name: 'TreeviewNode',
    mixins: [Themeable],
    props: {
      open: {
        type: Object,
        default: null
      },
      focus: {
        type: Object,
        default: null
      },
      data: {
        type: Object,
        default () { return {} }
      },
      active: {
        type: [Number, String],
        default: null
      }
    },
    computed: {
      classes () {
        return {
          'treeview-node--open': this.isOpen,
          'treeview-node--active': this.isActive,
          'treeview-node--focus': this.hasFocus,
          ...this.themeClasses
        }
      },
      hasFocus () {
        return this.focus === this
      },
      sortedChildData () {
        return this.data.children
          ? this.data.children.slice().sort((a, b) => a.name.localeCompare(b.name))
          : []
      },
      isActive () {
        return this.active === this.data.id
      },
      isOpen: {
        get () {
          return this.data.children && this.data.children.length && this.open['' + this.data.id] === true
        },
        set (val) {
          if (this.data.children && this.data.children.length) {
            if (val) {
              this.$set(this.open, '' + this.data.id, true)
            } else {
              this.$delete(this.open, '' + this.data.id)
            }
          }
        }
      }
    },
    methods: {
      setFocus (node) {
        this.$emit('focus', node)
      },
      activate (node) {
        this.$emit('activate', node)
      },
      click () {
        this.setFocus(this)
      },
      dblclick () {
        if (this.data.children) {
          this.isOpen = !this.isOpen
        } else if (this.isActive) {
          this.activate(null)
        } else {
          this.activate(this)
        }
      },
      toggle (e) {
        if (this.data.children) {
          this.click()
        } else {
          this.dblclick()
        }
      }
    }
  }
</script>
