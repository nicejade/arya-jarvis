const fs = require('fs')
const os = require('os')
const path = require('path')
const chalk = require('chalk')
const clear = require('./clear')
const print = require('./print')
const generateQrcode = require('./qrcode')
const { isDirectory } = require('./utils')
const { addShadowForImg, greyscale, sepiawash } = require('./image')
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
  for (var dev in interfaces) {
    // ... and find the one that matches the criteria
    var iface = interfaces[dev].filter(function(details) {
      return details.family === 'IPv4' && details.internal === false
    })
    if (iface.length > 0) localIpAdress = iface[0].address
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
 * @desc add shadow for your images.
 * @param {String} spath specified path
 */
const makeImgAddShadow = (spath = '') => {
  if (isDirectory(spath)) {
    fs.readdir(spath, (err, files) => {
      if (err) return print(`error`, `✘ Opps, Something Error: ${err}`)
      files.forEach(async filename => {
        await addShadowForImg(spath, filename)
      })
    })
    return
  }
  print('warn', `✘ Please enter the specified directory address.`)
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
  generateQrcode(`${protocol}://${getIp()}:${port}`)
  console.log(`\nListening on：\n✓ ${hostname} \n✓ ${ipAdress} \n✓ ${localAdress}`)
}

const _renameAllFiles = (spath, commands, namePrefix) => {
  return new Promise((resolve, reject) => {
    try {
      let initialNum = +commands.initial || 0
      const separator = commands.separator || '-'
      let digits = +commands.digits || 3
      digits = digits < 0 ? 0 : digits
      fs.readdir(spath, (err, files) => {
        if (err) return print(`error`, `✘ Opps, Something Error: ${err}`)
        files.forEach(filename => {
          // 摒除隐藏文件（即以'.'打头的文件）；
          if (filename[0] === '.') return false

          const tempNameArr = filename.split('.')
          const fileType = tempNameArr[tempNameArr.length - 1]
          const nameSuffix = `${++initialNum - 1}`.padStart(digits, '0')
          const newFileName = `${namePrefix}${separator}${nameSuffix}.${fileType}`
          if (newFileName === filename) return false

          const oldPath = path.join(spath, filename)
          const newPath = path.join(spath, newFileName)
          fs.renameSync(oldPath, newPath)
        })
        resolve(true)
      })
    } catch (err) {
      console.error(`Something Error @renameBatchFiles: ${err}`)
      reject(err)
    }
  })
}

const renameBatchFiles = async (spath, commands) => {
  const isExists = fs.existsSync(spath)
  if (!isExists) {
    return print('warn', `✘ The path you specified does not exist.`)
  }
  if (isDirectory(spath)) {
    const specificPrefix = '_ARYA-SPECIFIC-PREFIX_'
    await _renameAllFiles(spath, commands, specificPrefix)

    const appointedPrefix = commands.name || 'arya-javis'
    await _renameAllFiles(spath, commands, appointedPrefix)
    return print(`success`, '✓ Has been successfully renamed for you in bulk.')
  } else {
    return print('warn', `✘ The expected path is a folder directory.`)
  }
}

const generatePassword = (length = 8, special = true) => {
  // 定义字符集
  const lowercase = 'abcdefghijklmnopqrstuvwxyz'
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const numbers = '0123456789'
  const specials = special ? '!@#$%^&*()_+-=[]{}|;:,.<>?' : ''

  // 确保密码长度至少为 8 位
  const finalLength = Math.max(8, length)

  // 确保每种字符都至少使用一次
  let password = [
    lowercase[Math.floor(Math.random() * lowercase.length)],
    uppercase[Math.floor(Math.random() * uppercase.length)],
    numbers[Math.floor(Math.random() * numbers.length)],
    specials[Math.floor(Math.random() * specials.length)]
  ]

  // 合并所有可用字符
  const allChars = lowercase + uppercase + numbers + specials

  // 填充剩余长度
  while (password.length < finalLength) {
    password.push(allChars[Math.floor(Math.random() * allChars.length)])
  }

  // 打乱数组顺序
  return password.sort(() => Math.random() - 0.5).join('')
}

module.exports = {
  clear,
  checkPort,
  getPrettify,
  getPrettifyOptions,
  getDate,
  getIp,
  makeImgGreyscale,
  makeImgAddShadow,
  sepiaWashForImg,
  previewMarkdown,
  print,
  generateQrcode,
  renameBatchFiles,
  showServerAdress,
  generatePassword
}
