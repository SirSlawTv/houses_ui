class ErrorResponseParser {
  constructor(response) {
    this.response = response
  }

  messages() {
    var _this = this;
    let response = this.response
    if (response.status < 500) {
      let errors = response.body.errors || [
        {
          attribute: "there ",
          message: "was an error"
        }
      ]
      return errors.map(function(error) {
        return _this.buildMessage(error)
      })
    } else {
      debugger
    }
  }

  buildMessage(errorNode) {
    return errorNode.attribute + " " + errorNode.message
  }
}

module.exports = ErrorResponseParser;
