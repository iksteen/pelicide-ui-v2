import Vue from 'vue'

export default {
  install (vue) {
    const fs = new Vue({
      data () {
        return {
          isFullscreen: this.getIsFullscreen()
        }
      },
      methods: {
        getIsFullscreen () {
          const docEl = document.documentElement
          if (docEl.requestFullscreen) {
            return !!document.fullscreenElement
          } else if (docEl.mozFullScreen) {
            return !!document.mozRequestFullScreen
          } else if (docEl.webkitRequestFullScren) {
            return !!document.webkitIsFullScreen
          } else if (docEl.msRequestFullscreen) {
            return !!document.msFullscreenElement
          } else {
            return false
          }
        },
        enterFullscreen () {
          const docEl = document.documentElement
          const requestFullscreen = (
            docEl.requestFullscreen ||
              docEl.mozRequestFullScreen ||
              docEl.webkitRequestFullScreen ||
              docEl.msRequestFullscreen ||
              null
          )
          if (requestFullscreen !== null) {
            return requestFullscreen.apply(docEl)
          }
        },
        exitFullscreen () {
          const exitFullscreen = (
            document.exitFullscreen ||
              document.mozCancelFullScreen ||
              document.webkitCancelFullScreen ||
              document.msExitFullscreen ||
              null
          )
          if (exitFullscreen !== null) {
            exitFullscreen.apply(document)
          }
        },
        toggleFullscreen () {
          return (!this.isFullscreen) ? this.enterFullscreen() : this.exitFullscreen()
        }
      }
    })

    vue.prototype.$fullscreen = fs;

    [
      'fullscreenchange',
      'mozfullscreenchange',
      'webkitfullscreenchange',
      'msfullscreenchange'
    ].forEach(eventName => {
      document.addEventListener(eventName, function () {
        fs.isFullscreen = fs.getIsFullscreen()
      }, false)
    })
  }
}
