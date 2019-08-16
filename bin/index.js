#!/usr/bin/env node

const commander = require('commander')
const program = new commander.Command()
const chalk = require('chalk')
const print = require('./../helper/print')
const { exec } = require('child_process')

const version = require(`./../package.json`).version
program.version(version, '-v, --vers', 'output the current version')

program
  .command('ls')
  .alias('l')
  .description('List the script commands in package.json.')
  .action(() => {
    const scripts = require(`${process.cwd()}/package.json`).scripts
    print('success', 'List the script commands in package.json:')
    for (let key in scripts) {
      const colorKey = chalk.magenta(`${key}`)
      print('normal', `  ${colorKey}: ${scripts[key]}`)
    }
  })

program
  .command('prettier <path>')
  .alias('p')
  .description('Prettier the code under the specified path.')
  .action(params => {
    exec(`npx prettier --write ${params}`, (error, stdout, stderr) => {
      if (error) return print(`error`, `Something Error: ${error}`)
      print(`success`, 'Has successfully prettier your code.')
    })
  })

program
  .command('watcher <path>')
  .alias('w')
  .description('Listen for code changes in the specified path and prettier them.')
  .action(params => {
    console.log(params)
    exec(`npx onchange ${params} -- npx prettier --write {{changed}}`, (error, stdout, stderr) => {
      print(`normal`, 'Be ready to beautify your changed code.')
      console.log(stdout)
      console.log(stderr)
      if (error) return print(`error`, `Something Error: ${error}`)
    })
  })

program.parse(process.argv)

if (program.args.length === 0) {
  program.help()
}
