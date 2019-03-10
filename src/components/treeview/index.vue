<template>
  <div
    class="treeview"
    tabindex="0"
    @blur="onblur"
    @focus="onfocus"
    @keydown.enter="activateNode"
    @keydown.space="activateNode"
    @keydown.189="setNodeOpen(false)"
    @keydown.187="setNodeOpen(true)"
    @keydown.up="focusPrev"
    @keydown.down="focusNext"
  >
    <treeview-node
      v-for="nodeData in sortedData"
      ref="childNodes"
      :key="nodeData.id"
      :data="nodeData"
      :open="open"
      :focus="focus"
      :active="active"
      @activate="activate"
      @focus="setFocus"
    />
  </div>
</template>

<style lang="stylus">
  .treeview
    height 100%
    overflow auto
</style>

<script>
  import TreeviewNode from './node'

  export default {
    components: { TreeviewNode },
    props: {
      rootSortable: {
        type: Boolean,
        default: true
      },
      data: {
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
        open: {},
        lastFocus: null,
        focus: null
      }
    },
    computed: {
      sortedData () {
        return this.rootSortable
          ? this.data.slice().sort((a, b) => a.name.localeCompare(b.name))
          : this.data
      }
    },
    watch: {
      focus (value) {
        if (value) {
          const label = value.$refs.label
          const top = label.offsetTop - this.$el.offsetTop
          const bottom = top + label.clientHeight
          const scrollTop = this.$el.scrollTop
          const scrollBottom = scrollTop + this.$el.clientHeight
          if (top < scrollTop) {
            label.scrollIntoView(true)
          } else if (bottom > scrollBottom) {
            label.scrollIntoView(false)
          }
        }
      },
      open () {
        let node = this.focus.$parent
        while (node && node !== this) {
          if (!node.isOpen) {
            this.focus = node
            return
          }
          node = node.$parent
        }
      }
    },
    methods: {
      activate (node) {
        this.$emit('activate', node.data)
      },
      setFocus (child) {
        this.focus = child
      },
      onblur () {
        this.lastFocus = this.focus
        this.focus = null
      },
      onfocus () {
        this.focus = this.lastFocus
        if (this.focus === null && this.$refs.childNodes && this.$refs.childNodes.length) {
          this.focus = this.$refs.childNodes[0]
        }
      },
      focusPrev (e) {
        e.preventDefault()

        let node = this.focus
        if (!node) {
          return
        }
        node.$el.tabindex = '-1'

        const parentNodes = node.$parent.$refs.childNodes
        const index = parentNodes.indexOf(node)
        if (index === 0) {
          // Node is first child of parent: focus parent.
          if (node.$parent !== this) {
            this.focus = node.$parent
          }
        } else if (index > 0) {
          // Deep-dive through previous sibling's open last nodes.
          node = parentNodes[index - 1]
          while (node.isOpen) {
            node = node.$refs.childNodes.slice(-1)[0]
          }
          this.focus = node
        }
      },
      focusNext (e) {
        e.preventDefault()

        let node = this.focus
        if (!node) {
          return
        }

        if (node.isOpen) {
          // Node has children and is open. Focus first child.
          this.focus = node.$refs.childNodes[0]
        } else {
          // Deep dive through parents to find a next sibling.
          while (node !== this) {
            const parentNodes = node.$parent.$refs.childNodes
            const index = parentNodes.indexOf(node)
            if (index !== parentNodes.length - 1) {
              this.focus = parentNodes[index + 1]
              return
            }
            node = node.$parent
          }
        }
      },
      activateNode (e) {
        e.preventDefault()

        const node = this.focus
        if (!node) {
          return
        }

        if (node.data.children) {
          node.isOpen = !node.isOpen
        } else {
          this.activate(node)
        }
      },
      setNodeOpen (value) {
        if (!this.focus) {
          return
        }
        if (this.focus.data.children) {
          this.focus.isOpen = value
        }
      }
    }
  }
</script>
