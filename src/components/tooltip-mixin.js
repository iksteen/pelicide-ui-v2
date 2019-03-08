import { VTooltip } from 'vuetify/lib/components/VTooltip'

export default {
  props: {
    tooltip: {
      type: String,
      required: false
    }
  },
  render (h) {
    if (this.tooltip) {
      return h('div', {}, [h(VTooltip, {
        props: {
          bottom: true,
          disabled: !!this.disabled
        },
        scopedSlots: {
          activator: ({ on }) => this.genContent(
            h,
            on
          )
        }
      }, [this.tooltip])])
    } else {
      return this.genContent(h, {})
    }
  }
}
