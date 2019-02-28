import Vue from 'vue'

export default {
  install (vue) {
    vue.prototype.$pelicide = new Vue({
      data () {
        return {
          editors: []
        }
      },
      methods: {
        registerEditor (component) {
          this.editors.push(component)
        }
      }
    })
  }
}
