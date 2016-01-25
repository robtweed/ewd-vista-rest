/*

 ----------------------------------------------------------------------------
 | ewd-vista-rest.js:                                                       |
 |  EWD.js REST Interface for VistA: Master Process URL Interception Layer  |
 |                                                                          |
 | Copyright (c) 2016 M/Gateway Developments Ltd,                           |
 | Reigate, Surrey UK.                                                      |
 | All rights reserved.                                                     |
 |                                                                          |
 | http://www.mgateway.com                                                  |
 | Email: rtweed@mgateway.com                                               |
 |                                                                          |
 |                                                                          |
 | Licensed under the Apache License, Version 2.0 (the "License");          |
 | you may not use this file except in compliance with the License.         |
 | You may obtain a copy of the License at                                  |
 |                                                                          |
 |     http://www.apache.org/licenses/LICENSE-2.0                           |
 |                                                                          |
 | Unless required by applicable law or agreed to in writing, software      |
 | distributed under the License is distributed on an "AS IS" BASIS,        |
 | WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. |
 | See the License for the specific language governing permissions and      |
 |  limitations under the License.                                          |
 ----------------------------------------------------------------------------

  22 January 2016

*/


function getParams(httpParams) {
  var method = httpParams.request.method;
  var response = {
    headers: httpParams.request.headers,
    method: method
  };
  if (method === 'GET') {
    response.query = httpParams.urlObj.query;
  }
  if (method === 'POST' || method === 'PUT') {
    response.post_data = httpParams.postedData;
  }
  return response;
}

function getResponse(responseObj) {
  return ewd.process[responseObj.pid].response;
}

function getHeader() {
  return {
    Date: new Date().toUTCString(),
    'Content-Type': 'application/json'
  };
}

function sendResponse(contentObj, responseObj) {
  var response = getResponse(responseObj);
  var header = getHeader();
  response.writeHead(200, header);
  response.write(JSON.stringify(contentObj));
  response.end();
}

function sendErrorResponse(responseObj) {
  var response = getResponse(responseObj);
  var header = getHeader();
  var error = responseObj.error;
  response.writeHead(error.statusCode, error.statusMessage, header); 
  response.write('{"error": "' + error.message + '"}'); 
  response.end(); 
}

// Incoming URL Intercepts

ewd.http.all['/vista/'] = function(httpParams) {
  var pieces = httpParams.uri.split('/');
  var action = pieces[2];
  if (action && action !== '') {
    var message = {
      type: 'vista_rest',
      action: action,
      ajax: true,
      params: getParams(httpParams),
      response: httpParams.response
    };
    if (pieces.length > 3) {
      message.params.path = pieces.splice(3, pieces.length).join('/');
    }
    ewd.addToQueue(message);
  }
  else {
    var header = getHeader();
    var response = httpParams.response;
    response.writeHead(400, 'Bad Request', header); 
    response.write('{"error": "Invalid VistA REST URI"}');  
    response.end();
  }
};

// Child Response Handlers

ewd.childProcessMessageHandlers['vista_rest'] = function(responseObj) {
  if (responseObj.error) {
    sendErrorResponse(responseObj);
  }
  else {
    sendResponse(responseObj.content, responseObj);
  }
};



