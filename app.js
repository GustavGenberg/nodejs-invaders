var express = require('express');
var app = express();
var config = require('./config.js');
var io = require('socket.io')(config.socket_port);

app.use(express.static(__dirname + '/http/'));

app.listen(config.express_port, function () {
  console.log('Express server running on port ' + config.express_port);
});
