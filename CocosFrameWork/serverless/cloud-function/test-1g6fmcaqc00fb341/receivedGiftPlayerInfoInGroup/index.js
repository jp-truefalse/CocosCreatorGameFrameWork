
'use strict';
const tcb = require('@cloudbase/node-sdk');
const app = tcb.init({
  env: "test-1g6fmcaqc00fb341",
});
const auth = app.auth();
const db = app.database({
  env: "test-1g6fmcaqc00fb341",
});
const collection = db.collection('receivedGiftPlayerInfoInGroup');
const _ = db.command;

/**
 * 用于判断是否在规定时间内已经领取过该玩家赠送的礼物（群组里）
 * @param {*} event 
 * @param {*} context 
 */
exports.main = async (event, context) => {

  if (event.action == 'upload') {
    let result = await collection.where({
      UID: event.param.uid,
    }).get();

    if (result.data.length == 0) {
      let res = await collection.add({
        UID: event.param.uid,
        RECEIVEDTIME: new Date().getTime(),
      });
      return res;
    }
    else {
      let data = result.data[0];
      let _id = data._id;
      let success = collection.doc(_id).update({
        RECEIVEDTIME: new Date().getTime(),
      });
      return success;
    }
  }
  else if (event.action == 'inquire') {
    let result = await collection.where({
      UID: event.param.uid,
    }).get();
    if (result.data.length == 0) { 
      return null;
    }
    else{
      return result.data[0];
    }
  }
  else if(event.action == 'delete'){
    let result = await collection.where({
      RECEIVEDTIME:_.lte(new Date().getTime()),
    }).remove();
    return result;
  }
};
