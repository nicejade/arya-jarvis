const fs = require('fs')
const path = require('path')
const { exec } = require('child_process')
let jimp = require('jimp')

const print = require('./print')
/*
  const configure = require('@jimp/custom')
  const shadow = require('@jimp/plugin-shadow')
  const types = require('@jimp/types')
  jimp = configure({ plugins: [gaussian], types: [types] }, jimp)
*/

const { isDirectory, getFileNameByUrl } = require('./utils')

const _isSupportedFormat = string => {
  const supportedFormatArr = ['.bmp', '.gif', '.jpeg', '.jpg', '.png', '.tiff']
  return supportedFormatArr.some(item => {
    return string.endsWith(item)
  })
}

const _clumpIimpParams = (filedir, filename, isOnlineUrl = false) => {
  let imagePath
  let newFileName
  if (isOnlineUrl) {
    imagePath = filename
    newFileName = getFileNameByUrl(filename)
  } else {
    imagePath = path.join(filedir, filename)
    newFileName = filename
  }
  return { imagePath, newFileName }
}

const _checkAndMkdir = dirname => {
  const isExists = fs.existsSync(dirname)
  if (!isExists) {
    fs.mkdirSync(dirname)
  }
  return isExists
}

/**
 * @desc 为指定的图片添加阴影；
 * @param {*} filedir - 指定的图片目录
 * @param {*} filename - 目录下的图片文件名
 */
const addShadowForImg = async (filedir, filename) => {
  const { imagePath } = _clumpIimpParams(filedir, filename)
  if (!_isSupportedFormat(imagePath)) {
    return print(`warn`, `⚠️ warning:「${imagePath}」not an supported image types.`)
  }
  const shadowImgDir = path.join(filedir, 'shadow')
  _checkAndMkdir(shadowImgDir)
  
  const shadowImgPath = path.join(shadowImgDir, filename)
  return new Promise((relove, reject) => {
    const ccStr = `convert ${imagePath} '(' +clone -background black -shadow 30x30+0+0 ')' +swap -background none -layers merge +repage ${shadowImgPath}`
    exec(ccStr, (error, stdout, stderr) => {
      if (error) {
        print(`error`, `✘ Opps, Something Error: ${error}`)
        return reject(error)
      }
      relove(true)
    })
  })
}

const greyscale = async (filedir, filename, isOnlineUrl = false) => {
  const { imagePath, newFileName } = _clumpIimpParams(filedir, filename, isOnlineUrl)
  if (!isOnlineUrl) {
    if (isDirectory(imagePath)) {
      return print(`warn`, `⚠️ warning:「${imagePath}」not an image file.`)
    }
    if (!_isSupportedFormat(imagePath)) {
      return print(`warn`, `⚠️ warning:「${imagePath}」not an supported image types.`)
    }
  }
  const greyImgPath = path.join(filedir, 'arya-greyscale-imgs')
  const isExists = _checkAndMkdir(greyImgPath)
  try {
    const image = await jimp.read(imagePath)
    image
      .quality(100)
      .greyscale()
      .write(path.join(greyImgPath, newFileName))
    print(`success`, '✓ Okay, Already successful grayscale picture.')
  } catch (err) {
    !isExists && fs.rmdirSync(greyImgPath)
    print(`warn`, err.message)
  }
}

const sepiawash = async (filedir, filename, isOnlineUrl = false) => {
  const { imagePath, newFileName } = _clumpIimpParams(filedir, filename, isOnlineUrl)
  if (!isOnlineUrl) {
    if (isDirectory(imagePath)) {
      return print(`warn`, `⚠️ warning:「${imagePath}」not an image file.`)
    }
    if (!_isSupportedFormat(imagePath)) {
      return print(`warn`, `⚠️ warning:「${imagePath}」not an supported image types.`)
    }
  }
  const shadowImgPath = path.join(filedir, 'arya-shadow-imgs')
  const isExists = _checkAndMkdir(shadowImgPath)
  try {
    const image = await jimp.read(imagePath)
    image.sepia().write(path.join(shadowImgPath, newFileName))
    print(`success`, '✓ Okay, Already successful apply a sepia wash to the image.')
  } catch (err) {
    !isExists && fs.rmdirSync(shadowImgPath)
    print(`warn`, err.message)
  }
}

module.exports = {
  addShadowForImg,
  greyscale,
  sepiawash
}
