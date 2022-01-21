
'use strict';
const tcb = require('@cloudbase/node-sdk');
const app = tcb.init({
  env: "test-1g6fmcaqc00fb341",
});
const auth = app.auth();
const db = app.database({
  env: "test-1g6fmcaqc00fb341",
});
const collection = db.collection('rankInfo');
exports.main = async (event, context) => {
  //上传数据到数据库
  if (event.action == 'upload') {

    let result = await collection.where({
      UID: event.param.uid
    }).get();

    if (result.data.length == 0) {
      let res = await collection.add({
        UID: event.param.uid,
        URL: event.param.url,
        USERNAME: event.param.userName,
        DATA: event.param.data,
      });
      return res;
    }
    else {
      let data = result.data[0];
      if (data.DATA < event.param.data) {
        let _id = data._id;
        let success = collection.doc(_id).update({
          URL: event.param.url,
          USERNAME: event.param.userName,
          DATA: event.param.data,
        });
        return success;
      }
    }

  }
  else if (event.action == 'inquire') {
    let result = await collection.orderBy('DATA', 'desc').skip(event.param.startNumber).limit(event.param.maxLimitNumber).get(); //desc从大到小（降序），asc从小到大（升序）
    if (result.data.length == 0) {
      return null;
    }
    else {
      return result.data;
    }
  }
  else if (event.action == 'inquireMyself') {
    let result = await collection.where({
      UID: event.param.uid,
    }).get();
    if (result.data.length == 0) {
      return null;
    }
    else {
      return result.data;
    }
  }
  else if (event.action == 'inquireAll') {
    let result = await collection.orderBy('DATA', 'desc').get();
    if (result.data.length == 0) { 
      return null;
    }
    else{
      return result.data;
    }
  }
};
