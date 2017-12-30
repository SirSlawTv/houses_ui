import React, { Component } from 'react';
import { Router, Route, Switch } from 'react-router';
import { Link } from 'react-router-dom'

import Header from './components/Header';
import App from './components/App';
import CompleteLogin from './components/CompleteLogin'
import NotFound from './components/NotFound';
import Maintenance from './components/Maintenance';
var User = require("./lib/User");

class NoAuthRoute extends Route {
  componentDidMount() {
    var _this = this
    User.isLoggedIn("/").then(function(user) {
      _this.context.router.history.replace("/")
    }, function() {
      // do nothing
    });
  }
}

class AuthRoute extends Route {
  componentDidMount() {
    var _this = this;
    let route = this.context.router.route.location.pathname;
    User.isLoggedIn(route).then(function(user) {
      // do nothing
    }, function() {
      _this.context.router.history.replace("/login")
    });
  }
}

const Routes = (props) => (
  <Router {...props}>
    <div className="App">
      <Header />
      <Switch>
        <Route path="/complete_login" component={CompleteLogin}/>
        <Route path="/maintenance" component={Maintenance}/>
        <Route exact path="/" component={App} />
        <Route path="*" component={NotFound} />
      </Switch>
    </div>
  </Router>
);

export default Routes;
