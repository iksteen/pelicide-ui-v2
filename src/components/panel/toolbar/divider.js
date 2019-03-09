import { VDivider } from 'vuetify/lib'

export default {
  functional: true,
  render (h) {
    return h(VDivider, { props: { vertical: true }, class: 'mx-2' })
  }
}
