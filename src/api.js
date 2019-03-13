import Vue from 'vue'
import { mapActions } from 'vuex'
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
          return this.invoke('list_sites').then(
            sites => sites.map(
              ({
                site_id: siteId,
                name,
                formats,
                content,
                pages,
                articles,
                theme
              }) => ({
                siteId,
                name,
                formats,
                content,
                pages,
                articles,
                theme
              })
            )
          )
        },
        listSiteFiles (siteId) {
          return this.invoke('list_site_files', { site_id: siteId })
            .then(result => {
              return ['content', 'theme'].reduce((result, anchor) => {
                result[anchor] = result[anchor].map(item => ({
                  ...item,
                  anchor,
                  siteId
                }))
                return result
              }, result)
            })
        },
        getFileContent (siteId, anchor, path, name) {
          return this.invoke('get_file_content', {
            site_id: siteId,
            anchor,
            path,
            name
          })
        },
        putFileContent (siteId, anchor, path, name, content) {
          return this.invoke('put_file_content', {
            site_id: siteId,
            anchor,
            path,
            name,
            content
          })
        },
        render (siteId, format, content) {
          return this.invoke('render', {
            site_id: siteId,
            format,
            content
          })
        },
        build (siteId, paths = null) {
          return this.invoke('build', {
            site_id: siteId,
            paths: paths
          })
        },
        ...mapActions(['setSites'])
      },
      sockets: {
        onopen () {
          this.listSites().then(sites => {
            this.setSites(sites)
            this.ready = true
          })
        },
        onclose (event) {
          this.ready = false
          Object.values(this.pending).forEach(p => p.reject(new Error('Socket disconnected')))
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
