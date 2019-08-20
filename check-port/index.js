const platform = process.platform

module.exports = generateCommand = port => {
  let commandStr
  if (platform === 'darwin' || platform === 'linux') {
    commandStr = `lsof -i tcp:${port}`
  } else if (platform === 'win32' || platform === 'win64') {
    commandStr = `netstat -ano | findstr ${port}`
  }
  return commandStr
}
