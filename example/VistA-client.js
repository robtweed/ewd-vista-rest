var request = require('ewdjs/node_modules/request');
var vistaSecurity = require('ewd-vista-security');

// ************************
//   Change to a valid Access Code / Verify Code for your system
//    and modify the URL for your EWD.js system

var ac = 'worldvista6';
var vc = '$#happy7';

var baseUrl = 'http://192.168.1.154:8080/vista/';

// *************************

var authorization;

function login(credentials, ac, vc) {

  authorization = credentials.Authorization;
  var url;
  var form;
  if (credentials.key && credentials.iv) {
    var encrypted = vistaSecurity.avEncrypt(ac, vc, credentials.key, credentials.iv);
    form = {
      credentials: encrypted
    };
  }
  else {
    form = {
      accessCode: ac,
      verifyCode: vc
    };
  }
  var options = {
    url: baseUrl + 'login',
    method: 'POST',
    timeout: 5000,
    json: true,
    headers: {
      Authorization: credentials.Authorization,
    },
    form: form
  };
  request(options, function (error, response, body) {
    if (error) {
      console.log('Error sending login message: ' + error);
    }
    else {
      var body = response.body;
      var statusCode = response.statusCode;
      if (statusCode === 200) {
        console.log('login response: ' + JSON.stringify(body, null, 2));
        getPatientDetails(780, function() {
          echo('Hello RPC!');
        });
      }
      else {
        console.log('Error returned: ' + statusCode + ' ' + response.statusMessage + ': ' + JSON.stringify(body));
      }
    }
  });
}

function getPatientDetails(patientId, callback) {
  //invokeRPC('ORWPT SELECT?literal=' + patientId + '&format=raw')
  invokeRPC('patient?patientId=' + patientId, true, callback);
};

function echo(text, callback) {
  invokeRPC('XWB EGCHO STRING?literal=' + text, false, callback);
}

function invokeRPC(url, custom, callback) {
  var xurl = baseUrl + 'runRPC/' + url;
  if (custom) xurl = baseUrl + url;
  var options = {
    url: xurl,
    timeout: 5000,
    json: true,
    headers: {
      Authorization: authorization
    }
  };
  request(options, function (error, response, body) {
    if (error) {
      console.log('Error returned: ' + error);
    }
    else {
      var body = response.body;
      var statusCode = response.statusCode;
      if (statusCode === 200) {
        console.log(url + ' response: ' + JSON.stringify(body, null, 2));
        if (callback) callback();
      }
      else {
        console.log('Error returned: ' + statusCode + ' ' + response.statusMessage + ': ' + JSON.stringify(body));
      }
    }
  });
}


var options = {
  url: baseUrl + 'initiate',
  timeout: 5000,
  json: true
};

request(options, function (error, response, body) {
  if (error) {
    console.log('Error sending initiate message: ' + error);
  }
  else {
    var credentials = response.body;
    console.log('response: ' + JSON.stringify(body, null, 2));
    login(credentials, ac, vc);
  }
});
