const BASE_PROXY_URL = `${process.env.API_URL}/api`
var AddressHelper = require("../AddressHelper")
import _ from 'lodash';

class ProxyRequest {
  constructor({method, path, body, headers, shouldRedirect}) {
    this.method = method
    this.path = path
    this.body = body
    this.headers = headers
  }

  buildUrl() {
    return BASE_PROXY_URL + this.path
  }

  buildHeaders() {
    let headers = this.headers || {}
    let defaultHeaders = {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "ip_address": AddressHelper.address,
      "origin": "http://localhost:9000"
    }
    headers = _.merge(defaultHeaders, headers)
    return new Headers(headers)
  }

  buildBody() {
    var data =JSON.stringify(this.body);
    return data
  }

  buildRequestOptions() {
    return {
      method: this.method,
      credentials: "include",
      mode: "cors",
      body: this.buildBody(),
      headers: this.buildHeaders()
    }
  }

  buildRequest() {
    return new Request(this.buildUrl(), this.buildRequestOptions())
  }

  request() {
    var _this = this;
    return new Promise(function(resolve, reject) {
      fetch(_this.buildRequest()).then(function(response) {
        if (response.status === 503) {
          if (_this.shouldRedirect) { window.location.href = "/maintenance" }
          reject(response)
          return
        }
        if (response.status >= 200 && response.status < 300) {
          response.json().then(function(body) {
            resolve({
              body: body,
              status: response.status
            })
          }, function(err) {
            debugger
          })
        } else {
          response.json().then(function(body) {
            reject({
              body: body,
              status: response.status
            })
          }, function(err) {
            debugger
          })
        }
      }).catch(reject)
    })
  }
}

var ProxyRequester = function() {
  return {
    get: function({headers, path, shouldRedirect}) {
      return new ProxyRequest({
        headers: headers,
        path: path,
        shouldRedirect: shouldRedirect,
        method: "get"
      }).request()
    },
    post: function({headers, path, body, shouldRedirect}) {
      return new ProxyRequest({
        headers: headers,
        shouldRedirect: shouldRedirect,
        path: path,
        body: body,
        method: "post"
      }).request()
    },
    deleteRequest: function({headers, path, shouldRedirect}) {
      return new ProxyRequest({
        headers: headers,
        shouldRedirect: shouldRedirect,
        path: path,
        method: "delete"
      }).request()
    }
  }
}

module.exports = ProxyRequester();
