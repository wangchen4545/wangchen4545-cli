// 作者: Wendy
// 入口文件
'use strict';

const { Command } = require('commander');
const { version } = require("./utils/constants");
const initAction = require("./action/init");
const testAction = require("./action/test");
const figlet = require("figlet");
const chalk = require("chalk");



const program = new Command();
program
  // 定义命令和参数
  .command("init")
  //.alias("i") // 命令的别名
  .description("create a new project")
  // -f or --force 为强制创建，如果创建的目录存在则直接覆盖
  .option("-f, --force", "overwrite target directory if it exist")
  .action((name, options) => {
    initAction();
  });


program.on("option:version", function () {
  console.log(
    chalk.red(
      "\r\n" +
        figlet.textSync("enjoy wealth", {
          // font: 'Ghost',
          horizontalLayout: "default",
          verticalLayout: "default",
          width: 100,
          whitespaceBreak: true,
        })
    )
  );
});

program
  .version(version, "-v, --version", "print we version")
  .parse(process.argv); // process.argv就是用户在命令行中传入的参数  必不可少
