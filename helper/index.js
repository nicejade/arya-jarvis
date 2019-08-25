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
  return localIpAdress
}

module.exports = {
  checkPort,
  getIp,
  print
}