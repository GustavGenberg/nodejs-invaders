
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

var socket;

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
    console.log(data.aliens);
  });
};

var init = function () {

  console.log('init()');

  bindSockets();

  var canvas = document.getElementById('game-canvas');
  var ctx = canvas.getContext('2d');

  var player = [];
  player.x = 0;
  player.y = 0;

  player.d = true;

  setInterval(function () {

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

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(config.player, player.x, player.y);
  }, 1000 / 30);


};
