import {Socket} from "../../../Phoenix"
import _ from 'lodash';

class UserInstance {
  constructor(data) {
    _.assign(this, data);
  }

  currentSocket() {
    var _this = this
    if (this.currentWebSocket) {
      return this.currentWebSocket
    } else {
      let socket = new Socket(`${process.env.WEBSOCKET_HOST}/socket`,
        {
          params: {user: _this.identifier},
          transport: WebSocket
        }
      )
      socket.connect();
      this.currentWebSocket = socket;
      return socket
    }
  }
}

module.exports = UserInstance;
