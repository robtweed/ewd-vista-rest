var ewdjs = require('ewdjs');

var params = {
  poolSize: 2,
  httpPort: 8080,
  traceLevel: 3,
  database: {
    type: 'cache',
    path:"/opt/cache/mgr",
    username: "_SYSTEM",
    password: "SYS",
    namespace: "GOLD"
  },
  management: {
    password: 'keepThisSecret!'
  },
  childProcess: {
    customModule: 'ewd-vista-handlers'
  }
};

ewdjs.start(params, function() {
  ewd.customObj = {
    encryptAVCode: false, // if true (default) then AVCode must be encrypted before use in login request
    handlerExtensionModule: 'myAddedHandlers',  // custom extensions to RPC URL handlers & optional post-login processing
    runRPC: {
      REST: false, // if false, runRPC can't be directly invoked via REST requests (default true)
      EWD: true    // if false, runRPC can't be directly invoked via EWD.js WebSocket messages (default true)
    }
  };
  var ewdRest = require('ewd-vista-rest');
});
