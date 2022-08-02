import path from 'path'
import fs from 'fs-extra'
import inquirer from 'inquirer'
import {Generator} from './../lib/generator.js'

export default async function(name, options) {
    // 执行创建命令
    console.log('name:', name)

    // 当前命令行选择的目录
    const cwd = process.cwd()
    // 需要创建的目录地址
    const targetDir = path.join(cwd, name)

    console.log('cwd:', cwd, fs.existsSync(targetDir))

    // 目录是否存在？？
    if (fs.existsSync(targetDir)) {

        //  是否为强制创建
        if (options.force) {
            await fs.remove(targetDir)
        } else {
            // 询问用户是否确定要覆盖
            let { action } = await inquirer.prompt([
                {
                    name: 'action',
                    type: 'list',
                    message: 'Target directory already exists Pick an action:',
                    choices: [
                        {
                            name: '覆盖',
                            value: 'overwrite'
                        },
                        {
                            name: '不了',
                            value: false
                        }
                    ]
                }
            ])

            if (!action) {
                return;
            } else if (action === 'overwrite') {
                console.log(`\r
Removing...`)
                await fs.remove(targetDir)
            }
        }
    }

    // 创建项目
    const generator = new Generator(name, targetDir)
    generator.create()
}