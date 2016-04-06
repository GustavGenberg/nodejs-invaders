var express = require('express');
var app = express();
var config = require('./config.js');
var io = require('socket.io')(config.socket_port);

app.use(express.static(__dirname + '/http/'));

app.listen(config.express_port, function () {
  console.log('Express server running on port ' + config.express_port);
});



io.on('connection', function (socket) {

});

var Player = function (id, nickname) {

  this.id = id;
  this.nickname = nickname;

  this.init();
}

Player.prototype = {
  log: function (data) {
    console.log('Player ' + this.id + ': ' + data);
  },
  init: function () {

  }
};
