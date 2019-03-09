import Vue from 'vue'

export default {
  install (vue) {
    vue.prototype.$pelicide = new Vue({
      data () {
        return {
          editors: {}
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
        openInEditor (item) {
          this.$emit('editor-open', item)
        }
      }
    })
  }
}
