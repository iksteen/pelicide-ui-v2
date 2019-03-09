import { VTooltip } from 'vuetify/lib/components/VTooltip'

export function renderTooltip (h, tooltip, options, factory) {
  return h(VTooltip, {
    props: {
      bottom: true,
      openDelay: 500,
      hideDelay: 100,
      ...options
    },
    scopedSlots: {
      activator: ({ on }) => factory(h, on)
    }
  }, [tooltip])
}

export default {
  props: {
    tooltip: {
      type: String,
      required: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    genContent (h, on) {
      return h('div', { on })
    }
  },
  render (h) {
    if (this.tooltip) {
      return h('div', {}, [renderTooltip(h, this.tooltip, { disabled: !!this.disabled }, this.genContent)])
    } else {
      return this.genContent(h, {})
    }
  }
}
