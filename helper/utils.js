const fs = require('fs')
const url = require('url')

if (typeof String.prototype.endsWith != 'function') {
  String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1
  }
}

const throttle = (func, gapTime) => {
  if (typeof func !== 'function') {
    throw new TypeError('throttle first param need a function.')
  }
  gapTime = +gapTime || 0
  let lastTime = 0

  return () => {
    let time = +new Date()
    if (time - lastTime > gapTime || !lastTime) {
      func()
      lastTime = time
    }
  }
}

const isDirectory = path => {
  const stat = fs.lstatSync(path)
  return stat.isDirectory()
}

const getFileNameByUrl = path => {
  const urlObj = url.parse(path)
  const pathname = urlObj.pathname
  const hostname = urlObj.hostname
  const pathArr = pathname.split('/')
  return hostname + '@' + pathArr[pathArr.length - 1]
}

module.exports = {
  isDirectory,
  getFileNameByUrl,
  throttle
}
