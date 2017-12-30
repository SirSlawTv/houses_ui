import React, { Component } from 'react';
import { Link } from 'react-router-dom'
var User = require("../../lib/User");

class Header extends Component {
  constructor() {
    super()
    this.state = {
      responded: false,
      isLoggedIn: false
    }
    this.logout = this.logout.bind(this);
    this.login = this.login.bind(this);
    this.toggleUserDropdown = this.toggleUserDropdown.bind(this);
    this.checkStatus = this.checkStatus.bind(this);
  }

  componentDidMount() {
    this.checkStatus();
  }

  checkStatus() {
    var _this = this;
    User.isLoggedIn().then(function(user) {
      _this.setState({
        user: user,
        responded: true,
        isLoggedIn: true
      })
    }, function() {
      _this.setState({
        user: undefined,
        responded: true,
        isLoggedIn: false
      })
    });
  }

  logout(e) {
    var _this = this;
    User.logout().then(function() {
      _this.setState({
        responded: true,
        isLoggedIn: false
      })
    }, function(res) {
      console.log(res)
    })
  }

  toggleUserDropdown() {
    this.setState({
      userDropdownShow: !this.state.userDropdownShow,
    })
  }

  login(e) {
    const twitchAuthURL = `https://api.twitch.tv/kraken/oauth2/authorize?response_type=code&client_id=${process.env.TWITCH_CLIENT_ID}&redirect_uri=${process.env.LOGIN_REDIRECT_URL}&scope=user_read+openid`;

    location.href = twitchAuthURL;
    this.setState({
      responded: false,
    })
  }

  render() {
    let {responded, isLoggedIn, userDropdownShow} = {...this.state}
    return(
      <div className="App-header">
        <Link to="/">Root</Link>
        {
          responded && isLoggedIn && <div>
            <ul>
              <li><a name="userDropdown" onClick={this.toggleUserDropdown}>{this.state.user.name}</a></li>
            </ul>
            <div>
              {userDropdownShow &&
                <ul>
                  <li><a name="logout" onClick={this.logout}>Logout</a></li>
                </ul>
              }
            </div>
          </div>
        }
        {
          responded && !isLoggedIn && <div>
            <li><a name="login" onClick={this.login}>Login</a></li>
          </div>
        }
      </div>
    )
  }
}

export default Header;
