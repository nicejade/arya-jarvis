const path = require('path')
const qrcode = require('qrcode')

const print = require('./print')

const saveQrcode2Loval = (string, commands) => {
  const filename = path.join(process.cwd(), `${string}.png`)
  qrcode.toFile(
    filename,
    string,
    {
      width: commands.width || 300,
      height: commands.width || 300
    },
    err => {
      if (err) throw err
      print(`success`, '✓ Okay, Has successfully generate & save your qrcode.')
    }
  )
}

module.exports = (string, commands) => {
  qrcode.toString(string, { type: 'terminal', small: true, width: 200}, (err, url) => {
    if (err) return print('error', `✘ ${err}`)
    console.log(url)
  })
  if (commands && commands.save) saveQrcode2Loval(string, commands)
}
