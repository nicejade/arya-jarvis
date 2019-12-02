const fs = require('fs')
const path = require('path')
const jimp = require('jimp')

const { isDirectory, getFileNameByUrl } = require('./utils')

const isSupportedFormat = string => {
  const supportedFormatArr = ['.bmp', '.gif', '.jpeg', '.jpg', '.png', '.tiff']
  return supportedFormatArr.some(item => {
    return string.endsWith(item)
  })
}

const greyscale = (filedir, filename, isOnlineUrl = false) => {
  let imagePath
  if (isOnlineUrl) {
    imagePath = filename
    filename = getFileNameByUrl(filename)
  } else {
    imagePath = path.join(filedir, filename)
    if (isDirectory(imagePath)) {
      return Promise.reject(`⚠️ warning:「${imagePath}」not an image file.`)
    }
    if (!isSupportedFormat(imagePath)) {
      return Promise.reject(`⚠️ warning:「${imagePath}」not an supported image types.`)
    }
  }

  const greyImgPath = path.join(filedir, 'arya-greyscale-imgs')
  const isExists = fs.existsSync(greyImgPath)
  if (!isExists) {
    fs.mkdirSync(greyImgPath)
  }
  return jimp
    .read(imagePath)
    .then(image => {
      return image
        .quality(100)
        .greyscale()
        .write(path.join(greyImgPath, filename))
    })
    .catch(err => {
      !isExists && fs.rmdirSync(greyImgPath)
      console.error(err)
    })
}

module.exports = {
  greyscale
}
