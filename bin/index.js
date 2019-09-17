#!/usr/bin/env node

const commander = require('commander')
const program = new commander.Command()
const path = require('path')
const { exec } = require('child_process')
const chalk = require('chalk')
const portfinder = require('portfinder')
const {
  clear,
  checkPort,
  getIp,
  getPrettify,
  getPrettifyOptions,
  print,
  saveQrcode2Local,
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
  .command('ip')
  .description('Find your local IP address and print it.')
  .action(() => {
    console.log(getIp())
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
  .action(param => {
    saveQrcode2Local(param)
  })

program
  .command('server')
  .alias('s')
  .option('-h, --https', 'Launch an HTTPS server on the specified port.')
  .description('Used to quickly build a local web server.')
  .action(params => {
    const protocol = params.https ? `https` : 'http'
    const pro = params.https ? `--https` : ''
    portfinder.basePort = 8080
    portfinder.getPortPromise().then(port => {
      const stack = resolve('./node_modules/lws-static')
      const index = resolve('./node_modules/lws-index')
      exec(`npx lws --stack ${stack} ${index} --port ${port} ${pro}`, error => {
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
