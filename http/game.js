
var config = [];
config.socket_protocol = 'http';
config.socket_host = 'localhost';
config.socket_port = 7777;

config.alien = new Image ();
config.alien.src = '/images/alien.png';
config.player = new Image ();
config.player.src = '/images/player.png';
config.player.height = 30;
config.player.width = 30;
config.shot = new Image ();
config.shot.src = '/images/shot.png';

var socket;
var canvas = document.getElementById('game-canvas');
var ctx = canvas.getContext('2d');
var activeKeys = [];

function loadScript(url, callback) {
	var head = document.getElementsByTagName('head')[0];
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = url;
	script.onload = callback;
	head.appendChild(script);
}

loadScript('http://code.jquery.com/jquery-2.2.2.min.js', function () {
  loadScript(config.socket_protocol + '://' + config.socket_host + ':' + config.socket_port + '/socket.io/socket.io.js', function () {
    init();
  });
});

var bindSockets = function () {
  socket = io(config.socket_host + ':' + config.socket_port);

  socket.on('config', function (data) {
    config.server = [];
    config.server = data;
  });

  socket.on('map', function (data) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(alien in data.aliens) {
      ctx.drawImage(config.alien, data.aliens[alien].x, data.aliens[alien].y);
    }
    for(player in data.players) {
      if(data.players[player].id == config.server.id && config.server.socket_id == data.players[player].socket_id) {
        ctx.drawImage(config.player, canvas.width - data.players[player].x - data.players[player].width, canvas.height - 40);
        ctx.fillText(data.players[player].nickname, (canvas.width - data.players[player].x - data.players[player].width) - (data.players[player].nickname.length / 2), canvas.height - 40);
      } else {
        ctx.drawImage(config.player, data.players[player].x, 10);
        ctx.fillText(data.players[player].nickname, data.players[player].x - (data.players[player].nickname.length / 2), 10);
      }
    }
    for(shot in data.shots) {
      //ctx.drawImage(config.player, data.players[player].x, data.players[player].y);

      if(data.shots[shot].owner == config.server.id) {

        if(data.shots[shot].d == 0) {
          ctx.drawImage(config.shot, canvas.width - data.shots[shot].x - (config.player.width / 2), data.shots[shot].y);
        }
        if(data.shots[shot].d == 1) {
          ctx.drawImage(config.shot, canvas.width - data.shots[shot].x - (config.player.width / 2), canvas.height - data.shots[shot].y);
        }

      } else {
        if(data.shots[shot].d == 1) {
          ctx.drawImage(config.shot, data.shots[shot].x + (config.player.width / 2), data.shots[shot].y);
        }
        if(data.shots[shot].d == 0) {
          ctx.drawImage(config.shot, data.shots[shot].x + (config.player.width / 2), canvas.height - data.shots[shot].y);
        }
      }
    }
  });
  socket.on('info', function (data) {
    $(".status").html(data.msg);
  });

  setInterval(function () {
    socket.emit('new-position', {activeKeys: activeKeys});
  }, config.emit_interval);
};

var bindKeys = function () {
  document.addEventListener('keydown', function (event) {
    if(event.keyCode == 37) {
      activeKeys[37] = true;
    }
    if(event.keyCode == 39) {
      activeKeys[39] = true;
    }
    if(event.keyCode == 32) {
      activeKeys[32] = true;
    }
  });
  document.addEventListener('keyup', function (event) {
    if(event.keyCode == 37) {
      delete activeKeys[37];
    }
    if(event.keyCode == 39) {
      delete activeKeys[39];
    }
    if(event.keyCode == 32) {
      delete activeKeys[32];
    }
  });
};

var init = function () {

  console.log('init()');

  bindSockets();
  bindKeys();

  var player = [];
  player.x = 0;
  player.y = 0;

  player.d = true;

  /*setInterval(function () {

    if(player.d == true) {
      player.x++;
    } else {
      player.x--;
    }

    if(player.x == canvas.width - config.player.width) {
      player.d = false
    } else if (player.x == 0){
      player.d = true;
    }


  }, 1000 / 30);*/

  setInterval(function () {
    console.log(activeKeys);
  }, 1000);


};
