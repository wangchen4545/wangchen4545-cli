// 作者: Wendy
// init 指令

const fs = require('fs');
const inquirer = require('inquirer');
const shell = require('shelljs');
const path = require('path');
const chalk = require('chalk');
const {
  fnLoadingByOra,
  fetchReopLists,
  getTagLists,
  downLoadReop,
  copyTempToLoclhost,
  updateFiles
} = require('../utils/common');


async function initAction(){
  try{

    const answer2 = await inquirer.prompt([
    	{
      	type: 'input',
    		name: 'projectName',
    		message: '请输入项目名称：',
        default: 'vue-project',
    	},
		]);


    if(!isValidName(answer2.projectName)){
      console.log(chalk.red(`Invalid project name:“${answer2.projectName}”\n`));
      return
    }

    const distProjectDir = path.resolve(process.cwd(), answer2.projectName);//获取当前目标路径

    if(fs.existsSync(answer2.projectName)){
      const answer3 = await inquirer.prompt([
        {
          type: 'list',
          name: 'isDel',
          message: '目标文件 '+ answer2.projectName +' 已存在， 请选择以下操作:',
          choices: ['覆盖','取消']
        }
      ]);

      if(answer3.isDel == '覆盖'){
        shell.rm('-rf', distProjectDir);//删除原文件
      }else{
        return
      }
    }

    
    let repos = await fnLoadingByOra(fetchReopLists, '正在链接你的仓库...')();
    let templateName = [];
    //过滤仓库名称
    repos.forEach((item) => {
      if(item.name.indexOf('template-') != -1){
        templateName.push(item);
      }
    });
    // console.log(repos,"reposreposreposrepos")
    // let reposName = repos.map((item) => item.name);
    
    // 只获取带有temppate名字的仓库列表
    const { repo } = await inquirer.prompt([
      {
        type: 'list',
        name:'repo',
        message:'请选择模版：',
        choices: templateName 
       }
    ]);
    
    let tag = await fnLoadingByOra(getTagLists, `正在链接你选择的仓库${repo}的版本号...`)(repo);

    await fnLoadingByOra(downLoadReop, '下载项目中...')(repo, tag ? tag : "", answer2.projectName);

    const dir = path.join(path.resolve(), repo);
    
    await updateFiles(dir,answer2.projectName);

    await copyTempToLoclhost(repo,distProjectDir);

    console.log("远程拉取模板成功");

    console.log( "\r\n" +"cd "+ answer2.projectName + "\r\n" + "npm install" +"\r\n" );

  }catch(error){
    console.log(chalk.red(`拉取模版失败，错误信息：${error} \n`));
  }
}

function isValidName(v) {
  // 规则一：输入的首字符为英文字符
  // 规则二：尾字符必须为英文或数字
  // 规则三：字符仅允许-和_两种
  // \w=a-zA_Z0-9_
  return /^[a-zA-Z]+([-][a-zA-Z][a-zA-Z0-9]*|[_][a-zA-Z][a-zA-Z0-9]*|[a-zA-Z0-9])*$/.test(v)
}

module.exports = initAction;