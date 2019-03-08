import { VBtnToggle, VBtn } from 'vuetify/lib'
import { mapState } from 'vuex'
import { renderTooltip } from './tooltip-mixin'

export default {
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    options: {
      type: Array,
      default: () => []
    },
    value: {
      type: String,
      default: ''
    },
    mandatory: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState(['toolbarStyle'])
  },
  render (h) {
    const small = this.toolbarStyle === 'tiny'

    function genButton (option, on) {
      return h(VBtn, {
        key: option.value,
        on,
        props: {
          flat: true,
          small,
          value: option.value
        }
      }, [option.label])
    }

    const children = this.options.map(option => {
      if (option.tooltip) {
        return renderTooltip(h, option.tooltip, {}, (h, on) => genButton(option, on))
      } else {
        return genButton(option)
      }
    })

    return h(VBtnToggle, {
      class: 'transparent mx-1',
      on: this.$listeners,
      props: {
        value: this.value,
        mandatory: this.mandatory
      }
    }, children)
  }
}
