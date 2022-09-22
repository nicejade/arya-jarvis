#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { exec } = require('child_process')
const chalk = require('chalk')
const portfinder = require('portfinder')
const commander = require('commander')
const program = new commander.Command()

const {
  clear,
  checkPort,
  getIp,
  getPrettify,
  getPrettifyOptions,
  makeImgGreyscale,
  makeImgAddShadow,
  sepiaWashForImg,
  previewMarkdown,
  print,
  renameBatchFiles,
  generateQrcode,
  showServerAdress
} = require('./../helper')

const resolve = dir => {
  return path.join(__dirname, '..', dir)
}

const version = require(`./../package.json`).version
program.version(version, '-v, --vers', 'output the current version')

program
  .command('clear')
  .alias('c')
  .description('Clear the terminal screen if possible.')
  .action(() => {
    clear()
  })

program
  .command('img:greyscale <path>')
  .alias('igs')
  .description('greyscale: remove colour from the image.')
  .action(path => {
    makeImgGreyscale(path)
  })

program
  .command('img:shadow  <path>')
  .alias('ishadow')
  .description('shadow: add shadow for your images.')
  .action(path => {
    makeImgAddShadow(path)
  })

program
  .command('img:sepiawash <path>')
  .alias('isw')
  .description('Apply a sepia wash to the image.')
  .action(path => {
    sepiaWashForImg(path)
  })

program
  .command('ip')
  .description('Find your local IP address and print it.')
  .action(() => {
    const localIpAdress = getIp()
    console.log(`内网IP: ${localIpAdress}.（已复制到您的剪切板）`)
    const { Clipboard } = require('@napi-rs/clipboard')
    const clipboard = new Clipboard()
    clipboard.setText(localIpAdress)
    exec(`curl -L tool.lu/ip`, (error, stdout, stderr) => {
      console.log(stdout)
      if (error) return print(`error`, `✘ Opps, Something Error: ${error}`)
    })
  })

program
  .command('ls')
  .alias('l')
  .description('List the script commands in package.json.')
  .action(() => {
    let packageConf
    try {
      packageConf = require(`${process.cwd()}/package.json`)
    } catch (error) {
      const p = chalk.magenta(`package.json`)
      return print('warn', `✘ have not found ${p} under the current directory.`)
    }
    const scriptsConf = packageConf.scripts
    print('success', '✓ Okay, List the script commands in package.json:')
    for (let key in scriptsConf) {
      const colorKey = chalk.magenta(`${key}`)
      print('normal', `${colorKey}: ${scriptsConf[key]}`)
    }
  })

program
  .command('markdown <path>')
  .alias('m')
  .option('-w, --watch', 'Listen for specified file changes and refresh the preview.')
  .description('Preview the specified markdown file.')
  .action((mdFilePath, commands) => {
    const isWatch = commands.watch || false
    const isExists = fs.existsSync(mdFilePath)
    if (isExists) {
      portfinder.basePort = 8080
      portfinder.getPortPromise().then(port => {
        previewMarkdown(mdFilePath, port, isWatch)
      })
    } else {
      print(`warn`, 'What you specified is a non-existent file address.')
    }
  })

program
  .command('port <port>')
  .description('View programs that occupy the specified port.')
  .action(port => {
    if (!/^[0-9]*$/.test(port)) {
      const p = chalk.magenta(`${port}`)
      return print(`warn`, `✘ Unacceptable port specification: ${p}.`)
    }
    exec(`${checkPort(port)}`, (error, stdout, stderr) => {
      if (error) return print(`error`, `✘ Opps, Something Error: ${error}`)
      console.log(stdout)
    })
  })

program
  .command('prettier <path>')
  .alias('p')
  .description('Prettier the code under the specified path.')
  .action(param => {
    const options = getPrettifyOptions()
    exec(`npx prettier ${options} --write ${getPrettify(param)}`, (error, stdout, stderr) => {
      console.log(stdout)
      if (error) return print(`error`, `✘ Opps, Something Error: ${error}`)
      print(`success`, '✓ Okay, Has successfully prettier your code.')
    })
  })

program
  .command('qrcode <path>')
  .description('Generate a QR code based on the specified string.')
  .option('-s, --save', 'Save the generated QR code locally.')
  .option('-w, --width <width>', 'Specify the width of the Qrcode (300).')
  .action((string, commands) => {
    generateQrcode(string, commands)
  })

program
  .command('rename <path>')
  .description('Rename batch files (Incremental).')
  .option('-n, --name <name>', 'New file name specified (String).')
  .option('-i, --initial <initial>', 'Initial incremental value (Number).')
  .option('-s, --separator <separator>', 'Separator between name and incremental value (-).')
  .option('-d, --digits <digits>', 'Specify incremental digits value (3).')
  .action((string, commands) => {
    renameBatchFiles(string, commands)
  })

program
  .command('server')
  .alias('s')
  .option('-h, --https', 'Launch an HTTPS server on the specified port.')
  .description('Used to quickly build a local web server.')
  .action(params => {
    const protocol = params.https ? `https` : 'http'
    portfinder.basePort = 8080
    portfinder.getPortPromise().then(port => {
      exec(`npx http-server --port ${port} ${params.https ? '--ssl' : ''}`, error => {
        if (error) return print(`error`, `✘ Opps, Something Error: ${error}`)
      })
      showServerAdress(port, protocol)
    })
  })

program
  .command('watcher <path>')
  .alias('w')
  .description('Listen for code changes in the specified path and prettier them.')
  .action(param => {
    print(`normal`, 'Be ready to prettier your changed code.')
    const options = getPrettifyOptions()
    exec(
      `npx onchange ${getPrettify(param)} -- npx prettier ${options} --write {{changed}}`,
      (error, stdout, stderr) => {
        console.log(stdout)
        if (error) return print(`error`, `✘ Opps, Something Error: ${error}`)
      }
    )
  })

program.parse(process.argv)

if (program.args.length === 0) {
  program.help()
}
