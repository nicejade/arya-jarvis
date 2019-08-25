const chalk = require('chalk')

const colorMapping = {
  normal: 'cyan',
  success: 'green',
  warn: 'yellow',
  error: 'red'
}

module.exports = (type, args) => {
  if (typeof args === 'object') {
    return console.log(chalk[colorMapping[type]](...args))
  }
  const color = colorMapping[type] || 'white'
  console.log(chalk[color](args))
}
