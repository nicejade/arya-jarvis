const os = require('os')
const chalk = require('chalk')
const qrcode = require('qrcode')

const clear = require('./clear')
const print = require('./print')
const platform = process.platform

const checkPort = port => {
  let commandStr
  if (platform === 'darwin' || platform === 'linux') {
    commandStr = `lsof -i tcp:${port}`
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
        localIpAdress = alias.address
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
  const defaultPath = '"**/**/*.{js,vue,ux,less,scss,css,json,md,html,qxml,wxml}"'
  const isUseDefalut = path === '.' || path === '*' || path === './'
  return (isUseDefalut && defaultPath) || path
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

const saveQrcode2Local = string => {
  const filename = `arya-qrcode-${getDate()}.png`
  qrcode.toFile(
    filename,
    string,
    {
      width: 300,
      height: 300,
      color: {
        dark: '#000000ff',
        light: '#0000'
      }
    },
    err => {
      if (err) throw err
      print(`success`, '✓ Okay, Has successfully generate & save your qrcode.')
    }
  )
}

module.exports = {
  clear,
  checkPort,
  getPrettify,
  getDate,
  getIp,
  print,
  saveQrcode2Local,
  showServerAdress
}
