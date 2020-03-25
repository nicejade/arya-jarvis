const fs = require('fs')
const os = require('os')
const path = require('path')
const chalk = require('chalk')
const qrcode = require('qrcode')

const clear = require('./clear')
const print = require('./print')
const generateQrcode = require('./qrcode')
const { isDirectory } = require('./utils')
const { greyscale, sepiawash } = require('./image')
const { previewMarkdown } = require('./markdown')

const platform = process.platform

const checkPort = port => {
  let commandStr
  if (platform === 'darwin' || platform === 'linux') {
    commandStr = `sudo lsof -i tcp:${port}`
  } else if (platform === 'win32' || platform === 'win64') {
    commandStr = `netstat -ano | findstr ${port}`
  }
  return commandStr
}

const getIp = () => {
  const interfaces = require('os').networkInterfaces()
  let localIpAdress = ''
  for (let devName in interfaces) {
    let iface = interfaces[devName]
    for (let i = 0, len = iface.length; i < len; i++) {
      let alias = iface[i]
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        localIpAdress += alias.address
      }
    }
  }
  return localIpAdress || 'localhost'
}

const getDate = () => {
  const date = new Date()
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}

const getPrettify = (path = '.') => {
  const defaultPath = '"**/**/*.{js,vue,ux,less,scss,css,json,md,mdx,html,qxml,wxml,yaml,graphql}"'
  const isUseDefalut = path === '.' || path === '*' || path === './'
  return (isUseDefalut && defaultPath) || path
}

const getPrettifyOptions = () => {
  // 分别是：单引号，无分号，打印宽度 100
  return `--single-quote --no-semi --print-width 100`
}

/**
 * @desc make specified path images greyscale
 * @param {String} spath specified path
 */
const makeImgGreyscale = (spath = '') => {
  if (/^https?:\/\//.test(spath)) {
    return greyscale(process.cwd(), spath, true)
  }
  const isExists = fs.existsSync(spath)
  if (!isExists) {
    return print('warn', `✘ The path you specified does not exist.`)
  }
  if (isDirectory(spath)) {
    fs.readdir(spath, (err, files) => {
      if (err) return print(`error`, `✘ Opps, Something Error: ${err}`)
      files.forEach(filename => {
        greyscale(spath, filename)
      })
    })
    return
  }
  greyscale(path.dirname(spath), path.basename(spath))
}

/**
 * @desc Creates a shadow on an image.
 * @param {String} spath specified path
 */
const sepiaWashForImg = (spath = '') => {
  if (/^https?:\/\//.test(spath)) {
    return sepiawash(process.cwd(), spath, true)
  }
  const isExists = fs.existsSync(spath)
  if (!isExists) {
    return print('warn', `✘ The path you specified does not exist.`)
  }
  if (isDirectory(spath)) {
    return fs.readdir(spath, (err, files) => {
      if (err) return print(`error`, `✘ Opps, Something Error: ${err}`)
      files.forEach(filename => {
        sepiawash(spath, filename)
      })
    })
  }
  sepiawash(path.dirname(spath), path.basename(spath))
}

const showServerAdress = (port, protocol) => {
  const hostname = chalk.magenta(`${protocol}://${os.hostname}:${port}`)
  const ipAdress = chalk.magenta(`${protocol}://${getIp()}:${port}`)
  const localAdress = chalk.magenta(`${protocol}://127.0.0.1:${port}`)
  qrcode.toString(`${protocol}://${getIp()}:${port}`, { type: 'terminal' }, (err, url) => {
    console.log(url)
  })
  console.log(`\nListening on：\n✓ ${hostname} \n✓ ${ipAdress} \n✓ ${localAdress}`)
}

module.exports = {
  clear,
  checkPort,
  getPrettify,
  getPrettifyOptions,
  getDate,
  getIp,
  makeImgGreyscale,
  sepiaWashForImg,
  previewMarkdown,
  print,
  generateQrcode,
  showServerAdress
}
