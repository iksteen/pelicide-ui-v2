import { mapState } from 'vuex'
import { VBtn, VIcon, VBtnToggle } from 'vuetify/lib'
import TooltipMixin from './tooltip-mixin'

export default {
  mixins: [TooltipMixin],
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapState(['toolbarStyle'])
  },
  methods: {
    change (value) {
      this.$emit('change', !!value)
    },
    genContent (h, on) {
      const small = this.toolbarStyle === 'tiny'

      const icon = h(VIcon, { props: { small } }, [this.icon])

      const button = h(VBtn, {
        props: {
          small,
          icon: true,
          value: true
        },
        class: 'mx-1',
        on
      }, [icon])

      return h(VBtnToggle, {
        props: {
          value: this.value
        },
        class: 'transparent',
        on: { change: this.change }
      }, [button])
    }
  }
}
