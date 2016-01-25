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
    encryptAVCode: false,
    handlerExtensionModule: 'myAddedHandlers'
  };
  var ewdRest = require('ewd-vista-rest');
});
