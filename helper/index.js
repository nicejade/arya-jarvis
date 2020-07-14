const fs = require('fs')
const os = require('os')
const path = require('path')
const chalk = require('chalk')
const qrcode = require('qrcode')

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
  qrcode.toString(`${protocol}://${getIp()}:${port}`, { type: 'terminal' }, (err, url) => {
    console.log(url)
  })
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
  showServerAdress
}
