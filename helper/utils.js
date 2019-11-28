const fs = require('fs')

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

module.exports = {
  throttle,
  isDirectory
}
