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
console.log(localIpAdress)
