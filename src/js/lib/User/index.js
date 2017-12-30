var ProxyRequester = require("../ProxyRequester")
var UserInstance = require("./lib/UserInstance")

class User {
  constructor() {
    this.shouldRequestStatus = true;
    this.redirectRoute = "/"
  }

  fetchCurrentStatus(shouldRedirect = true) {
    var _this = this
    return new Promise(function(resolve, reject) {
      let currentUser = _this.currentUserInstance
      if (currentUser) {
        resolve(currentUser)
      } else {
        if (_this.shouldRequestStatus) {
          ProxyRequester.get({
            path: "/v1/authentication/status",
            headers: {
              "Api-Version": "1.0.0"
            },
            shouldRedirect: shouldRedirect
          }).then(function(response) {
            _this.shouldRequestStatus = false
            currentUser = response.body
            _this.currentUserInstance = new UserInstance(currentUser)
            resolve(currentUser)
          }, function(response) {
            _this.shouldRequestStatus = false
            reject({})
            setTimeout(function(){
              _this.shouldRequestStatus = true
            }, 10000);
          })
        } else {
          reject({})
        }
      }
    })
  }

  login(params) {
    var _this = this;
    return new Promise(function(resolve, reject) {
      return ProxyRequester.post({
        path: "/v1/authentication/login",
        body: params,
        headers: {
          "Api-Version": "1.0.0"
        },
      }).then(function(res) {
        _this.currentUserInstance = new UserInstance(res.body)
        resolve(res)
      }, function(res) {
        reject(res)
      })
    })

  }

  logout() {
    var _this = this
    return new Promise(function(resolve, reject) {
      return ProxyRequester.deleteRequest({
        path: "/v1/authentication/logout",
        headers: {
          "Api-Version": "1.0.0"
        },
      }).then(function(res) {
        _this.currentUserInstance = undefined;
        resolve(res)
      }, function(res) {
        reject(res)
      })
    })
  }

  isLoggedIn(redirectRoute = "/", redirect = true) {
    if (redirectRoute) { this.redirectRoute = redirectRoute }
    return this.fetchCurrentStatus(redirect);
  }
}

module.exports = new User();
