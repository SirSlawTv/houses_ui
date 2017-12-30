import React from 'react';
import ReactDOM from 'react-dom';
require("./lib")
import createBrowserHistory from 'history/createBrowserHistory'
import Routes from './routes';
const history = createBrowserHistory();

ReactDOM.render(
  <Routes history={history} />,
  document.getElementById('root')
);
