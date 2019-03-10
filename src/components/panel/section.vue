<template>
  <div
    class="panel-section"
    :class="classes"
  >
    <div
      class="panel-section__header"
      tabindex="0"
      @keyup.space="toggle"
      @keyup.enter="toggle"
    >
      <div class="panel-section__header__title">
        <slot name="title" />
      </div>
      <div
        class="panel-section__header__activator"
        @click="toggle"
      >
        <slot name="activator">
          <div class="panel-section__header__icon">
            <v-icon v-text="icon" />
          </div>
        </slot>
      </div>
    </div>
    <v-expand-transition>
      <div
        v-show="isActive"
        class="panel-section__content"
      >
        <slot />
      </div>
    </v-expand-transition>
  </div>
</template>

<style lang="stylus">
  @import '~vuetify/src/stylus/bootstrap'
  @import '~vuetify/src/stylus/theme'

  panel-section($material)
    .panel-section__header
      background-color: $material.app-bar
      color: $material.text.primary

    .panel-section__header__icon
      .v-icon
        color: $material.icons.active

  theme(panel-section, "panel-section")

  .panel-section
    display flex
    flex-direction column
    flex 0 0 auto
    min-height 0

    &--active
      flex 0 1 100%
      > .panel-section__header
        .panel-section__header__icon .v-icon
          transform rotate(-180deg)

    &__header
      flex 0 0 auto
      display flex
      padding 8px 0
      align-items center

      &__title
        flex 1 1 auto
        padding 0 0 0 8px

      &__activator
        padding 0 16px

    &__content
      flex 1 1 auto
      overflow: auto
</style>

<script>
  import Themeable from 'vuetify/lib/mixins/themeable'

  export default {
    mixins: [Themeable],
    model: {
      prop: 'active',
      event: 'change'
    },
    props: {
      active: {
        type: Boolean,
        default: false
      },
      icon: {
        type: String,
        default: 'mdi-chevron-down'
      }
    },
    data () {
      return {
        isActive: this.active
      }
    },
    computed: {
      classes () {
        return {
          'panel-section--active': this.isActive,
          ...this.themeClasses
        }
      }
    },
    watch: {
      active (val) {
        this.isActive = val
      }
    },
    methods: {
      toggle () {
        this.isActive = !this.isActive
        this.$emit('change', this.isActive)
      }
    }
  }
</script>
