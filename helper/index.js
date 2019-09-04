const os = require('os')
const chalk = require('chalk')
const qrcode = require('qrcode')

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

const getPrettify = (path = '.') => {
  const defaultPath = '"**/**/*.{js,vue,ux,less,scss,css,json,md,html,qxml,wxml}"'
  const isUseDefalut = path === '.' || path === '*' || path === './'
  return (isUseDefalut && defaultPath) || path
}

const showServerAdress = port => {
  const hostname = chalk.magenta(`http://${os.hostname}:${port}`)
  const ipAdress = chalk.magenta(`http://${getIp()}:${port}`)
  const localAdress = chalk.magenta(`http://127.0.0.1:${port}`)
  qrcode.toString(`http://${getIp()}:${port}`, { type: 'terminal' }, (err, url) => {
    console.log(url)
  })
  console.log(`\nListening on：\n✓ ${hostname} \n✓ ${ipAdress} \n✓ ${localAdress}`)
}

module.exports = {
  checkPort,
  getPrettify,
  getIp,
  print,
  showServerAdress
}
