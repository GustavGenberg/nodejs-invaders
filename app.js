var express = require('express');
var app = express();
var config = require('./config.js');
var io = require('socket.io')(config.socket_port);

app.listen(config.express_port, function () {
  console.log('Express server running on port ' + config.express_port);
});

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/http/index.html');
});
app.get('/game.js', function (req, res) {
  res.sendFile(__dirname + '/http/game.js');
});
app.get('/game.css', function (req, res) {
  res.sendFile(__dirname + '/http/game.css');
});
