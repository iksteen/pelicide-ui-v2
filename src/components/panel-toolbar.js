import { VToolbar } from 'vuetify/lib'
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState(['toolbarStyle'])
  },
  render (h) {
    return h(VToolbar, {
      props: {
        flat: true,
        dense: this.toolbarStyle === 'small',
        height: this.toolbarStyle === 'tiny' ? '40px' : null
      }
    }, this.$slots.default)
  }
}
