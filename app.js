var express = require('express');
var app = express();
var config = require('./config.js');
var io = require('socket.io')(config.socket_port);

app.use(express.static(__dirname + '/http/'));

app.listen(config.express_port, function () {
  console.log('Express server running on port ' + config.express_port);
});



String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

var players = {};
var playerCount = 0;

var aliens = {};
var alienCount = 0;
var createdAliens = false;

var shots = {};
var shotsCount = 0;



io.on('connection', function (socket) {

  playerCount++;
  players[playerCount] = new Player (playerCount, 'Unnamed', socket);

});

var Player = function (id, nickname, socket) {

  this.id = id;
  this.nickname = nickname;
  this.socket = socket;

  this.init();

}

Player.prototype = {
  log: function (data) {
    console.log('Player ' + this.id + ': ' + data);
  },
  init: function () {
    var player = this;

    player.log('Connected');

    player.socket.emit('config', {socket_id: player.socket.id});
    player.bindSockets();

  },
  bindSockets: function () {
    var player = this;
    player.socket.on('disconnect', function () {
      player.log('Disconnected');
    });
    player.socket.on('new-nickname', function (data) {
      player.nickname = data.nickname.substring(0,10).replaceAll(' ', '');
    });
  }
};


var Alien = function (id, x, y) {
  this.id = id;
  this.x = x;
  this.y = y;

  this.init();
};


Alien.prototype = {
  log: function (data) {
    console.log('Alien ' + this.id + ': ' + data);
  },
  init: function () {

    aliens[this.id] = {id: this.id, x: this.x, y: this.y};

  }
};

var Shot = function (id, x, y, owner) {
  this.id = id;
  this.x = x;
  this.y = y;
  this.owner = owner;

  this.init();
}

Shot.prototype = {
  log: function (data) {
    console.log('Shot ' + this.id + ': ' + data);
  },
  init: function () {

  }
};

var createAlienGroup = function () {
  var startX = 10;
  var startY = 10;

  var alienX = 5;
  var alienY = 4;

  for(var i = 0;i <= alienX - 1;i++) {
    for(var j = 0; j <= alienY - 1;j++){
      alienCount++;
      aliens[alienCount] = new Alien (alienCount, i * 40, j * 40);
    }

  }
};

setInterval(function () {
  if(Object.keys(players).length == 1) {
    if(createdAliens == false) {
      createAlienGroup();
      createdAliens = true;
    }
  }
}, 5000);

setInterval(function () {
  io.emit('map', {aliens: aliens, shots: shots});
  console.log(aliens);
}, 1000 / config.map_fps);
