
'use strict';
const tcb = require('@cloudbase/node-sdk');
const app = tcb.init({
  env: "test-1g6fmcaqc00fb341",
});
const auth = app.auth();
exports.main = async (event, context) => {
  if(event.action == 'getUID'){
    return auth.getUserInfo().uid;
  }
};
