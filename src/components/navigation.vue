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
        :items="nodes.content"
        :active="activeContentNodeId"
        @activate="activate"
      />
    </panel-section>

    <panel-section>
      <template v-slot:title>
        Theme
      </template>

      <treeview
        :items="nodes.theme"
        :active="activeThemeNodeId"
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

  function buildForest (nodeFactory, factories) {
    let nextNodeId = 0
    const nodeMap = {}

    function getNodeId (path, name) {
      path.reduce(
        (t, p) => {
          t[p] = t[p] || {}
          return t[p]
        },
        nodeMap
      )[name] = nextNodeId
      return nextNodeId++
    }

    function getTreeNode (root, path) {
      return path.reduce((parent, el) => {
        if (!parent.leaves[el]) {
          const node = {
            id: `${parent.id}/${el}`,
            name: el,
            icon: 'mdi-folder-outline',
            children: []
          }
          parent.nodes.push(node)
          parent.leaves[el] = {
            id: `${parent.id}/${el}`,
            nodes: node.children,
            leaves: {}
          }
        }
        return parent.leaves[el]
      }, root)
    }

    function buildTree (rootId, items, pathGetter) {
      const nodes = []
      const root = {
        id: rootId,
        nodes,
        leaves: {}
      }

      items.forEach(item => {
        const parent = getTreeNode(root, pathGetter(item))
        parent.nodes.push(nodeFactory(item, getNodeId))
      })
      return nodes
    }

    return [
      factories.reduce((tree, node) => {
        tree[node.anchor] = node.factory(buildTree, () => nextNodeId++)
        return tree
      }, {}),
      nodeMap
    ]
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
        building: false,
        nodes: { content: [], theme: [] },
        nodeMap: { content: {}, theme: {} }
      }
    },
    computed: {
      activeContentNodeId () {
        return this.activeNodeId('content')
      },
      activeThemeNodeId () {
        return this.activeNodeId('theme')
      },
      meta () {
        return this.$pelicide.meta
      },
      ...mapState(['siteFiles', 'currentSiteId', 'editorItem']),
      ...mapGetters(['currentSite'])
    },
    watch: {
      siteFiles () {
        this.buildTree()
      }
    },
    mounted () {
      const meta = { Cmd: 'meta', Ctrl: 'ctrl' }[this.meta]
      this.$shortcut.add('reload', ['shift', meta, 'l'])
      this.$shortcut.add('build', ['shift', meta, 'e'])

      this.buildTree()
    },
    destroyed () {
      const meta = { Cmd: 'meta', Ctrl: 'ctrl' }[this.meta]
      this.$shortcut.add('reload', ['shift', meta, 'l'])
      this.$shortcut.add('build', ['shift', meta, 'e'])
    },
    methods: {
      buildTree () {
        [this.nodes, this.nodeMap] = buildForest(
          (item, getNodeId) => {
            const editor = this.$pelicide.editors[item.mimetype]
            const icon = editor ? editor.icon : 'mdi-file-cancel-outline'
            return {
              id: getNodeId([item.anchor, ...item.path], item.name),
              icon,
              name: item.name,
              item
            }
          },
          [
            {
              anchor: 'content',
              factory: buildTree => [
                [
                  'content/articles/draft',
                  'Draft articles',
                  item => (
                    item.type === 'pelican.contents.Article' &&
                    item.status !== 'published'
                  ),
                  () => []
                ],
                [
                  'content/articles/published',
                  'Published articles',
                  item => (
                    item.type === 'pelican.contents.Article' &&
                    item.status === 'published'
                  ),
                  item => (item.meta && item.meta.category) ? [item.meta.category] : []
                ],
                [
                  'content/pages/draft',
                  'Draft pages',
                  item => (
                    item.type === 'pelican.contents.Page' &&
                    item.status !== 'published'
                  ),
                  item => (item.meta && item.meta.category) ? [item.meta.category] : []
                ],
                [
                  'content/pages/published',
                  'Published pages',
                  item => (
                    item.type === 'pelican.contents.Page' &&
                    item.status === 'published'
                  ),
                  item => (item.meta && item.meta.category) ? [item.meta.category] : []
                ],
                [
                  'content/other',
                  'Other',
                  item => (
                    item.type !== 'pelican.contents.Article' &&
                    item.type !== 'pelican.contents.Page'
                  ),
                  item => item.path
                ]
              ].map(([rootId, name, itemFilter, pathGetter]) => ({
                id: rootId,
                root: true,
                name,
                icon: 'mdi-folder',
                children: buildTree(
                  rootId,
                  this.siteFiles.content.filter(itemFilter),
                  pathGetter
                )
              }))
            },
            {
              anchor: 'theme',
              factory: buildTree => buildTree(
                'theme',
                this.siteFiles.theme,
                item => item.path
              )
            }
          ]
        )
      },
      activeNodeId (anchor) {
        const { editorItem: item } = this
        if (!item || item.siteId !== this.currentSiteId || item.anchor !== anchor) {
          return null
        }
        const parent = item.path.reduce(
          (t, p) => t[p] || {},
          this.nodeMap[anchor]
        )
        const nodeId = parent[item.name]
        return nodeId !== undefined ? nodeId : null
      },
      activate (node) {
        if (node && node.item) {
          this.$pelicide.editorOpen(node.item)
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
