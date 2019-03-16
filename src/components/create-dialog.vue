<template>
  <v-dialog
    :value="visible"
    max-width="600px"
  >
    <v-form @submit="create">
      <v-card>
        <v-card-title>
          <span class="headline">{{ label }}</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field
                  ref="title"
                  v-model="title"
                  :label="template && { article: 'Article title*', page: 'Page title*'}[template.type]"
                  required
                />
              </v-flex>
              <v-flex
                xs12
                sm8
              >
                <v-combobox
                  v-model="category"
                  :items="categories"
                  label="Category"
                />
              </v-flex>
              <v-flex
                xs12
                sm4
              >
                <v-select
                  v-model="status"
                  :items="statuses"
                  label="Status"
                />
              </v-flex>
              <v-flex
                xs12
                sm8
              >
                <v-combobox
                  v-model="createIn"
                  :items="locations"
                  label="Create in"
                />
              </v-flex>
              <v-flex
                xs12
                sm4
              >
                <v-select
                  v-model="extension"
                  :items="extensions"
                  label="Extension"
                />
              </v-flex>
              <v-flex
                xs12
              >
                <v-text-field
                  v-model="author"
                  label="Author"
                />
              </v-flex>
            </v-layout>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="blue darken-1"
            flat
            @click="cancel"
          >
            Cancel
          </v-btn>
          <v-btn
            type="submit"
            color="blue darken-1"
            flat
            @click="create"
          >
            Create
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
  import { mapActions, mapGetters, mapState } from 'vuex'

  export default {
    data () {
      return {
        siteId: null,
        categories: [],
        template: null,
        visible: false,
        actions: null,
        title: '',
        category: '',
        status: '',
        createIn: '',
        extension: '',
        author: this.authorName
      }
    },
    computed: {
      currentSite () {
        return this.sitesById[this.siteId]
      },
      label () {
        return this.template ? `Create ${this.template.type}` : 'Create something'
      },
      statuses () {
        return this.template && this.template.type === 'page'
          ? ['draft', 'published', 'hidden']
          : ['draft', 'published']
      },
      locations () {
        const locations = (this.template && this.currentSite)
          ? this.currentSite[{ article: 'articles', page: 'pages' }[this.template.type]].map(path => path.join('/'))
          : null
        return locations || ['']
      },
      extensions () {
        return this.template && this.template.extensions
      },
      ...mapState(['authorName']),
      ...mapGetters(['sitesById'])
    },
    watch: {
      siteId (siteId) {
        const { template } = this
        if (template && siteId) {
          this.$api.listSiteFiles(siteId)
            .then(files => {
              if (this.siteId === siteId && files.content) {
                const contentType = {
                  article: 'pelican.contents.Article',
                  page: 'pelican.contents.Page'
                }[template.type]

                const categories = new Set()
                files.content.forEach(file => {
                  if (file.type === contentType && file.meta && file.meta.category) {
                    categories.add(file.meta.category)
                  }
                })
                this.categories = Array.from(categories)
              } else {
                this.categories = []
              }
            })
            .catch(e => {
              this.setError(e.message)
              this.categories = []
            })
        }
      },
      visible (visible) {
        if (visible) {
          this.$nextTick(() => this.$refs.title.focus())
        }
      }
    },
    methods: {
      show (siteId, template) {
        this.siteId = siteId
        this.template = template
        this.visible = true
        this.title = ''
        this.category = ''
        this.status = this.statuses[0]
        this.createIn = this.locations[0]
        this.extension = template.extensions[0]
        return new Promise((resolve, reject) => {
          this.actions = { resolve, reject }
        })
      },
      create (e) {
        e.preventDefault()

        const {
          siteId,
          title,
          createIn,
          extension,
          status,
          author,
          category,
          actions: { resolve },
          template: { anchor, template: factory }
        } = this
        this.setAuthorName(author)
        this.$api.slugify(siteId, title)
          .then(({ slug }) => {
            resolve({
              siteId,
              anchor,
              path: createIn ? createIn.split('/') : [],
              name: `${slug}.${extension}`,
              content: factory({
                title: title,
                status: status,
                author: author,
                category: category,
                slug: slug
              })
            })
            this.visible = false
          })
          .catch(e => this.setError({ text: `Failed to slugify title: ${e.message}` }))
      },
      cancel () {
        this.visible = false
        this.actions.reject()
      },
      ...mapActions([
        'setError',
        'setAuthorName'
      ])
    }
  }
</script>
