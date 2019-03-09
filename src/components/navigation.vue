<template>
  <panel>
    <template v-slot:toolbar>
      <panel-toolbar-button
        icon="mdi-refresh"
        :tooltip="`Refresh project files (${meta}-Shift-L)`"
        :disabled="!currentSiteId"
        @click="reload"
      />
      <panel-toolbar-button
        icon="mdi-wrench"
        :tooltip="`Save and build site (${meta}-Shift-E)`"
        :disabled="!currentSiteId || building"
        @click="build"
      />
      <panel-toolbar-button
        icon="mdi-cloud-upload"
        tooltip="Publish site"
        disabled
      />
      <panel-toolbar-divider />
      <panel-toolbar-button
        icon="mdi-file-plus"
        tooltip="Add new article or page"
        disabled
      />
      <v-spacer />
      <panel-toolbar-button
        icon="mdi-web"
        tooltip="Change active site"
        disabled
      />
    </template>

    <panel-section active>
      <template v-slot:title>
        <span
          v-if="currentSite"
          v-text="currentSite.name"
        />
        <i v-else>No site selected.</i>
      </template>

      <treeview
        :items="content"
        :active="activeContentItemId"
        @activate="activate"
      />
    </panel-section>

    <panel-section>
      <template v-slot:title>
        Theme
      </template>

      <treeview
        :items="theme"
        :active="activeThemeItemId"
        @activate="activate"
      />
    </panel-section>
  </panel>
</template>

<script>
  import Panel from './panel'
  import PanelSection from './panel/section'
  import PanelToolbarButton from './panel/toolbar/button'
  import PanelToolbarDivider from './panel/toolbar/divider'
  import Treeview from './treeview'
  import { mapActions, mapGetters, mapState } from 'vuex'

  function getTreeNode (nodeId, root, path) {
    return path.reduce((parent, el) => {
      let leaf = parent.leaves[el]
      if (leaf === undefined) {
        const node = {
          id: nodeId(),
          name: el,
          icon: 'mdi-folder-outline',
          children: []
        }
        parent.nodes.push(node)
        leaf = parent.leaves[el] = {
          nodes: node.children,
          leaves: {}
        }
      }
      return leaf
    }, root)
  }

  export default {
    components: {
      Panel,
      PanelSection,
      PanelToolbarButton,
      PanelToolbarDivider,
      Treeview
    },
    data () {
      return {
        activeItem: null,
        building: false
      }
    },
    computed: {
      content () {
        let nodeId = 5 // 0...4 taken by static root nodes
        return [
          {
            id: 0,
            root: true,
            name: 'Draft articles',
            icon: 'mdi-folder',
            children: this.buildTree(
              () => nodeId++,
              'content',
              this.siteFiles.content.filter(
                item => (
                  item.type === 'pelican.contents.Article' &&
                  item.status !== 'published'
                )
              ),
              () => []
            )
          },
          {
            id: 1,
            root: true,
            name: 'Published articles',
            icon: 'mdi-folder',
            children: this.buildTree(
              () => nodeId++,
              'content',
              this.siteFiles.content.filter(
                item => (
                  item.type === 'pelican.contents.Article' &&
                  item.status === 'published'
                )
              ),
              item => (item.meta && item.meta.category) ? [item.meta.category] : []
            )
          },
          {
            id: 2,
            root: true,
            name: 'Draft pages',
            icon: 'mdi-folder',
            children: this.buildTree(
              () => nodeId++,
              'content',
              this.siteFiles.content.filter(
                item => (
                  item.type === 'pelican.contents.Page' &&
                  item.status !== 'published'
                )
              ),
              item => (item.meta && item.meta.category) ? [item.meta.category] : []
            )
          },
          {
            id: 3,
            root: true,
            name: 'Published pages',
            icon: 'mdi-folder',
            children: this.buildTree(
              () => nodeId++,
              'content',
              this.siteFiles.content.filter(
                item => (
                  item.type === 'pelican.contents.Page' &&
                  item.status === 'published')
              ),
              item => (item.meta && item.meta.category) ? [item.meta.category] : []
            )
          },
          {
            id: 4,
            root: true,
            name: 'Other',
            icon: 'mdi-folder',
            children: this.buildTree(
              () => nodeId++,
              'content',
              this.siteFiles.content.filter(
                item => (
                  item.type !== 'pelican.contents.Article' &&
                  item.type !== 'pelican.contents.Page'
                )
              ),
              item => item.path
            )
          }
        ]
      },
      theme () {
        let nodeId = 0
        return this.buildTree(
          () => nodeId++,
          'theme',
          this.siteFiles.theme,
          item => item.path
        )
      },
      activeContentItemId () {
        return (
          this.editorItem &&
          this.editorItem.siteId === this.currentSiteId &&
          this.editorItem.anchor === 'content'
        ) ? this.editorItem.id : null
      },
      activeThemeItemId () {
        return (
          this.editorItem &&
          this.editorItem.siteId === this.currentSiteId &&
          this.editorItem.anchor === 'theme'
        ) ? this.editorItem.id : null
      },
      meta () {
        return this.$pelicide.meta
      },
      ...mapState(['siteFiles', 'currentSiteId', 'editorItem']),
      ...mapGetters(['currentSite'])
    },
    mounted () {
      const meta = { Cmd: 'meta', Ctrl: 'ctrl' }[this.meta]
      this.$shortcut.add('reload', ['shift', meta, 'l'])
      this.$shortcut.add('build', ['shift', meta, 'e'])
    },
    destroyed () {
      const meta = { Cmd: 'meta', Ctrl: 'ctrl' }[this.meta]
      this.$shortcut.add('reload', ['shift', meta, 'l'])
      this.$shortcut.add('build', ['shift', meta, 'e'])
    },
    methods: {
      buildTree (nodeId, anchor, items, pathGetter) {
        const nodes = []
        const root = {
          nodes,
          leaves: {}
        }

        items.forEach(item => {
          const path = pathGetter(item)
          const leaf = getTreeNode(nodeId, root, path)
          const editor = this.$pelicide.editors[item.mimetype]
          const icon = editor ? editor.icon : 'mdi-file-cancel-outline'
          leaf.nodes.push({
            id: nodeId(),
            siteId: this.currentSiteId,
            anchor,
            icon,
            ...item
          })
        })
        return nodes
      },
      activate (item) {
        if (item) {
          this.$pelicide.editorOpen(item)
        }
      },
      reload () {
        if (this.currentSiteId) {
          this.$api.updateSiteFiles()
        }
      },
      build () {
        this.building = true
        new Promise((resolve, reject) => {
          this.$pelicide.editorSave({ resolve, reject })
        })
          .then(() => this.$api.build(this.currentSiteId))
          .then(() => {
            this.$pelicide.previewRenderReload()
            this.setMessage({ text: 'Site built' })
          })
          .catch(e => this.setError({ text: `Failed to build site: ${e.message}.` }))
          .then(() => { this.building = false })
      },
      ...mapActions([
        'setMessage',
        'setError'
      ])
    },
    shortcuts: {
      reload (e) {
        e.preventDefault()
        this.reload()
      },
      build (e) {
        e.preventDefault()
        this.build()
      }
    }
  }
</script>
