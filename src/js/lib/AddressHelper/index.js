class AddressHelper {
  constructor() {
    this.setProperties();
  }

  setProperties() {
    var _this = this;
    fetch('https://api.ipify.org?format=json').then(function(response) {
      response.json().then(function(body) {
        _this.address = body.ip
      }, function(err) {
        console.log(err)
      })
    })
  }
}

module.exports = new AddressHelper();
