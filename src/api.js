import Vue from 'vue'
import { mapActions, mapGetters, mapState } from 'vuex'
import VueNativeWebsocket from 'vue-native-websocket'

export default {
  install (vue, { store }) {
    const { protocol, hostname, port } = location
    const wsProtocol = protocol === 'http:' ? 'ws' : 'wss'
    vue.use(
      VueNativeWebsocket,
      `${wsProtocol}://${hostname}:${port}/service`,
      {
        reconnection: true,
        reconnectionDelay: 3000,
        format: 'json'
      }
    )

    vue.prototype.$api = new Vue({
      store,
      data () {
        return {
          ready: false,
          requestId: 0,
          pending: {}
        }
      },
      computed: {
        ...mapGetters(['sitesById']),
        ...mapState(['sites', 'currentSiteId'])
      },
      watch: {
        sites (sites) {
          if (this.currentSiteId === null) {
            this.autoSelectSite()
          }
        },
        currentSiteId (siteId) {
          if (siteId === null) {
            this.autoSelectSite()
            return
          }
          this.listSiteFiles(siteId).then(files => {
            this.setSiteFiles(files)
            this.ready = true
          })
        }
      },
      methods: {
        invoke (method, params = null) {
          return new Promise((resolve, reject) => {
            const id = this.requestId++
            this.pending[id] = { resolve, reject }

            this.$socket.sendObj({
              jsonrpc: '2.0',
              method,
              params,
              id
            })
          })
        },
        listSites () {
          return this.invoke('list_sites')
        },
        listSiteFiles (id) {
          return this.invoke('list_site_files', { id })
        },
        autoSelectSite () {
          if (this.sites.length) {
            this.setCurrentSiteId(this.sites[0].id)
          }
        },
        getFileContent (siteId, anchor, path, name) {
          return this.invoke('get_file_content', {
            site_id: siteId,
            anchor,
            path,
            name
          })
        },
        ...mapActions(['setSites', 'setCurrentSiteId', 'setSiteFiles'])
      },
      sockets: {
        onopen () {
          this.listSites().then(sites => this.setSites(sites))
        },
        onclose (event) {
          this.ready = false
          Object.values(this.pending).forEach(p => p.reject('Socket disconnected'))
        },
        onmessage ({ data }) {
          const { jsonrpc, id, result, error } = JSON.parse(data)

          if (jsonrpc !== '2.0' || (result === undefined && error === undefined)) {
            console.error('Received invalid JSON-RPC response:', data)
          } else if (id === undefined || id === null) {
            console.warn('Received broadcast message:', data)
          } else {
            const handler = this.pending[id]
            delete this.pending[id]
            if (handler === undefined) {
              console.warn('Received unsollicited response:', data)
            } else if (result !== undefined) {
              handler.resolve(result)
            } else {
              handler.reject(error)
            }
          }
        }
      }
    })
  }
}
