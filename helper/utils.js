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

module.exports = {
  throttle
}
