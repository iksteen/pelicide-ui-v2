<template>
  <panel>
    <template v-slot:toolbar>
      <panel-toolbar-button
        icon="mdi-refresh"
        :tooltip="`Refresh project files (${meta}-Shift-L)`"
        :disabled="!currentSiteId"
        @click="reload(); focus()"
      />
      <panel-toolbar-button
        icon="mdi-wrench"
        :tooltip="`Save and build site (${meta}-Shift-E)`"
        :disabled="!currentSiteId || building"
        @click="build(); focus()"
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
      <v-menu
        offset-x
      >
        <template v-slot:activator="{ on }">
          <panel-toolbar-button
            icon="mdi-web"
            tooltip="Change active site"
            :disabled="sites.length < 2"
            v-on="on"
          />
        </template>
        <v-list>
          <v-list-tile
            v-for="site in sites"
            :key="site.siteid"
            @click="setCurrentSiteId(site.siteId); focus()"
          >
            <v-list-tile-title
              :class="{ 'font-weight-medium': site.siteId === currentSiteId }"
            >
              {{ site.name }}
            </v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </template>

    <panel-section
      ref="contentSection"
      active
      @focus="el => lastFocus = el"
    >
      <template v-slot:title>
        <span
          v-if="currentSite"
          v-text="currentSite.name"
        />
        <i v-else>No site selected.</i>
      </template>

      <treeview
        ref="contentTree"
        :data="nodes.content"
        :active="activeContentNodeId"
        :root-sortable="false"
        @activate="activate"
        @focus.native="lastFocus = $refs.contentTree.$el"
      />
    </panel-section>

    <panel-section
      ref="themeSection"
      @focus="el => lastFocus = el"
    >
      <template v-slot:title>
        Theme
      </template>

      <treeview
        ref="themeTree"
        :data="nodes.theme"
        :active="activeThemeNodeId"
        @activate="activate"
        @focus.native="lastFocus = $refs.themeTree.$el"
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
      factories.reduce((tree, { anchor, factory }) => {
        tree[anchor] = factory(buildTree, () => nextNodeId++)
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
        lastFocus: null,
        currentSiteId: null,
        currentSiteFiles: {},
        nodes: {},
        nodeMap: {},
        building: false
      }
    },
    computed: {
      currentSite () {
        return this.sitesById[this.currentSiteId] || null
      },
      activeContentNodeId () {
        return this.activeNodeId('content')
      },
      activeThemeNodeId () {
        return this.activeNodeId('theme')
      },
      meta () {
        return this.$pelicide.meta
      },
      ...mapState([
        'sites',
        'editorItem',
        'navigationVisible'
      ]),
      ...mapGetters(['sitesById'])
    },
    watch: {
      sitesById () {
        if (!this.currentSite) {
          this.autoSelectSite()
        }
      },
      currentSiteId () {
        this.currentSiteFiles = {}
        this.nodes = {}
        this.nodeMap = {}
        this.updateSiteFiles()
      },
      currentSiteFiles () {
        this.buildTree()
      },
      navigationVisible (value) {
        if (value) {
          this.focus()
        }
      }
    },
    mounted () {
      const meta = { Cmd: 'meta', Ctrl: 'ctrl' }[this.meta]
      this.$shortcut.add('reload', ['shift', meta, 'l'])
      this.$shortcut.add('build', ['shift', meta, 'e'])

      this.autoSelectSite()
    },
    destroyed () {
      const meta = { Cmd: 'meta', Ctrl: 'ctrl' }[this.meta]
      this.$shortcut.add('reload', ['shift', meta, 'l'])
      this.$shortcut.add('build', ['shift', meta, 'e'])
    },
    methods: {
      focus () {
        if (this.lastFocus) {
          this.lastFocus.focus()
        } else if (this.$refs.contentSection.isActive) {
          this.$refs.contentTree.$el.focus()
        } else if (this.$refs.themeSection.isActive) {
          this.$refs.themeTree.$el.focus()
        } else {
          this.$refs.contentSection.focus()
        }
      },
      autoSelectSite () {
        this.currentSiteId = this.sites.length ? this.sites[0].siteId : null
      },
      setCurrentSiteId (siteId) {
        const { editorItem: item } = this
        if (item && item.siteId !== siteId) {
          this.$pelicide.editorSave()
            .then(() => {
              this.setEditorItem(null)
              this.currentSiteId = siteId
            })
            .catch(e => this.setError(e.message))
        } else {
          this.currentSiteId = siteId
        }
      },
      updateSiteFiles () {
        const { currentSiteId } = this
        if (currentSiteId) {
          this.$api.listSiteFiles(currentSiteId)
            .then(files => {
              if (this.currentSiteId === currentSiteId) {
                this.currentSiteFiles = files
              }
            })
            .catch(e => {
              this.setError(e.message)
              this.currentSiteFiles = {}
            })
        } else {
          this.currentSiteFiles = {}
        }
      },
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
                  (this.currentSiteFiles.content || []).filter(itemFilter),
                  pathGetter
                )
              }))
            },
            {
              anchor: 'theme',
              factory: buildTree => buildTree(
                'theme',
                this.currentSiteFiles.theme || [],
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
          this.nodeMap[anchor] || {}
        )
        const nodeId = parent[item.name]
        return nodeId !== undefined ? nodeId : null
      },
      activate (node) {
        if (node && node.item) {
          this.setEditorItem(node.item)
        }
        this.setNavigationVisible(false)
      },
      reload () {
        this.updateSiteFiles()
      },
      build () {
        this.building = true
        this.$pelicide.editorSave()
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
        'setError',
        'setEditorItem',
        'setNavigationVisible'
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
