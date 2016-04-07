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
var sockets = {};
var intervals = {};

var aliens = {};
var alienCount = 0;
var createdAliens = false;

var shots = {};
var shotsCount = 0;



io.on('connection', function (socket) {

  playerCount++;

  if(playerCount == 1) {
    players[playerCount] = new Player (playerCount, socket, 0);
  } else if (playerCount == 2) {
    players[playerCount] = new Player (playerCount, socket, 360);
  } else {
    socket.emit('info', {msg: 'The game server is full! You can\'t play, but you can watch as the other plays'});
  }

  // DISCONNECT CLIENT: socket.disconnect();

});

var Player = function (id, socket, rotation) {

  this.id = id;
  this.socket_id = socket.id;
  this.x = 0;

  if(rotation == 0) {
    this.y = 10;
  } else if(rotation == 360) {
    this.y = config.map_height - config.player_height - 10;
  } else {
    this.y = 0;
  }

  this.nickname = 'Unnames' + playerCount;

  this.width = config.player_width;
  this.height = config.player_height;


  this.rotation = rotation;
  sockets[this.id] = socket;
  this.init();

}

Player.prototype = {
  log: function (data) {
    console.log('Player ' + this.id + ': ' + data);
  },
  init: function () {
    var socket = sockets[this.id];

    this.log('Connected');

    this.bindSockets();

    socket.emit('config', {socket_id: socket.id, id: this.id/*rotation: this.rotation*/});


  },
  bindSockets: function () {
    var socket = sockets[this.id];
    var player = this;

    socket.on('disconnect', function () {
      delete players[player.id];
      playerCount--;
      player.log('Disconnected');
    });

    socket.on('new-position', function (data) {
      if(data.activeKeys[39] == true) {
        if(player.x > 0) {
          player.x--;
        }
      }
      if(data.activeKeys[37] == true) {
        if(player.x < config.map_width - config.player_width) {
          player.x++;
        }
      }
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

  for(var x = 0;x <= alienX - 1;x++) {
    for(var y = 0; y <= alienY - 1;y++){
      alienCount++;
      aliens[alienCount] = new Alien (alienCount, x * (config.alien_width + config.alien_spacing), y * (config.alien_width + config.alien_spacing));
    }
  }
  console.log('Alien Group spawned');
};

setInterval(function () {
  if(Object.keys(players).length == 2) {
    if(createdAliens == false) {
      createAlienGroup();
      createdAliens = true;
    }
  }
}, 5000);

setInterval(function () {
  io.emit('map', {players: players, aliens: aliens, shots: shots});
}, 1000 / config.map_fps);
