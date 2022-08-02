import { getRepoList, getTagList } from './http.js'
import ora from 'ora';
import inquirer from 'inquirer';
import downloadGitRepo from 'download-git-repo';
import util from 'util'
import path from 'path'
import chalk from 'chalk'

// 添加加载动画
async function wrapLoading(fn, message, ...argv) {
    // 使用 ora 初始化，传入提示信息 message
    const spinner = ora(message)
    spinner.start();

    try {
        // 执行传入方法 fn
        const result = await fn(...argv);
        spinner.succeed()
        return result
    } catch (error) {
        console.log(error, '======')
        spinner.fail('失败了...')
        
    }
}

class Generator {
    constructor(name, targetDir) {
        // 目录名称
        this.name = name;
        // 创建位置
        this.targetDir = targetDir;
        this.downloadGitRepo = util.promisify(downloadGitRepo)
    }

    /*
     * 获取使用者选择的模板
     * 1.远程拉取模版数据
     * 2.使用者选择自己新下载的模版名称
     * 3.return 用户选择的名称
     */
    async getRepo() {
        // 1.拉取模版数据
        const repoList = await wrapLoading(getRepoList, '拉取模版信息中...')
        if (!repoList) return;

        const TemplateList = ['vue-template', 'vue3.0-template']
        // 过滤我们需要的末班信息
        const repos = repoList.filter(repo => TemplateList.includes(repo.name)).map(item => item.name)

        const { repo } = await inquirer.prompt({
            name: 'repo',
            type: 'list',
            choices: repos,
            message: '请选择一个模版来创建项目'
        })
        return repo
    }

    /*
     * 获取使用者选择的版本
     * 1.基于repo结果 远程拉取对应的tag列表
     * 2.用户选择自己需要下载的tag
     * 3.return 用户选择的tag
     */
    async getTag(repo) {
        const tags = await wrapLoading(getTagList, '获取版本taging', repo);
        if (!tags) return;

        const tagList = tags.map(item => item.name)
        const tag = await inquirer.prompt({
            name: 'tag',
            type: 'list',
            choices: tagList,
            message: '请选择你需要的版本：'
        })
        return tag.tag
    }

    /*
     * 下载远程模版
     * 1.拼接下载地址
     * 2.调用下载方法
     */
    async download(repo, tag) {
        // 1,拼接下载地址
        const requestUrl = `MuddyPuddlesss/${repo}${tag?'#'+tag:''}`
        // 2.下载
        await wrapLoading(
            this.downloadGitRepo,
            '拉取模版中...',
            requestUrl,
            path.resolve(process.cwd(), this.targetDir) // 创建位置
        )
    } 

    // 创建逻辑
    async create() {
        // 1. 获取模版名称
        const repo = await this.getRepo()
        // 2/ 获取tag
        const tag = await this.getTag(repo)
        console.log('你选择了tag：', tag)

        // 3.下载模版到模版目录
        await this.download(repo, tag)

        // 4.模版使用提示
        console.log(`\r
Successfully created project ${chalk.cyan(this.name)}`)
            console.log(`\r
cd ${chalk.cyan(this.name)}`)
            console.log('  npm run dev\r')
    }
}

export {
    Generator
}