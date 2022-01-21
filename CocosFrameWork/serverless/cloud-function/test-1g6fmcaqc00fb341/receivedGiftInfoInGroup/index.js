
'use strict';
const tcb = require('@cloudbase/node-sdk');
const app = tcb.init({
  env: "test-1g6fmcaqc00fb341",
});
const auth = app.auth();
const db = app.database({
  env: "test-1g6fmcaqc00fb341",
});
const collection = db.collection('receivedGiftInfoInGroup');
const _ = db.command;
exports.main = async (event, context) => {
  if (event.action == 'upload') {
    let result = await collection.add({
      UID: event.param.uid,
      SENDTIME: event.param.sendTime,
    });
    return result;
  }
  else if (event.action == 'inquire') {
    let res = await collection.where({
      UID: event.param.uid,
      SENDTIME: event.param.sendTime,
    }).get();
    if (res.data.length == 0) {
      return null;
    }
    else {
      return res.data[0];
    }
  }
  else if (event.action == 'delete') {
    let time = 12 * 3600 * 1000;  //可自定义（礼物失效的时间）
    let res = await collection.where({
      SENDTIME: _.lte(new Date().getTime() - time),
    }).remove();
    return res;
  }
};
