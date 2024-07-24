// 作者: Wendy
// init 指令

const path = require('path');
const { uploadFileStreamly } = require('../utils/common');
const  deployConfig = require("../utils/constants")
const {
  url,
  remotePath,
  callback
} = deployConfig;

async function testAction(){
  console.log("I am a test");

  const projectConfig = joyer.util.require(path.resolve(__root, './joyer-config'));
                deployConfig = {
                    ...defaultConfig,
                    ...projectConfig['deploy']
                };

  uploadFileStreamly({
    url,
    filePath: path.resolve(process.cwd(), localPath),
    params: {
        my_field: remotePath
    },
    rootDirName: archiveRootDirName
})
.then(result => {
    deploying.stop();
    let res = {};
    try{
        res = JSON.parse(result);
    }
    catch(e){
        res = {
            error: result
        };
    }
    if(callback && callback.constructor === Function){
        const dirHasHtml = joyer.util.getFirstFolderHasHtml(localPath) || '';
        const accessPath = archiveRootDirName ? [archiveRootDirName, dirHasHtml].join('/') : dirHasHtml;
        callback(res, accessPath);
    }
})
.catch(err => {
    deploying.stop();
    joyer.log.error(err);
});
}

module.exports = testAction;