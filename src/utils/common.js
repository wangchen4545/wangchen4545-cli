// 作者: Wendy
// 公共方法
"use strict";

const fs = require("fs");
const ora = require("ora");
const axios = require("axios");
var async = require("async");

const { downloadDirectory } = require("./constants");
const chalk = require("chalk");
const shell = require("shelljs");
const handlebars = require("handlebars");
const path = require("path");

// 封装loading效果
const fnLoadingByOra =
  (fn, message) =>
    async (...argv) => {
      const spinner = ora(message);
      spinner.start();
      let result = await fn(...argv).catch((err) => {
        spinner.stop(); // 结束loading 失败

        return undefined;
      });
      if (result) {
        spinner.succeed(); // 结束loading
      } else {
        spinner.stop(); // 结束loading 失败
        
      }
      return result;
    };

// 1) 获取仓库列表
const fetchReopLists = async () => {
  const { data } = await axios
    .get(
      "https://api.github.com/users/wangchen4545/repos"
    )
    .catch((err) => {
      console.log(chalk.red(`连接远端失败，错误信息：${err} \n`));
      return {
        data: undefined,
      };
    });
  if (data && Array.isArray(data) && data.length == 0) {
    console.log(chalk.yellow(`\n 获取仓库列表为空 \n`));
    return;
  }
  return data;
};

//获取仓库的版本号信息
const getTagLists = async (id) => {
  console.log(id,"idadadadadad")
  const { data } = await axios
    .get(
      `https://api.github.com/repos/wangchen4545/${id}/tags`
    )
    .catch((err) => {
      console.log(chalk.red(`获取版本信息失败，错误信息：${err} \n`));
      return {
        data: undefined,
      };
    });
  if (data && Array.isArray(data) && data.length == 0) {
    console.log(chalk.yellow(`获取版本信息为空`));
    return undefined;
  }
  return data;
};

const updateFiles = async (root, projectName) => {
  // 向项目中写入 ask.js 文件

  // await new Promise((res, rej) => {
  let result1 = `
    const projectName = "${projectName}";    
    export { projectName };
    `;

  let result2 = `
    const projectName = "${projectName}";
    const projectPath = "/待修改路径/${projectName}/";
    
    module.exports = { projectPath, projectName };
    `;

  let files = [
    {
      name: "ask.module.js",
      content: result1,
    },
    {
      name: "ask.js",
      content: result2,
    },
  ];
  async.each(
    files,
    function (item, callback) {
      let dir = path.resolve(root, "", item.name);

      fs.writeFileSync(dir, item.content, (err) => {
        if (err) console.log(err);
      });
    },
    function (err) {
      if (err) {
        console.log(chalk.red("A file failed to processz"));
      } else {
        console.log(chalk.red("All files have been processed successfully"));
      }
    }
  );
};

//将项目下载到当前用户的临时文件夹下
const downLoadReop = async (repo, tag, projectName) => {
  let path = `${downloadDirectory}`;

  if (fs.existsSync(`${path}/${repo}`)) {
    shell.rm("-rf", `${path}/${repo}`); //删除原文件
  }
  shell.cd(path);

  try {
    // shell.exec(`git clone git@github.com:wangchen4545/${repo}.gitt`);
    // shell.exec(`git clone git@github.com:wangchen4545/${repo}.git`);
    shell.exec(`git clone https://github.com/wangchen4545/${repo}.git`);
    
    const meta = {
      name: projectName,
    };
    const fileName = `${repo}/package.json`;
    const content = fs.readFileSync(fileName).toString();
    const result = handlebars.compile(content)(meta);
    fs.writeFileSync(fileName, result);
  } catch (error) {
    console.log(chalk.red(`下载仓库${repo}信息失败，错误信息：${error} \n`));
  }

  return {
    path,
  };
};

// 复制项目从临时文件到本地工作项目
const copyTempToLoclhost = async (projectName, target) => {
  await new Promise((res, rej) => {
    const resolvePath = path.join(path.resolve(), projectName);
    const sourceProjectDir = path.resolve(resolvePath, "", "");
    
    try {
      shell.cp("-rf", sourceProjectDir, target);
      shell.rm("-rf", sourceProjectDir)
      shell.rm('-rf', target+"/.git");     //删除 .git 文件
      res();
      
    } catch (error) {
      console.log(chalk.red(`创建项目失败，错误信息：${error} \n`));
      rej();
    }
  });
};

module.exports = {
  fnLoadingByOra,
  fetchReopLists,
  getTagLists,
  downLoadReop,
  copyTempToLoclhost,
  updateFiles,
};
