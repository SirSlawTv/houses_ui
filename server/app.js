const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser')
const app = express();
const fetch = require('node-fetch');
const request = require('request');
// Serve static assets
app.use(express.static(path.resolve(__dirname, '..', 'public')));
app.use(bodyParser.json());
app.use(cors())

var sendResponse = function({fetchResponse, expressResponse}) {
  let key;
  let responseHeaders = fetchResponse.headers
  let headers = responseHeaders && responseHeaders._headers;
  let status =fetchResponse.status;
  if (status) {
    for (key in headers) {
      expressResponse.setHeader(key, headers[key])
    }
    fetchResponse.json().then(function(body) {
      expressResponse.status(status).send(body)
    }, function(error) {
      expressResponse.status(status).send({})
    })
  } else {
    expressResponse.status(503).send({})
  }
}

var extractBody = function(request) {
  return JSON.stringify(request.body)
}

var buildHeaders = function(headers) {
  let mergedHeaders = {};
  let originalHeaders = headers;
  originalHeaders['Host'] = process.env.API_HOST
  return originalHeaders
}

var sendRequest = function({nodeRequest, response}) {
  let headers = buildHeaders(nodeRequest.headers);
  let body = extractBody(nodeRequest);
  let replacedPath = nodeRequest.url.replace(/\/sir_slaw_proxy/, '')
  let fullPath = process.env.API_URL + replacedPath;
  let options = {
    uri: fullPath,
    method: nodeRequest.method,
    headers: headers,
    body: body,
    rejectUnauthorized: false
  }
  fetch(fullPath, options).then(function(responseObj) {
    sendResponse({
      fetchResponse: responseObj,
      expressResponse: response
    })
  }, function(responseObj) {
    sendResponse({
      fetchResponse: responseObj,
      expressResponse: response
    })
  }).catch(function(e) {
    console.log(e)
  })
}

app.all('/sir_slaw_proxy/*', (req, res) => {
  sendRequest({
    nodeRequest: req,
    response: res
  })
});


var corsOpts = {
  origin: false,
  methods: ['GET','POST'],
  exposedHeaders: ["*"],
  credentials: true,
  maxAge: 3600
};
app.options('*', cors(corsOpts))

// Always return the main index.html, so react-router render the route in the client
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'public', 'index.html'));
});

module.exports = app;
