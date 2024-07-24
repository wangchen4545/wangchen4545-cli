// 作者: Wendy
// 存放用户的所需要的常量
'use strict';

const {
  name,
  version
} = require('../../package.json');
const MY_PLATFORM_ENV = process.env[process.platform === 'darwin' ? 'HOME' : 'USERPROFILE'];
const downloadDirectory = `${MY_PLATFORM_ENV}\/.myTempalte`;
const deployConfig = {}

module.exports = {
  name,
  version,
  downloadDirectory
}