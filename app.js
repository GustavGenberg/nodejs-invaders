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

var players = [];
var playerCount = 0;

var aliens = [];
var alienCount = 0;
var createdAliens = false;

var shots = [];
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

    this.log('Connected');

    this.socket.emit('config', {socket_id: socket.id});
    this.bindSockets();

  },
  bindSockets: function () {
    this.socket.on('disconnect', function () {
      this.log('Disconnected');
    });
    this.socket.on('new-nickname', function (data) {
      this.nickname = data.nickname.substring(0,10).replaceAll(' ', '');
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
  init(): function () {

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

  for(var i = 0;i < alienY * alienX - 1) {
    aliens[alienCount] = new Alien (alienCount, x, y);
  }
};

setInterval(function () {
  if(Object.keys(players).length == 2) {
    if(createdAliens == false) {
      createAlienGroup();
      createdAliens = true;
    }
  }
}, 5000);
