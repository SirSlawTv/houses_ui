import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
var User = require("../../lib/User");
import parseUrlHash from '../../lib/UrlParser'

class CompleteLogin extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
    this.checkStatus();
  }

  checkStatus() {
    if (document.location.search) {
      let result = parseUrlHash(document.location.search)
      User.login({
        accessCode: result.code,
        scope: result.scope
      }).then(result => {
        this.setState({
          responded: true,
          success: true
        })
        window.location.href = User.redirectRoute
      }, err => {
        debugger
      })
    } else {
      this.setState({
        responded: true,
        success: false
      })
    }
  }

  render() {
    let {responded, success} = {...this.state}
    return(
      <div className="App-CompleteLogin">
        {responded && <div>

        </div>}
        {!responded && <div>
          Loading................
        </div>}
      </div>
    )
  }
}

export default CompleteLogin;
