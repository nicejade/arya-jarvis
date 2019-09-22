const fs = require('fs')
const opn = require('opn')
const marked = require('marked')
const Koa = require('koa')
const watch = require('gulp-watch')

const print = require('./print')
const { throttle } = require('./utils')

const markdownCss = require('../assets/style/markdown.js')
const HTML_CONF = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8"/>
    <title>Marked in the browser</title>
    <link rel="icon" href="https://arya.lovejade.cn/icon/favicon.ico">
    <link rel="icon" type="image/png" sizes="32x32" href="https://arya.lovejade.cn/icon/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="https://arya.lovejade.cn/icon/favicon-16x16.png">
  </head>
  <style>${markdownCss}</style>
  <body>
    <div id="app" class="markdown-body">#CONTENT#</div>
  </body>
  <script src="https://cdn.jsdelivr.net/npm/socket.io-client@2/dist/socket.io.js"></script>
  <script>
    var socket = io('http://localhost:#PORT#')
    socket.onopen = function () {
      ws.send('arya jarvis!')
    }
    socket.on('connect', function(){})
    socket.on('refresh-content', function(data){
      document.querySelector('html').innerHTML = data
    })
    socket.on('disconnect', function(){
      socket.close()
    })
    socket.onclose = function(evt) {
      console.log("Connection closed.")
    }
  </script>
</html>`

let app = new Koa()
let server
let socketio
let targetWebPath
let isCreatedServer = false

const createServer = (content, port, isWatchChange) => {
  server = require('http').createServer(app.callback())
  app.use(ctx => {
    ctx.body = content
  })
  if (isWatchChange) createWebsocket(server)

  targetWebPath = `http://localhost:${port}`
  server.listen(port, () => {
    print(`success`, `Listening on ${targetWebPath}`)
  })
  opn(targetWebPath)
}

const createWebsocket = server => {
  socketio = require('socket.io')(server)
  socketio.on('connection', socket => {
    print('normal', '💍 Welcome to use arya to preview Md.')
  })
}

const readFile2update = (mdFilePath, port, isWatch) => {
  fs.readFile(mdFilePath, (err, data) => {
    if (err) return print(`error`, err)
    const content = marked(data.toString(), {})
    const body = HTML_CONF.replace(`#CONTENT#`, content).replace('#PORT#', port)
    if (!isCreatedServer) {
      isCreatedServer = true
      createServer(body, port, isWatch)
    }
    if (isWatch) {
      socketio.emit(`refresh-content`, body)
    }
  })
}

const previewMarkdown = (mdFilePath, port, isWatch) => {
  readFile2update(mdFilePath, port, isWatch)
  if (isWatch) {
    const callback = throttle(() => {
      readFile2update(mdFilePath, port, isWatch)
    }, 1000)
    watch(mdFilePath, callback)
  }
}

module.exports = {
  previewMarkdown
}
