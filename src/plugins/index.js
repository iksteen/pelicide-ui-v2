import Vue from 'vue'

export default {
  install (vue) {
    vue.prototype.$pelicide = new Vue({
      data () {
        return {
          editors: {},
          templates: []
        }
      },
      computed: {
        mac () {
          return /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform)
        },
        meta () {
          return this.mac ? 'Cmd' : 'Ctrl'
        }
      },
      methods: {
        registerEditor (contentTypes, icon, component) {
          contentTypes.forEach(contentType => {
            this.editors[contentType] = {
              icon,
              component
            }
          })
        },
        registerTemplate (template) {
          this.templates.push(template)
        },
        editorSave () {
          return new Promise((resolve, reject) => {
            this.$emit('editor-save', { resolve, reject })
          })
        },
        previewRenderReload () {
          this.$emit('preview-render-reload')
        }
      }
    })
  }
}
