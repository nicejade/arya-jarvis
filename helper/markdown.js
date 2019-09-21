const fs = require('fs')
const opn = require('opn')
const marked = require('marked')

const print = require('./print')
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
</html>`

const createServer = (content, port) => {
  const Koa = require('koa')
  const app = new Koa()
  app.use(ctx => {
    ctx.body = content
  })
  app.listen(port)
}

const previewMarkdown = (mdFilePath, port) => {
  fs.readFile(mdFilePath, (err, data) => {
    if (err) return print(`error`, err)
    const content = marked(data.toString(), {})
    const body = HTML_CONF.replace(`#CONTENT#`, content)
    createServer(body, port)
    const targetWebPath = `http://localhost:${port}`
    opn(targetWebPath)
    print(`success`, `Listening on ${targetWebPath}`)
  })
}

module.exports = {
  previewMarkdown
}
