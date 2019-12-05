const fs = require('fs')
const path = require('path')
let jimp = require('jimp')

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

const greyscale = (filedir, filename, isOnlineUrl = false) => {
  const { imagePath, newFileName } = _clumpIimpParams(filedir, filename, isOnlineUrl)
  if (!isOnlineUrl) {
    if (isDirectory(imagePath)) {
      return Promise.reject(`⚠️ warning:「${imagePath}」not an image file.`)
    }
    if (!_isSupportedFormat(imagePath)) {
      return Promise.reject(`⚠️ warning:「${imagePath}」not an supported image types.`)
    }
  }
  const greyImgPath = path.join(filedir, 'arya-greyscale-imgs')
  const isExists = _checkAndMkdir(greyImgPath)
  return jimp
    .read(imagePath)
    .then(image => {
      return image
        .quality(100)
        .greyscale()
        .write(path.join(greyImgPath, newFileName))
    })
    .catch(err => {
      !isExists && fs.rmdirSync(greyImgPath)
      console.error(err)
    })
}

const sepiawash = (filedir, filename, isOnlineUrl = false) => {
  const { imagePath, newFileName } = _clumpIimpParams(filedir, filename, isOnlineUrl)
  if (!isOnlineUrl) {
    if (isDirectory(imagePath)) {
      return Promise.reject(`⚠️ warning:「${imagePath}」not an image file.`)
    }
    if (!_isSupportedFormat(imagePath)) {
      return Promise.reject(`⚠️ warning:「${imagePath}」not an supported image types.`)
    }
  }
  const shadowImgPath = path.join(filedir, 'arya-shadow-imgs')
  const isExists = _checkAndMkdir(shadowImgPath)
  return jimp
    .read(imagePath)
    .then(async image => {
      return image.sepia().write(path.join(shadowImgPath, newFileName))
    })
    .catch(err => {
      !isExists && fs.rmdirSync(shadowImgPath)
      console.error(err)
    })
}

module.exports = {
  greyscale,
  sepiawash
}
