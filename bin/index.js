#!/usr/bin/env node

const commander = require('commander')
const program = new commander.Command()
const path = require('path')
const chalk = require('chalk')
const portfinder = require('portfinder')
const { checkPort, getIp, print } = require('./../helper')
const { exec } = require('child_process')

const resolve = dir => {
  return path.join(__dirname, '..', dir)
}

const version = require(`./../package.json`).version
program.version(version, '-v, --vers', 'output the current version')

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
  .action(params => {
    exec(`npx prettier --write ${params}`, (error, stdout, stderr) => {
      console.log(stdout)
      if (error) return print(`error`, `✘ Opps, Something Error: ${error}`)
      print(`success`, '✓ Okay, Has successfully prettier your code.')
    })
  })

program
  .command('watcher <path>')
  .alias('w')
  .description('Listen for code changes in the specified path and prettier them.')
  .action(params => {
    print(`normal`, 'Be ready to beautify your changed code.')
    exec(`npx onchange ${params} -- npx prettier --write {{changed}}`, (error, stdout, stderr) => {
      console.log(stdout)
      if (error) return print(`error`, `✘ Opps, Something Error: ${error}`)
    })
  })

program.parse(process.argv)

if (program.args.length === 0) {
  program.help()
}
