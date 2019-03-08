import { VBtn, VIcon } from 'vuetify/lib'
import { mapState } from 'vuex'
import TooltipMixin from './tooltip-mixin'

export default {
  mixins: [TooltipMixin],
  props: {
    icon: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapState(['toolbarStyle'])
  },
  methods: {
    genContent (h, on) {
      const small = this.toolbarStyle === 'tiny'

      const icon = h(VIcon, { props: { small } }, [this.icon])

      return h(VBtn, {
        class: 'mx-1',
        on: { ...this.$listeners, ...on },
        props: {
          small,
          icon: true,
          disabled: this.disabled
        }
      }, [icon])
    }
  }
}
