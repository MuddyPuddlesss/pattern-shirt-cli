#! /usr/bin/env node 

import chalk from 'chalk'
import { program } from 'commander'
import figlet from 'figlet'
import create from './../lib/create.js'

program
  // 定义命令和参数
    .command('create <app-name>')
    .description('create a new project')
  // -f or --force 为强制创建，如果创建的目录存在则直接覆盖
    .option('-f, --force', 'overwrite target directory if it exist')
    .action((name, options) => {
    // 打印执行结果
        create(name, options)
    })

// 配置 config 命令
program
    .command('config [value]')
    .description('inspect and modify the config')
    .option('-g, --get <path>', 'get value from option')
    .option('-s, --set <path> <value>')
    .option('-d, --delete <path>', 'delete option from config')
    .action((value, options) => {
        console.log(value, options)
    })

// 配置 ui 命令
program
    .command('ui')
    .description('start add open roc-cli ui')
    .option('-p, --port <port>', 'Port used for the UI Server')
    .action((option) => {
        console.log(option)
    })

program
   // 配置版本号信息
    .version(`v1.0.0`)
    .usage('<command> [option]')

// 监听 --help 执行
program
    .on('--help', () => {
        // 使用 figlet 绘制 logo
        console.log('\r'
        + figlet.textSync('XJJ', {
            font: '3D-ASCII',
            horizontalLayout: 'default',
            verticalLayout: 'default',
            width: 90,
            whitespaceBreak: true
        })
        )

        // 新增说明信息
        console.log(`\r
运行 ${chalk.cyan(`psc <command> --help`)} 获得提示
        `)
    })

// 解析用户执行命令传入参数
program.parse(process.argv);