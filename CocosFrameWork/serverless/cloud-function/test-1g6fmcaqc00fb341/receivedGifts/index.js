
'use strict';
const tcb = require('@cloudbase/node-sdk');
const app = tcb.init({
  env: "test-1g6fmcaqc00fb341",
});
const auth = app.auth();
const db = app.database({
  env: "test-1g6fmcaqc00fb341",
});
const collection = db.collection('receivedGifts');
const _ = db.command;
exports.main = async (event, context) => {
  if(event.action == 'upload'){
    let result = await collection.add({
      USERNAME:event.param.userName,
      TYPE:event.param.type,
      RECEIVEDTIME:new Date().getTime(),
    });
    return result;
  }
  else if(event.action == 'delete'){
    let res = await collection.where({
      RECEIVEDTIME:_.lt(new Date().getTime()),
    }).remove();
    return res;
  }
};
