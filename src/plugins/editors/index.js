import Vue from 'vue'

export default {
  install (vue) {
    vue.prototype.$pelicide = new Vue({
      data () {
        return {
          editors: {}
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
          this.$emit('open-in-editor', item)
        }
      }
    })
  }
}
